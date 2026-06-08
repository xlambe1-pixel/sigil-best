'use client'
import Link from 'next/link'
import { collections as staticCollections } from '@/lib/collections'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function BiggestMovers() {
  const [dbCollections, setDbCollections] = useState<any[]>([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .eq('status', 'live')
        .order('created_at', { ascending: false })
        .limit(3)
      if (data) setDbCollections(data)
    }
    fetch()
  }, [])

  const dbMovers = dbCollections.map(c => ({
    name: c.name,
    slug: c.slug || c.tx_hash || c.id,
    artworkUrl: c.artwork_url || '',
    price: c.price,
    chg: 0,
  }))

  const staticMovers = staticCollections
    .filter(c => c.chg !== 0)
    .slice(0, 5)
    .map(c => ({
      name: c.name,
      slug: c.slug,
      artworkUrl: c.artworkUrl || '',
      price: c.price,
      chg: c.chg,
    }))

  const movers = [...dbMovers, ...staticMovers].slice(0, 5)

  if (movers.length === 0) return null

  return (
    <div style={{maxWidth:'1100px',margin:'0 auto',padding:'.75rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.75rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em'}}>// biggest movers</div>
        <Link href="/" style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(124,111,247,.55)',textDecoration:'none'}}>see all →</Link>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,minmax(0,1fr))',gap:'8px'}}>
        {movers.map((c,i) => (
          <Link key={i} href={`/collection/${c.slug}`} style={{textDecoration:'none',color:'inherit'}}>
            <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'10px',padding:'.75rem',display:'flex',alignItems:'center',gap:'.65rem',cursor:'pointer'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'8px',overflow:'hidden',flexShrink:0,background:'#0c0818',position:'relative'}}>
                {c.artworkUrl ? (
                  <img src={c.artworkUrl} alt={c.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                ) : (
                  <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 40% 40%, #5b21b688, transparent 70%)'}} />
                )}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'12px',fontWeight:600,color:'#ededf0',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:Number(c.chg)>0?'#4ade80':Number(c.chg)<0?'#f87171':'rgba(255,255,255,.3)',marginTop:'.15rem'}}>
                  {Number(c.chg)===0?'new':Number(c.chg)>0?'+'+c.chg+'%':c.chg+'%'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}