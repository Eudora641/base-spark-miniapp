# Base Spark MiniApp

Base Spark is a mobile-first Base mini app built with Next.js, TypeScript, App Router, Wagmi, and Viem.

## Concept

Users tap one main button to claim an instant visible reward called Sparks. The first reward appears immediately without requiring a token purchase. If a contract address is configured and the user connects a wallet, the same action can also write an attribution-ready transaction on Base.

## Wallets

The app does not use RainbowKit or WalletConnect. Wagmi is configured directly with:

- `injected()` for Base App, MetaMask, OKX, and browser-injected wallets
- `coinbaseWallet()` for Coinbase Wallet

## Attribution

Offchain attribution is hardcoded in `app/layout.tsx`:

```tsx
<meta name="base:app_id" content="REPLACE_WITH_BASE_DEV_VERIFY_TOKEN" />
```

Onchain attribution is centralized in `lib/wagmi.ts`:

```ts
export const ATTRIBUTION_DATA_SUFFIX = '0x' as `0x${string}`;
```

Every contract write must pass:

```ts
dataSuffix: ATTRIBUTION_DATA_SUFFIX
```

After base.dev verification, replace the meta token and the encoded builder code, then redeploy.

## Environment

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourBaseSparkRewardContract
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

## Local Development

```bash
npm install
npm run dev
```

The app runs on:

```bash
http://localhost:3000
```

## Build

```bash
npm run build
```

## Contract

The optional contract is in `contracts/BaseSparkReward.sol`. Its front-end ABI lives in `lib/contract.ts`; keep the function name and parameters aligned if you change the contract.

## Deployment Values Needed

To push and deploy from this machine, provide:

- GitHub token with repo creation or push permission
- Vercel token
- GitHub repository name that does not include classification labels
- base.dev verify meta token
- base.dev builder code encoded as a hex data suffix
- Deployed contract address on Base
