import { createConfig, http, createStorage, cookieStorage } from 'wagmi'
import { defineChain } from 'viem'
import { injected } from 'wagmi/connectors'

export const ritualTestnet = defineChain({
  id: 1979,
  name: 'Ritual Testnet',
  nativeCurrency: {
    name: 'RITUAL',
    symbol: 'RITUAL',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ritualfoundation.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ritual Explorer',
      url: 'https://explorer.ritualfoundation.org',
    },
  },
  testnet: true,
})

export const config = createConfig({
  chains: [ritualTestnet],
  connectors: [injected()],
  storage: createStorage({ storage: cookieStorage }),
  transports: {
    [ritualTestnet.id]: http(),
  },
  ssr: true,
})