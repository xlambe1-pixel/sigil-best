export type Collection = {
  slug: string
  name: string
  symbol: string
  creator: string
  description: string
  supply: number
  price: string
  status: 'live' | 'soon' | 'ended'
  type: string
  contract: string
  floor: number
  volume: number
  listed: number
  chg: number
  bg: string
  accent: string
}

export const collections: Collection[] = [
  {
    slug: 'ethereal-voids',
    name: 'Ethereal Voids',
    symbol: 'EVOID',
    creator: '@etherealxyz',
    description: '777 unique voids, each one a window into a different layer of the Ritual network. Generated on-chain using Infernet nodes — no two are alike, no metadata stored off-chain. Pure on-chain art.',
    supply: 777,
    price: '0.05',
    status: 'live',
    type: 'generative',
    contract: '0x6cf1e216d3aee8c1762ffaff16cec51da505ae1a',
    floor: 0.12,
    volume: 38.4,
    listed: 165,
    chg: 143.2,
    bg: '#0c0818',
    accent: '#5b21b6',
  },
  {
    slug: 'runic-beasts',
    name: 'Runic Beasts',
    symbol: 'RUNE',
    creator: '@voidmkr',
    description: '500 mythical beasts inscribed with ancient runes on the Ritual chain. Each beast carries a unique set of runic traits that determine its power and rarity.',
    supply: 500,
    price: '0.07',
    status: 'live',
    type: 'pfp',
    contract: '0x0000000000000000000000000000000000000000',
    floor: 0.07,
    volume: 24.1,
    listed: 88,
    chg: 89.5,
    bg: '#0d1520',
    accent: '#1e3a5f',
  },
  {
    slug: 'quantum-masks',
    name: 'Quantum Masks',
    symbol: 'QMSK',
    creator: '@pale.eth',
    description: '2000 quantum-generated masks, each one a unique visual representation of a different quantum state. Art meets science on Ritual Chain.',
    supply: 2000,
    price: '0.03',
    status: 'live',
    type: 'art',
    contract: '0x0000000000000000000000000000000000000000',
    floor: 0.03,
    volume: 18.6,
    listed: 310,
    chg: 67.8,
    bg: '#0e0820',
    accent: '#6d28d9',
  },
  {
    slug: 'pale-signals',
    name: 'Pale Signals',
    symbol: 'PSIG',
    creator: '@zenmint',
    description: '333 abstract signal patterns captured from the Ritual network. Each piece is a unique snapshot of on-chain activity transformed into art.',
    supply: 333,
    price: '0.09',
    status: 'soon',
    type: 'art',
    contract: '0x0000000000000000000000000000000000000000',
    floor: 0.09,
    volume: 9.7,
    listed: 0,
    chg: 0,
    bg: '#130e00',
    accent: '#78350f',
  },
]

export function getCollection(slug: string) {
  return collections.find(c => c.slug === slug)
}
