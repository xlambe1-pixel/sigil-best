import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/WagmiProvider'

export const metadata: Metadata = {
  title: 'Sigil — NFT Launchpad on Ritual Chain',
  description: 'Launch and trade NFTs on Ritual Chain',
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