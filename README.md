# Base Spark MiniApp

Base Spark MiniApp is a mobile-first Base mini app built with Next.js, TypeScript, App Router, Wagmi, and Viem.

The app is focused on one primary action: connecting a wallet and claiming a daily Spark.

## Overview

Base Spark is designed to be simple, fast, and easy to use on mobile devices.

The interface centers on a single claim flow. A user connects a supported wallet, taps the main claim button, and submits the transaction through the connected wallet.

After the transaction is submitted, the app displays the Spark reward.

The app uses an English-only interface and is intentionally focused on the daily Spark experience.

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
- Clear single-action claim flow
- Daily Spark reward interaction
- Direct Wagmi wallet configuration
- Explicit wallet picker
- Wallet connection and disconnection controls
- Base attribution metadata
- Centralized contract configuration in the front end
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

For local development, set values that match your local environment.

## Local Development

Clone the repository:

```bash
git clone https://github.com/Eudora641/base-spark-miniapp.git
```

Enter the project directory:

```bash
cd base-spark-miniapp
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app runs locally at:

```bash
http://localhost:3006
```

Open that URL in a browser to test the mini app during development.

## Usage

1. Start the app locally or open the deployed app.
2. Connect a supported wallet.
3. Choose the wallet from the wallet picker.
4. Tap the main claim button.
5. Review and submit the contract transaction in the wallet.
6. Return to the app to view the Spark reward state.

## Build

Create a production build with:

```bash
npm run build
```

Run this command before deployment to confirm that the app builds successfully.

## Contract

The claim contract is deployed at:

```text
0x7a28D52c770A0597B08B175dC853A82D4D610B68
```

The contract source reference is located at:

```text
contracts/BaseSparkReward.sol
```

The front-end ABI is located at:

```text
lib/contract.ts
```

If the contract changes, keep the front-end ABI, function names, and parameters aligned with the deployed contract.

## Deployment Notes

Before deploying, confirm that the required environment variables are set correctly.

Make sure the contract address matches the intended Base deployment.

Keep the builder code in `lib/wagmi.ts` aligned with the verified base.dev app registration.

Confirm that `app/layout.tsx` contains the correct Base app metadata.

Confirm that all contract write calls pass `dataSuffix: ATTRIBUTION_DATA_SUFFIX`.

## Suggested Development Checklist

- Install dependencies with `npm install`
- Add the required environment variables
- Start the app with `npm run dev`
- Open the local development URL
- Connect a supported wallet
- Verify the wallet picker behavior
- Test wallet disconnection
- Test the daily Spark claim flow
- Confirm that the reward appears after the transaction is submitted
- Run `npm run build`
- Review contract ABI alignment before deployment
- Verify Base attribution configuration before release

## Notes

This project is intentionally scoped around the daily Spark claim flow.

Keep the interface simple and mobile-friendly when making changes.

When updating contract behavior, update the front-end contract configuration at the same time.

When deploying, verify both the app URL and contract address before release.
