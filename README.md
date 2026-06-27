# Base Spark MiniApp

Base Spark MiniApp is a mobile-first Base mini app built with Next.js, TypeScript, App Router, Wagmi, and Viem.

The app focuses on a single primary action: users connect a wallet and claim a daily Spark.

## Overview

Base Spark is designed to be simple, fast, and clear on mobile devices.

Users tap one main button to claim a visible reward called a Spark.

The reward is shown after the connected wallet signs and submits the smart contract transaction.

The interface is English-only and centered on the daily Spark claim flow.

## Project Details

- Project name: `base-spark-miniapp`
- Repository: `https://github.com/Eudora641/base-spark-miniapp.git`
- Framework: Next.js
- Language: TypeScript
- Router: App Router
- Web3 libraries: Wagmi and Viem
- Target network: Base
- Interface style: mobile-first

## Features

- Mobile-first mini app experience
- One primary claim action
- Daily Spark reward flow
- Direct Wagmi wallet configuration
- Explicit wallet picker
- User-controlled wallet connection and disconnection
- Base attribution metadata included
- Contract configuration centralized in the front end
- English-only interface

## Wallet Support

The app does not use RainbowKit or WalletConnect.

Wallet support is configured directly through Wagmi.

The configured connectors are:

- `injected()` for Base App, MetaMask, OKX, and browser-injected wallets
- `coinbaseWallet()` for Coinbase Wallet

The wallet button opens a direct wallet picker.

Smart wallets are not selected automatically.

Users choose their preferred wallet and can disconnect it from the interface.

## Attribution

Offchain attribution is configured in `app/layout.tsx`.

```tsx
<meta name="base:app_id" content="6a212d621bf1ab98bb37b99d" />
```

Onchain attribution is centralized in `lib/wagmi.ts`.

```ts
export const ATTRIBUTION_DATA_SUFFIX =
  '0x62635f6d706b74757765610b0080218021802180218021802180218021' as `0x${string}`;
```

Every contract write should include the attribution suffix.

```ts
dataSuffix: ATTRIBUTION_DATA_SUFFIX
```

The current builder code is `bc_mpktuwea`.

This suffix is passed with contract write calls so activity can appear in the base.dev Dashboard after users interact with the claim contract.

## Environment Variables

Create a local environment file and provide the following values:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7a28D52c770A0597B08B175dC853A82D4D610B68
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

Use the deployed app URL for `NEXT_PUBLIC_APP_URL` when deploying.

For local development, set values appropriate for your environment.
