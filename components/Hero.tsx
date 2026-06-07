'use client'
import Link from 'next/link'
import { collections as staticCollections } from '@/lib/collections'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Hero() {
  const [dbCollections, setDbCollections] = useState<any[]>([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .not('artwork_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(3)
      if (data) setDbCollections(data)
    }
    fetch()
  }, [])

  const dbFeatured = dbCollections.map(c => ({
    name: c.name,
    status: c.status || 'live',
    price: c.price,
    supply: c.supply,
    slug: c.slug || c.tx_hash || c.id,
    bg: '#0c0818',
    accent: '#5b21b6',
    artworkUrl: c.artwork_url || '',
  }))

  const staticFeatured = staticCollections.slice(0, 3).map(c => ({
    name: c.name,
    status: c.status,
    price: c.price,
    supply: c.supply,
    slug: c.slug,
    bg: c.bg,
    accent: c.accent,
    artworkUrl: c.artworkUrl || '',
  }))

  const featured = dbFeatured.length > 0
    ? [...dbFeatured.slice(0, 1), ...staticFeatured.slice(0, 2)]
    : staticFeatured

  return (
    <div style={{padding:'1rem 1.25rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'.75rem'}}>
        // featured collections
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'8px'}}>
        {featured.map((c,i) => (
          <Link key={i} href={`/collection/${c.slug}`} style={{textDecoration:'none'}}>
            <div style={{position:'relative',borderRadius:'10px',overflow:'hidden',cursor:'pointer',background:c.bg,height:'400px'}}>
              {c.artworkUrl ? (
                <img src={c.artworkUrl} alt={c.name} style={{width:'100%',height:'400px',objectFit:'cover',objectPosition:'center',display:'block',opacity:0.7}} />
              ) : (
                <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 30% 40%, ${c.accent}66, transparent 70%)`}} />
              )}
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(8,8,9,.95) 0%, rgba(8,8,9,.1) 60%, transparent 100%)'}} />
              <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'1rem'}}>
                <div style={{fontSize:'16px',fontWeight:700,color:'#ededf0',marginBottom:'.35rem'}}>{c.name}</div>
                <div style={{display:'flex',alignItems:'center',gap:'8px',fontFamily:'DM Mono,monospace',fontSize:'10px'}}>
                  {c.status==='live' ? (
                    <span style={{display:'flex',alignItems:'center',gap:'4px',color:'#4ade80'}}>
                      <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'#4ade80',display:'inline-block'}} />
                      live
                    </span>
                  ) : (
                    <span style={{color:'#7c6ff7'}}>soon</span>
                  )}
                  <span style={{color:'rgba(165,160,255,.7)'}}>{c.price} RITUAL</span>
                  <span style={{color:'rgba(255,255,255,.3)'}}>{c.supply?.toLocaleString()} items</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}