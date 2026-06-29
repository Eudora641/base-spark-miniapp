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
