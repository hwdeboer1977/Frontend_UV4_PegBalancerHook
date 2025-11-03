"use client";

import { useState } from "react";
import Scenarios from "@/components/Scenarios";
import Link from "next/link";

export default function ScenariosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="text-5xl font-bold text-slate-800 mb-2">
            Scenario Comparison
          </h1>
          <p className="text-lg text-slate-600">
            Compare Baseline, Soft Peg, and Full System performance
          </p>
        </div>

        {/* Scenarios Component */}
        <div className="mb-8">
          <Scenarios />
        </div>

        {/* Additional Explanation Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Understanding the Scenarios
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-xl font-bold text-red-700 mb-2">
                📉 Baseline - Fixed 0.3% Fee
              </h3>
              <p className="text-slate-700 mb-2">
                A standard AMM with no protection mechanism. When price
                deviates, there's no incentive for arbitrageurs to restore the
                peg quickly.
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Fixed 0.3% fee regardless of market conditions</li>
                <li>Slow price correction (5-60 minutes)</li>
                <li>MEV bots capture all arbitrage profits</li>
                <li>High impermanent loss for LPs</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-xl font-bold text-orange-700 mb-2">
                🛡️ Soft Peg - Dynamic Fees Only
              </h3>
              <p className="text-slate-700 mb-2">
                Smart fees that adjust based on deviation. Higher fees for
                destabilizing trades, lower fees for peg-restoring trades.
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Dynamic fees: 0.05% - 10% based on deviation</li>
                <li>Deters panic selling and buying</li>
                <li>Encourages external arbitrageurs</li>
                <li>Faster correction (2-10 minutes)</li>
                <li>Still relies on external actors</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-xl font-bold text-green-700 mb-2">
                ⚡ Full System - Dynamic Fees + ArbExecutor
              </h3>
              <p className="text-slate-700 mb-2">
                Combines passive protection (dynamic fees) with active
                correction (automated arbitrage). The protocol becomes
                self-healing.
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Same dynamic fees as Soft Peg</li>
                <li>Automated ArbExecutor monitors 24/7</li>
                <li>Instant correction when deviation exceeds 50%</li>
                <li>Protocol captures arbitrage profits</li>
                <li>Minimal impermanent loss for LPs</li>
                <li>Average correction time: &lt;12 seconds</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Metrics Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            📊 Key Metrics Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="py-3 px-4 font-bold text-slate-700">Metric</th>
                  <th className="py-3 px-4 font-bold text-red-700">Baseline</th>
                  <th className="py-3 px-4 font-bold text-orange-700">
                    Soft Peg
                  </th>
                  <th className="py-3 px-4 font-bold text-green-700">
                    Full System
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-4 font-medium">Max Deviation</td>
                  <td className="py-3 px-4 text-red-600">9.5%</td>
                  <td className="py-3 px-4 text-orange-600">9.5%</td>
                  <td className="py-3 px-4 text-green-600">9.5%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Correction Time</td>
                  <td className="py-3 px-4 text-red-600">5-60 min</td>
                  <td className="py-3 px-4 text-orange-600">2-10 min</td>
                  <td className="py-3 px-4 text-green-600">&lt;12 sec ⚡</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">LP Impermanent Loss</td>
                  <td className="py-3 px-4 text-red-600">High</td>
                  <td className="py-3 px-4 text-orange-600">Medium</td>
                  <td className="py-3 px-4 text-green-600">Low</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Arbitrage Profits</td>
                  <td className="py-3 px-4 text-red-600">External MEV</td>
                  <td className="py-3 px-4 text-orange-600">External Arbs</td>
                  <td className="py-3 px-4 text-green-600">Protocol ✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Fee Range</td>
                  <td className="py-3 px-4 text-red-600">0.30% (fixed)</td>
                  <td className="py-3 px-4 text-orange-600">0.05% - 10%</td>
                  <td className="py-3 px-4 text-green-600">0.05% - 10%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Protection Type</td>
                  <td className="py-3 px-4 text-red-600">None</td>
                  <td className="py-3 px-4 text-orange-600">Passive (fees)</td>
                  <td className="py-3 px-4 text-green-600">Passive + Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Try It Out?</h2>
          <p className="text-xl mb-6">
            Experience the Full System with dynamic fees and automated arbitrage
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </main>
  );
}
