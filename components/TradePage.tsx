'use client'
import { useState, useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { supabase } from '@/lib/supabase'
import { collections as staticCollections } from '@/lib/collections'

const tabs = ['all listings', 'by collection', 'recent sales']

export default function TradePage() {
  const [activeTab, setActiveTab] = useState('all listings')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('price-low')
  const [dbCollections, setDbCollections] = useState<any[]>([])
  const { isConnected } = useAccount()
  const { connect } = useConnect()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .eq('status', 'live')
        .order('created_at', { ascending: false })
      if (data) setDbCollections(data)
    }
    fetch()
  }, [])

  const staticListings = staticCollections.map((c, i) => ({
    id: c.slug,
    collection: c.name,
    tokenId: '#' + String(Math.floor(Math.random() * 999) + 1).padStart(4, '0'),
    price: c.price,
    seller: '0x1234...5678',
    artworkUrl: c.artworkUrl || '',
    bg: c.bg,
    accent: c.accent,
    slug: c.slug,
    isLive: false,
  }))

  const dbListings = dbCollections.map((c: any) => ({
    id: c.id,
    collection: c.name,
    tokenId: '#' + String(Math.floor(Math.random() * 999) + 1).padStart(4, '0'),
    price: c.price,
    seller: c.creator_address ? c.creator_address.slice(0,6)+'...'+c.creator_address.slice(-4) : '0x???',
    artworkUrl: c.artwork_url || '',
    bg: '#0c0818',
    accent: '#5b21b6',
    slug: c.tx_hash || c.id,
    isLive: true,
  }))

  const allListings = [...staticListings, ...dbListings]

  const filtered = allListings
    .filter(l => l.collection.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price)
      if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price)
      return 0
    })

  return (
    <div style={{maxWidth:'1100px',margin:'0 auto',padding:'2.5rem 1.75rem'}}>
      <div style={{marginBottom:'2rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'.75rem'}}>// secondary market</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <h1 style={{fontSize:'28px',fontWeight:800,letterSpacing:'-.02em'}}>trade</h1>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)'}}>{filtered.length} listings</div>
        </div>
      </div>

      <div style={{display:'flex',borderBottom:'.5px solid rgba(255,255,255,.06)',marginBottom:'1.25rem'}}>
        {tabs.map(t => (
          <div key={t} onClick={()=>setActiveTab(t)} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:activeTab===t?'#ededf0':'rgba(255,255,255,.3)',padding:'.6rem 1rem',borderBottom:activeTab===t?'1.5px solid #7c6ff7':'1.5px solid transparent',cursor:'pointer',letterSpacing:'.04em'}}>
            {t}
          </div>
        ))}
      </div>

      <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.5rem'}}>
        <input
          value={search}
          onChange={e=>setSearch(e.target.value)}
          placeholder="search by collection..."
          style={{fontFamily:'DM Mono,monospace',fontSize:'11px',background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.09)',color:'#ededf0',padding:'.32rem .75rem',borderRadius:'5px',outline:'none',width:'220px'}}
        />
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'.5rem'}}>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.3)'}}>sort by</div>
          {[['price-low','price ↑'],['price-high','price ↓']].map(([val,label]) => (
            <button key={val} onClick={()=>setSortBy(val)} style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:sortBy===val?'#7c6ff7':'rgba(255,255,255,.32)',background:sortBy===val?'rgba(124,111,247,.07)':'rgba(255,255,255,.03)',border:`.5px solid ${sortBy===val?'rgba(124,111,247,.3)':'rgba(255,255,255,.07)'}`,padding:'.28rem .65rem',borderRadius:'4px',cursor:'pointer'}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:'12px',marginBottom:'2rem'}}>
        {filtered.map((l,i) => (
          <div key={l.id+i} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',overflow:'hidden'}}>
            <a href={`/collection/${l.slug}`} style={{textDecoration:'none',color:'inherit',display:'block'}}>
              <div style={{height:'180px',background:l.bg,position:'relative',overflow:'hidden'}}>
                {l.artworkUrl ? (
                  <img src={l.artworkUrl} alt={l.collection} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                ) : (
                  <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 35% 40%, ${l.accent}88, transparent 65%)`}} />
                )}
                <div style={{position:'absolute',top:'10px',left:'10px',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.8)',background:'rgba(8,8,9,.7)',padding:'.25rem .6rem',borderRadius:'4px'}}>
                  {l.tokenId}
                </div>
                {l.isLive && (
                  <div style={{position:'absolute',top:'10px',right:'10px',fontFamily:'DM Mono,monospace',fontSize:'9px',color:'#4ade80',background:'rgba(74,222,128,.1)',border:'.5px solid rgba(74,222,128,.2)',padding:'.2rem .5rem',borderRadius:'8px'}}>
                    new
                  </div>
                )}
              </div>
            </a>
            <div style={{padding:'.85rem 1rem'}}>
              <div style={{fontSize:'13px',fontWeight:600,marginBottom:'.2rem'}}>{l.collection}</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',marginBottom:'.75rem'}}>seller: {l.seller}</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',marginBottom:'.2rem'}}>price</div>
                  <div style={{fontSize:'16px',fontWeight:700,color:'#ededf0'}}>{l.price} <span style={{fontSize:'10px',color:'rgba(124,111,247,.6)'}}>RITUAL</span></div>
                </div>
                <button
                  onClick={()=>!isConnected&&connect({connector:injected()})}
                  style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#080809',background:'#7c6ff7',border:'none',padding:'.45rem .9rem',borderRadius:'6px',cursor:'pointer',letterSpacing:'.04em'}}
                >
                  {isConnected ? 'buy now' : 'connect'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{background:'rgba(124,111,247,.05)',border:'.5px solid rgba(124,111,247,.15)',borderRadius:'10px',padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:'1rem'}}>
        <div style={{fontSize:'20px',opacity:.5}}>◈</div>
        <div>
          <div style={{fontSize:'13px',fontWeight:600,marginBottom:'.25rem'}}>secondary trading coming soon</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)',lineHeight:1.8}}>
            full buy/sell functionality with on-chain escrow is in development. listings shown are for preview only.
          </div>
        </div>
      </div>
    </div>
  )
}