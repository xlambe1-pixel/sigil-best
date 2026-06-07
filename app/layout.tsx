import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/WagmiProvider'
import FeedbackButton from '@/components/FeedbackButton'

export const metadata: Metadata = {
  title: 'Sigil — NFT Launchpad on Ritual Chain',
  description: 'Launch, mint and trade NFTs on Ritual Chain. The first NFT marketplace built for Ritual testnet.',
  keywords: 'NFT, Ritual Chain, launchpad, mint, marketplace, web3',
  openGraph: {
    title: 'Sigil — NFT Launchpad on Ritual Chain',
    description: 'Launch, mint and trade NFTs on Ritual Chain.',
    url: 'https://sigil.best',
    siteName: 'Sigil',
    type: 'website',
    images: [{ url: 'https://sigil.best/og-image.svg', width: 1200, height: 630, alt: 'Sigil' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sigil — NFT Launchpad on Ritual Chain',
    description: 'Launch, mint and trade NFTs on Ritual Chain.',
    images: ['https://sigil.best/og-image.svg'],
  },
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{background:'#050805',minHeight:'100vh',position:'relative'}}>
        <div style={{
          position:'fixed',
          inset:0,
          background:'radial-gradient(ellipse at 15% 40%, rgba(0,180,60,0.15) 0%, transparent 50%), radial-gradient(ellipse at 85% 20%, rgba(0,150,50,0.10) 0%, transparent 45%), radial-gradient(ellipse at 50% 90%, rgba(0,200,80,0.08) 0%, transparent 40%)',
          pointerEvents:'none',
          zIndex:0,
        }} />
        <div style={{position:'relative',zIndex:1}}>
          <Providers>
            {children}
            <FeedbackButton />
          </Providers>
        </div>
      </body>
    </html>
  )
}