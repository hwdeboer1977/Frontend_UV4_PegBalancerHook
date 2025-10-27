# Soft Peg Mechanism Dashboard

Interactive dashboard for the Soft Peg mechanism - Buy, Mint & Redeem tokens with dynamic fees.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Alchemy API key:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
```

Get a free Alchemy API key at: https://www.alchemy.com/

### 3. Verify Contract Addresses

The default addresses in `.env.local` are for Arbitrum Sepolia testnet:

- **USDC**: `0xEa812481b0bd91417AE75687eEEA13FEE1B23Cf8`
- **yUSDC/Vault**: `0x41de4987ba19D073383c99EB3068B3e29A5C710e`
- **Hook**: `0xf7D8f9B115a5568a6F55f43BB6eFd81717F0A080`

Update these if deploying to a different network or using different contracts.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### 📊 Real-Time Stats

- **Vault Stats**: Total assets, shares, NAV price
- **LP Pool Stats**: Current LP price, liquidity, dynamic fees
- **User Balance**: USDC and yUSDC holdings

### 🏦 Mint Tokens (Vault)

- Deposit USDC to receive yUSDC at NAV price
- Zero fees
- Auto-approval of USDC

### 💰 Redeem Tokens (Vault)

- Two-step withdrawal process
- Initiate withdrawal (starts timelock)
- Complete withdrawal after redemption period

### 💱 Buy on LP (Coming Soon)

- Trade on Uniswap V4 pool
- Dynamic fees based on price deviation

## Configuration

### Soft Peg Settings

Edit in `.env.local`:

```env
NEXT_PUBLIC_DEADZONE_PERCENT=2    # 2% deadzone
NEXT_PUBLIC_BASE_FEE=0.3          # 0.3% base fee
```

### Pool Configuration

```env
NEXT_PUBLIC_POOL_FEE=3000         # 0.3% = 3000
NEXT_PUBLIC_POOL_TICK_SPACING=60
```

## Network

Currently configured for **Arbitrum Sepolia** testnet:
- Chain ID: 421614
- RPC: Alchemy
- Explorer: https://sepolia.arbiscan.io/

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ethers.js v6** - Ethereum interactions
- **Alchemy** - RPC provider

## Project Structure

```
soft-peg-app/
├── app/              # Next.js app directory
├── components/       # React components
├── hooks/            # Custom React hooks
├── constants/        # Contract ABIs and addresses
├── utils/            # Utility functions
└── .env.local       # Environment variables (not in git)
```

## Development

The app uses environment variables for all configuration. Never commit `.env.local` to git.

All contract addresses and configuration are centralized in:
- `/constants/contracts.ts` - Reads from env vars
- `/.env.local` - Your local configuration

## License

MIT
