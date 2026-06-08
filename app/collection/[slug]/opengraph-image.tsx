import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'
import { collections as staticCollections } from '@/lib/collections'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params

  let name = 'Sigil Collection'
  let description = 'NFT Collection on Ritual Chain'
  let artworkUrl = ''
  let price = '0.05'
  let supply = 0

  const staticCol = staticCollections.find(c => c.slug === slug)
  if (staticCol) {
    name = staticCol.name
    description = staticCol.description
    artworkUrl = staticCol.artworkUrl || ''
    price = staticCol.price
    supply = staticCol.supply
  } else {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase
        .from('collections')
        .select('*')
        .or(`tx_hash.eq.${slug},slug.eq.${slug}`)
        .single()
      if (data) {
        name = data.name
        description = data.description || ''
        artworkUrl = data.artwork_url || ''
        price = data.price || '0.05'
        supply = data.supply || 0
      }
    } catch (e) {}
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: '#080809',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {artworkUrl && (
          <img
            src={artworkUrl}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.4,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(8,8,9,0.98) 40%, rgba(8,8,9,0.5) 100%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 80px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '18px', color: 'rgba(124,111,247,0.8)', fontFamily: 'monospace', letterSpacing: '3px' }}>
              SIGIL.BEST · RITUAL TESTNET
            </div>
          </div>
          <div style={{ fontSize: '72px', fontWeight: 900, color: '#ededf0', lineHeight: 1.1, marginBottom: '20px', maxWidth: '700px' }}>
            {name}
          </div>
          <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.5)', marginBottom: '40px', maxWidth: '600px', lineHeight: 1.5 }}>
            {description.slice(0, 100)}{description.length > 100 ? '...' : ''}
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginBottom: '4px' }}>PRICE</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#7c6ff7' }}>{price} RITUAL</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginBottom: '4px' }}>SUPPLY</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#ededf0' }}>{supply.toLocaleString()} NFTs</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}