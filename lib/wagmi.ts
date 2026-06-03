import { QueryClient } from '@tanstack/react-query';
import { createCoinbaseWalletSDK, type ProviderInterface } from '@coinbase/wallet-sdk';
import { getAddress, numberToHex, SwitchChainError, UserRejectedRequestError, type Address } from 'viem';
import { base, baseSepolia } from 'wagmi/chains';
import { createConfig, createConnector, http, injected } from 'wagmi';

export const APP_NAME = 'Base Spark';

export const ATTRIBUTION_DATA_SUFFIX =
  '0x' as `0x${string}`;

function coinbaseWalletConnector() {
  let provider: ProviderInterface | undefined;
  let accountsChanged: ((accounts: string[]) => void) | undefined;
  let chainChanged: ((chainId: string) => void) | undefined;
  let disconnect: (() => void) | undefined;

  return createConnector<ProviderInterface>((config) => ({
    id: 'coinbaseWallet',
    name: 'Coinbase Wallet',
    type: 'coinbaseWallet',

    async connect({ chainId, withCapabilities } = {}) {
      const coinbaseProvider = await this.getProvider();
      const requestedAccounts = await coinbaseProvider.request({
        method: 'eth_requestAccounts',
      });
      const accounts = (requestedAccounts as string[]).map((account) => getAddress(account));

      if (!accountsChanged) {
        accountsChanged = this.onAccountsChanged.bind(this);
        coinbaseProvider.on('accountsChanged', accountsChanged);
      }
      if (!chainChanged) {
        chainChanged = this.onChainChanged.bind(this);
        coinbaseProvider.on('chainChanged', chainChanged);
      }
      if (!disconnect) {
        disconnect = this.onDisconnect.bind(this);
        coinbaseProvider.on('disconnect', disconnect);
      }

      let currentChainId = await this.getChainId();
      if (chainId && currentChainId !== chainId && this.switchChain) {
        const chain = await this.switchChain({ chainId }).catch(() => ({ id: currentChainId }));
        currentChainId = chain.id;
      }

      const connectorAccounts = withCapabilities
        ? accounts.map((address) => ({ address, capabilities: {} }))
        : accounts;

      return {
        accounts: connectorAccounts as unknown as typeof withCapabilities extends true
          ? readonly { address: Address; capabilities: Record<string, unknown> }[]
          : readonly Address[],
        chainId: currentChainId,
      };
    },

    async disconnect() {
      const coinbaseProvider = await this.getProvider();
      if (accountsChanged) {
        coinbaseProvider.removeListener?.('accountsChanged', accountsChanged);
        accountsChanged = undefined;
      }
      if (chainChanged) {
        coinbaseProvider.removeListener?.('chainChanged', chainChanged);
        chainChanged = undefined;
      }
      if (disconnect) {
        coinbaseProvider.removeListener?.('disconnect', disconnect);
        disconnect = undefined;
      }
      await coinbaseProvider.disconnect();
    },

    async getAccounts() {
      const coinbaseProvider = await this.getProvider();
      const accounts = await coinbaseProvider.request({ method: 'eth_accounts' });
      return (accounts as string[]).map((account) => getAddress(account));
    },

    async getChainId() {
      const coinbaseProvider = await this.getProvider();
      const chainId = await coinbaseProvider.request({ method: 'eth_chainId' });
      return Number(chainId);
    },

    async getProvider() {
      if (!provider) {
        provider = createCoinbaseWalletSDK({
          appName: APP_NAME,
          appChainIds: config.chains.map((chain) => chain.id),
          preference: {
            options: 'all',
          },
        }).getProvider();
      }

      return provider;
    },

    async isAuthorized() {
      const accounts = await this.getAccounts().catch(() => []);
      return accounts.length > 0;
    },

    async switchChain({ chainId }) {
      const chain = config.chains.find((candidate) => candidate.id === chainId);
      if (!chain) throw new SwitchChainError(new Error('Chain is not configured.'));

      const coinbaseProvider = await this.getProvider();
      try {
        await coinbaseProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: numberToHex(chainId) }],
        });
        return chain;
      } catch (error) {
        const err = error as { code?: number; message?: string };
        if (err.code === 4001) throw new UserRejectedRequestError(error as Error);
        throw new SwitchChainError(error as Error);
      }
    },

    onAccountsChanged(accounts) {
      if (accounts.length === 0) {
        config.emitter.emit('disconnect');
        return;
      }
      config.emitter.emit('change', {
        accounts: accounts.map((account) => getAddress(account)),
      });
    },

    onChainChanged(chainId) {
      config.emitter.emit('change', { chainId: Number(chainId) });
    },

    onDisconnect() {
      config.emitter.emit('disconnect');
    },
  }));
}

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWalletConnector(),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

export const queryClient = new QueryClient();
