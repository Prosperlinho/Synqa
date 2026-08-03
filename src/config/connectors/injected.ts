'use client';

import { createConnector } from 'wagmi';
import type { Address } from 'viem';

/**
 * Minimal EIP-1193 "injected wallet" connector (MetaMask, Rabby, Brave
 * Wallet, and any other `window.ethereum` provider), built directly on
 * wagmi's `createConnector` primitive.
 *
 * This is written by hand instead of importing `injected` from
 * `wagmi/connectors` because that package is a single bundle that also
 * contains Coinbase Wallet support. Recent `@coinbase/wallet-sdk` releases
 * pull in `@coinbase/cdp-sdk` (Smart Wallet / x402 agentic payments), which
 * references an unresolvable `@x402/evm/upto/client` subpath and breaks the
 * build — and because `wagmi/connectors` re-exports every connector from one
 * barrel file, even importing just `injected` from it drags that broken
 * module into the build graph. This file has zero dependency on any
 * `@coinbase/*` or `@x402/*` package, directly or transitively.
 */

interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export function injectedConnector() {
  let accountsChangedHandler: ((accounts: string[]) => void) | undefined;
  let chainChangedHandler: ((chainId: string) => void) | undefined;
  let disconnectHandlerRef: (() => void) | undefined;

  return createConnector<Eip1193Provider>((config) => ({
    id: 'injected',
    name: 'Browser Wallet',
    type: 'injected',

    async connect({ chainId }: { chainId?: number } = {}) {
      const provider = await this.getProvider();
      if (!provider) {
        throw new Error('No injected wallet found. Install MetaMask or another browser wallet.');
      }

      const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];

      if (!accountsChangedHandler) {
        accountsChangedHandler = (accs: string[]) => config.emitter.emit('change', { accounts: accs as Address[] });
        provider.on('accountsChanged', accountsChangedHandler);
      }
      if (!chainChangedHandler) {
        chainChangedHandler = (chainIdHex: string) => config.emitter.emit('change', { chainId: Number(chainIdHex) });
        provider.on('chainChanged', chainChangedHandler);
      }
      if (!disconnectHandlerRef) {
        disconnectHandlerRef = () => config.emitter.emit('disconnect');
        provider.on('disconnect', disconnectHandlerRef);
      }

      let currentChainId = await this.getChainId();
      if (chainId && currentChainId !== chainId) {
        const chain = await this.switchChain?.({ chainId });
        currentChainId = chain?.id ?? currentChainId;
      }

      return { accounts: accounts as Address[], chainId: currentChainId };
    },

    async disconnect() {
      const provider = await this.getProvider();
      if (!provider) return;
      if (accountsChangedHandler) provider.removeListener('accountsChanged', accountsChangedHandler);
      if (chainChangedHandler) provider.removeListener('chainChanged', chainChangedHandler);
      if (disconnectHandlerRef) provider.removeListener('disconnect', disconnectHandlerRef);
      accountsChangedHandler = undefined;
      chainChangedHandler = undefined;
      disconnectHandlerRef = undefined;
    },

    async getAccounts() {
      const provider = await this.getProvider();
      if (!provider) return [];
      const accounts = (await provider.request({ method: 'eth_accounts' })) as string[];
      return accounts as Address[];
    },

    async getChainId() {
      const provider = await this.getProvider();
      if (!provider) throw new Error('No injected wallet found.');
      const chainIdHex = (await provider.request({ method: 'eth_chainId' })) as string;
      return Number(chainIdHex);
    },

    async getProvider() {
      if (typeof window === 'undefined') return undefined;
      return window.ethereum;
    },

    async isAuthorized() {
      try {
        const accounts = await this.getAccounts();
        return accounts.length > 0;
      } catch {
        return false;
      }
    },

    async switchChain({ chainId }: { chainId: number }) {
      const provider = await this.getProvider();
      if (!provider) throw new Error('No injected wallet found.');
      const chain = config.chains.find((c) => c.id === chainId);
      if (!chain) throw new Error(`Chain ${chainId} is not configured.`);

      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      } catch (err: any) {
        // 4902 = chain not yet added to the wallet
        if (err?.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: [chain.rpcUrls.default.http[0]],
                blockExplorerUrls: chain.blockExplorers ? [chain.blockExplorers.default.url] : undefined,
              },
            ],
          });
        } else {
          throw err;
        }
      }

      return chain;
    },

    onAccountsChanged(accounts: string[]) {
      config.emitter.emit('change', { accounts: accounts as Address[] });
    },
    onChainChanged(chainId: string) {
      config.emitter.emit('change', { chainId: Number(chainId) });
    },
    onDisconnect() {
      config.emitter.emit('disconnect');
    },
  }));
}
