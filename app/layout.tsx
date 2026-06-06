import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/WagmiProvider'

export const metadata: Metadata = {
  title: 'Sigil — NFT Launchpad on Ritual Chain',
  description: 'Launch, mint and trade NFTs on Ritual Chain. The first NFT marketplace built for Ritual testnet.',
  keywords: 'NFT, Ritual Chain, launchpad, mint, marketplace, web3',
  openGraph: {
    title: 'Sigil — NFT Launchpad on Ritual Chain',
    description: 'Launch, mint and trade NFTs on Ritual Chain. The first NFT marketplace and launchpad on Ritual testnet.',
    url: 'https://sigil.best',
    siteName: 'Sigil',
    type: 'website',
    images: [
      {
        url: 'https://sigil.best/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Sigil — NFT Launchpad on Ritual Chain',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sigil — NFT Launchpad on Ritual Chain',
    description: 'Launch, mint and trade NFTs on Ritual Chain.',
    images: ['https://sigil.best/og-image.svg'],
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}