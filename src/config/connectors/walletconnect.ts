'use client';

import { createConnector } from 'wagmi';
import type { Address, Chain } from 'viem';

/**
 * WalletConnect v2 connector built directly on
 * `@walletconnect/ethereum-provider` (WalletConnect's own official EIP-1193
 * provider package) via wagmi's `createConnector` primitive.
 *
 * This is written by hand instead of importing `walletConnect` from
 * `wagmi/connectors` because that package bundles Coinbase Wallet support in
 * the same module, and recent `@coinbase/wallet-sdk` releases pull in
 * `@coinbase/cdp-sdk` → an unresolvable `@x402/evm/upto/client` subpath that
 * breaks the build. `@walletconnect/ethereum-provider` is maintained by
 * WalletConnect/Reown and has no relationship to any Coinbase package.
 *
 * The provider is loaded via a dynamic import so it never enters the
 * server-side render bundle (it depends on browser-only QR/modal code).
 */
export function walletConnectConnector(params: { projectId: string; chains: readonly [Chain, ...Chain[]] }) {
  let providerPromise: Promise<any> | null = null;

  async function getWcProvider() {
    if (!providerPromise) {
      providerPromise = import('@walletconnect/ethereum-provider').then(({ EthereumProvider }) =>
        EthereumProvider.init({
          projectId: params.projectId,
          chains: [params.chains[0].id],
          optionalChains: params.chains.map((c) => c.id) as [number, ...number[]],
          showQrModal: true,
          metadata: {
            name: 'TrustWallet AI',
            description: 'Web3 wallet intelligence and reputation platform',
            url: typeof window !== 'undefined' ? window.location.origin : 'https://trustwallet.ai',
            icons: ['https://trustwallet.ai/icon.png'],
          },
        })
      );
    }
    return providerPromise;
  }

  return createConnector<any>((config) => ({
    id: 'walletConnect',
    name: 'WalletConnect',
    type: 'walletConnect',

    async connect<withCapabilities extends boolean = false>(
      { chainId, withCapabilities: withCaps }: { chainId?: number; withCapabilities?: boolean | withCapabilities } = {}
    ) {
      const provider = await getWcProvider();
      await provider.connect(chainId ? { chains: [chainId] } : undefined);

      const accounts = (await provider.request({ method: 'eth_accounts' })) as string[];
      const currentChainId = await this.getChainId();

      provider.on('accountsChanged', (accs: string[]) => {
        config.emitter.emit('change', { accounts: accs as Address[] });
      });
      provider.on('chainChanged', (id: number) => {
        config.emitter.emit('change', { chainId: Number(id) });
      });
      provider.on('disconnect', () => {
        config.emitter.emit('disconnect');
      });

      if (withCaps) {
        const accountsWithCapabilities = accounts.map((address) => ({
          address: address as Address,
          capabilities: {} as Record<string, unknown>,
        }));
        return { accounts: accountsWithCapabilities as unknown as readonly { address: `0x${string}`; capabilities: Record<string, unknown> }[], chainId: currentChainId } as any;
      }

      return { accounts: accounts as unknown as readonly `0x${string}`[], chainId: currentChainId } as any;
    },

    async disconnect() {
      const provider = await getWcProvider();
      await provider.disconnect();
    },

    async getAccounts() {
      const provider = await getWcProvider();
      const accounts = (await provider.request({ method: 'eth_accounts' })) as string[];
      return accounts as Address[];
    },

    async getChainId() {
      const provider = await getWcProvider();
      return Number(provider.chainId);
    },

    async getProvider() {
      return getWcProvider();
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
      const provider = await getWcProvider();
      const chain = config.chains.find((c) => c.id === chainId);
      if (!chain) throw new Error(`Chain ${chainId} is not configured.`);
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return chain;
    },

    onAccountsChanged(accounts: string[]) {
      config.emitter.emit('change', { accounts: accounts as Address[] });
    },
    onChainChanged(chainId: string | number) {
      config.emitter.emit('change', { chainId: Number(chainId) });
    },
    onDisconnect() {
      config.emitter.emit('disconnect');
    },
  }));
}
