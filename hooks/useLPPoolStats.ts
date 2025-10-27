"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  CONTRACTS,
  HOOK_ABI,
  ARBITRUM_SEPOLIA_CHAIN_ID,
  POOL_CONFIG,
  SOFT_PEG_CONFIG,
  getRpcUrl,
} from "@/constants/contracts";

interface LPPoolStats {
  lpPrice: string;
  priceRawE18: string;
  sqrtPriceX96: string;
  liquidity: string;
  fee: string;
  spread: string;
  deadzoneUpper: string;
  deadzoneLower: string;
  inDeadzone: boolean;
  isLoading: boolean;
  error: string | null;
}

const retry = async <T>(
  fn: () => Promise<T>,
  tries = 3,
  delayMs = 400
): Promise<T> => {
  let last: any;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      last = e;
      const is429 = /429|Too many requests/i.test(e?.message || "");
      await new Promise((r) =>
        setTimeout(r, is429 ? delayMs * (i + 1) : delayMs)
      );
    }
  }
  throw last;
};

export function useLPPoolStats(navPrice = "1.0000"): LPPoolStats {
  const [stats, setStats] = useState<LPPoolStats>({
    lpPrice: "0.00",
    priceRawE18: "0",
    sqrtPriceX96: "0",
    liquidity: "0",
    fee: SOFT_PEG_CONFIG.baseFee.toFixed(2),
    spread: "0.00",
    deadzoneUpper: "0.00",
    deadzoneLower: "0.00",
    inDeadzone: false,
    isLoading: true,
    error: null,
  });

  const fetchLPStats = useCallback(async () => {
    try {
      setStats((s) => ({ ...s, isLoading: true, error: null }));

      // Optional: if wallet present, warn when on the wrong chain (don’t block reads)
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const wp = new ethers.BrowserProvider((window as any).ethereum);
          const net = await wp.getNetwork();
          const cid = Number(net.chainId);
          if (cid !== ARBITRUM_SEPOLIA_CHAIN_ID) {
            setStats((s) => ({
              ...s,
              error: `Wallet on chain ${cid}; expected ${ARBITRUM_SEPOLIA_CHAIN_ID}`,
            }));
          }
        } catch {
          /* ignore */
        }
      }

      // Validate addresses
      const bad: string[] = [];
      if (!CONTRACTS.HOOK || !ethers.isAddress(CONTRACTS.HOOK))
        bad.push("HOOK");
      if (!ethers.isAddress(POOL_CONFIG.currency0))
        bad.push("POOL_CONFIG.currency0");
      if (!ethers.isAddress(POOL_CONFIG.currency1))
        bad.push("POOL_CONFIG.currency1");
      if (!ethers.isAddress(POOL_CONFIG.hooks)) bad.push("POOL_CONFIG.hooks");
      if (bad.length) {
        setStats((s) => ({
          ...s,
          isLoading: false,
          error: `Invalid address(es): ${bad.join(", ")}`,
        }));
        return;
      }

      // Read provider (your RPC)
      const read = new ethers.JsonRpcProvider(getRpcUrl());

      // Ensure hook exists on this chain
      const hookCode = await retry(() => read.getCode(CONTRACTS.HOOK!));
      if (hookCode === "0x") {
        setStats((s) => ({
          ...s,
          isLoading: false,
          error: "Hook not deployed on this RPC's chain",
        }));
        return;
      }

      const hook = new ethers.Contract(CONTRACTS.HOOK!, HOOK_ABI, read);

      // ethers v6 returns tuple as array with named fields as well
      const res: any = await retry(() => hook.currentPrices(POOL_CONFIG));

      const priceHumanLP = res[0] ?? res.priceHumanLP;
      const priceRawE18 = res[1] ?? res.priceRawE18;
      const sqrtP = res[2] ?? res.sqrtP;

      // Convert to numbers/strings
      const lpPriceValue = parseFloat(ethers.formatUnits(priceRawE18, 18));
      const navPriceValue = parseFloat(navPrice);

      const spreadPct = ((lpPriceValue - navPriceValue) / navPriceValue) * 100;

      const devBps =
        lpPriceValue > navPriceValue
          ? ((lpPriceValue - navPriceValue) * 10_000) / navPriceValue
          : ((navPriceValue - lpPriceValue) * 10_000) / navPriceValue;

      // For display purposes, show the deadzone as a price range around NAV
      const deadL =
        navPriceValue * (1 - SOFT_PEG_CONFIG.deadzonePercent / 10_000);
      const deadU =
        navPriceValue * (1 + SOFT_PEG_CONFIG.deadzonePercent / 10_000);

      // Check if we're inside the deadzone
      const inDead = devBps <= SOFT_PEG_CONFIG.deadzonePercent;

      let currentFee = SOFT_PEG_CONFIG.baseFee;
      if (!inDead) {
        const deviation = Math.abs(spreadPct);
        currentFee = Math.min(
          SOFT_PEG_CONFIG.baseFee +
            (deviation - SOFT_PEG_CONFIG.deadzonePercent) * 0.2,
          3.0
        );
      }

      // TODO: real liquidity pull (needs pool manager reads). Placeholder for now.
      const liquidity = "—";

      setStats({
        lpPrice: lpPriceValue.toFixed(4),
        priceRawE18: priceRawE18.toString(),
        sqrtPriceX96: sqrtP.toString(),
        liquidity,
        fee: currentFee.toFixed(2),
        spread: spreadPct.toFixed(2),
        deadzoneUpper: deadU.toFixed(2),
        deadzoneLower: deadL.toFixed(2),
        inDeadzone: inDead,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("Error fetching LP stats:", err);
      const msg = /429|Too many requests/i.test(err?.message || "")
        ? "RPC rate-limited. Add NEXT_PUBLIC_ALCHEMY_API_KEY or set NEXT_PUBLIC_RPC_URL."
        : err?.reason || err?.message || "Failed to fetch LP data";
      setStats((s) => ({ ...s, isLoading: false, error: msg }));
    }
  }, [navPrice]);

  useEffect(() => {
    fetchLPStats();
    const id = setInterval(fetchLPStats, 10_000);
    return () => clearInterval(id);
  }, [fetchLPStats]);

  return stats;
}
