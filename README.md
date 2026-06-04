# Base Spark MiniApp

Base Spark is a mobile-first Base mini app built with Next.js, TypeScript, App Router, Wagmi, and Viem.

## Concept

Users tap one main button to claim an instant visible reward called Sparks. The reward appears after the connected wallet signs the smart contract transaction. The transaction uses Base attribution-ready calldata and does not require users to buy an app token.

The interface is English-only, mobile-first, and centered on one primary action: claim the daily spark.

## Wallets

The app does not use RainbowKit or WalletConnect. Wagmi is configured directly with:

- `injected()` for Base App, MetaMask, OKX, and browser-injected wallets
- `coinbaseWallet()` for Coinbase Wallet

The wallet button opens an explicit wallet picker. Smart wallets are not auto-selected; users can choose and disconnect their wallet.

## Attribution

Offchain attribution is hardcoded in `app/layout.tsx`:

```tsx
<meta name="base:app_id" content="6a212d621bf1ab98bb37b99d" />
```

Onchain attribution is centralized in `lib/wagmi.ts`:

```ts
export const ATTRIBUTION_DATA_SUFFIX = '0x' as `0x${string}`;
```

Every contract write must pass:

```ts
dataSuffix: ATTRIBUTION_DATA_SUFFIX
```

After base.dev verification, replace the empty `0x` suffix with the encoded builder code, then redeploy so onchain activity appears in the base.dev Dashboard.

## Environment

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7a28D52c770A0597B08B175dC853A82D4D610B68
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

## Local Development

```bash
npm install
npm run dev
```

The app runs on:

```bash
http://localhost:3006
```

## Build

```bash
npm run build
```

## Contract

The contract is deployed at `0x7a28D52c770A0597B08B175dC853A82D4D610B68`. The source reference is in `contracts/BaseSparkReward.sol`. Its front-end ABI lives in `lib/contract.ts`; keep the function name and parameters aligned if you change the contract.

## Deployment Values Needed

To push and deploy from this machine, provide:

- base.dev builder code encoded as a hex data suffix
