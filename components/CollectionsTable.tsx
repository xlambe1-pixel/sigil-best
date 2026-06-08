'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { collections as staticCollections } from '@/lib/collections'

const colors = ['#0c0818','#0d1520','#0e0820','#111118','#130e00','#0a1a10','#0e0e14','#100a14','#0c1018','#100810']
const accents = ['#5b21b6','#1e3a5f','#6d28d9','#374151','#78350f','#166534','#1e1b4b','#6b21a8','#1e3a5f','#5b21b6']

const timeframes = ['10m','1h','6h','1d','7d','30d']
const categories = ['all','live','art','pfp','generative']
const tabs = ['top collections','live mints','upcoming','recently ended']

export default function CollectionsTable() {
  const [search, setSearch] = useState('')
  const [activeTime, setActiveTime] = useState('10m')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('top collections')
  const [dbCollections, setDbCollections] = useState<any[]>([])

  useEffect(() => {
    const fetchCollections = async () => {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setDbCollections(data)
    }
    fetchCollections()
  }, [])

  const dbFormatted = dbCollections.map((c, i) => ({
    rank: i + 1,
    name: c.name,
    type: c.type || 'generative',
    status: c.status || 'live',
    floor: parseFloat(c.price) || 0,
    offer: (parseFloat(c.price) * 0.9) || 0,
    chg: 0,
    vol: 0,
    listed: 0,
    slug: c.slug || c.tx_hash || c.id,
    artworkUrl: c.artwork_url || '',
    isNew: true,
  }))

  const staticFormatted = staticCollections.map((c, i) => ({
    rank: dbCollections.length + i + 1,
    name: c.name,
    type: c.type,
    status: c.status === 'soon' ? 'upcoming' : c.status,
    floor: c.floor,
    offer: c.floor * 0.9,
    chg: c.chg,
    vol: c.volume,
    listed: c.listed,
    slug: c.slug,
    artworkUrl: c.artworkUrl || '',
    isNew: false,
  }))

  const allCollections = [...dbFormatted, ...staticFormatted]

  const filtered = allCollections.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'all' || activeCategory === 'live' || c.type === activeCategory

    let matchTab = true
    if (activeTab === 'live mints') matchTab = c.status === 'live'
    if (activeTab === 'upcoming') matchTab = c.status === 'upcoming' || c.status === 'soon'
    if (activeTab === 'recently ended') matchTab = c.status === 'ended'

    return matchSearch && matchCategory && matchTab
  })

  return (
    <div style={{maxWidth:'1100px',margin:'0 auto'}}>
      <div style={{display:'flex',padding:'0 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
        {tabs.map((t) => (
          <div key={t} onClick={()=>setActiveTab(t)} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:activeTab===t?'#ededf0':'rgba(255,255,255,.3)',padding:'.6rem 1rem',borderBottom:activeTab===t?'1.5px solid #7c6ff7':'1.5px solid transparent',cursor:'pointer',letterSpacing:'.04em'}}>
            {t}
          </div>
        ))}
      </div>

      <div style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.65rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.05)'}}>
        <input
          value={search}
          onChange={e=>setSearch(e.target.value)}
          placeholder="search collections..."
          style={{fontFamily:'DM Mono,monospace',fontSize:'11px',background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.09)',color:'#ededf0',padding:'.32rem .75rem',borderRadius:'5px',outline:'none',width:'170px'}}
        />
        <div style={{width:'.5px',height:'16px',background:'rgba(255,255,255,.07)',margin:'0 .25rem'}} />
        {timeframes.map((t) => (
          <button key={t} onClick={()=>setActiveTime(t)} style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:activeTime===t?'#7c6ff7':'rgba(255,255,255,.32)',background:activeTime===t?'rgba(124,111,247,.07)':'rgba(255,255,255,.03)',border:`.5px solid ${activeTime===t?'rgba(124,111,247,.3)':'rgba(255,255,255,.07)'}`,padding:'.28rem .65rem',borderRadius:'4px',cursor:'pointer'}}>
            {t}
          </button>
        ))}
        <div style={{marginLeft:'auto',display:'flex',gap:'.4rem'}}>
          {categories.map((t) => (
            <button key={t} onClick={()=>setActiveCategory(t)} style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:activeCategory===t?'#7c6ff7':'rgba(255,255,255,.32)',background:activeCategory===t?'rgba(124,111,247,.07)':'rgba(255,255,255,.03)',border:`.5px solid ${activeCategory===t?'rgba(124,111,247,.3)':'rgba(255,255,255,.07)'}`,padding:'.28rem .65rem',borderRadius:'4px',cursor:'pointer'}}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'2.2rem 1fr 100px 100px 78px 96px 68px',padding:'.45rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
        {['#','collection','floor','top offer','1h %','volume','listed'].map((h,i) => (
          <div key={h} style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.2)',letterSpacing:'.07em',textAlign:i===1?'left':'right'}}>
            {h}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{padding:'3rem',textAlign:'center',fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.2)'}}>
          no collections found
        </div>
      )}

      {filtered.map((c,i) => (
        <Link key={i} href={`/collection/${c.slug}`} style={{textDecoration:'none',color:'inherit',display:'block'}}>
          <div style={{display:'grid',gridTemplateColumns:'2.2rem 1fr 100px 100px 78px 96px 68px',padding:'.55rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.035)',alignItems:'center',cursor:'pointer'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.18)'}}>{c.rank}</div>
            <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
              <div style={{width:'34px',height:'34px',borderRadius:'7px',flexShrink:0,position:'relative',overflow:'hidden',background:colors[i%colors.length]}}>
                {c.artworkUrl ? (
                  <img src={c.artworkUrl} alt={c.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                ) : (
                  <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 40% 40%, ${accents[i%accents.length]}88, transparent 70%)`}} />
                )}
                {c.isNew && (
                  <div style={{position:'absolute',top:2,right:2,width:'6px',height:'6px',borderRadius:'50%',background:'#4ade80'}} />
                )}
              </div>
              <div>
                <div style={{fontSize:'13px',fontWeight:600,color:'#ededf0',display:'flex',alignItems:'center',gap:'.4rem'}}>
                  {c.name}
                  {c.isNew && <span style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'#4ade80',background:'rgba(74,222,128,.1)',border:'.5px solid rgba(74,222,128,.2)',padding:'.1rem .4rem',borderRadius:'4px'}}>new</span>}
                </div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',marginTop:'.1rem'}}>{c.type}</div>
              </div>
            </div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#ededf0',textAlign:'right'}}>{c.floor} <span style={{fontSize:'9px',color:'rgba(124,111,247,.5)'}}>RITUAL</span></div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.4)',textAlign:'right'}}>{c.offer.toFixed(3)}</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',textAlign:'right',color:c.chg>0?'#4ade80':c.chg<0?'#f87171':'rgba(255,255,255,.3)'}}>
              {c.chg===0?'—':(c.chg>0?'+':'')+c.chg.toFixed(1)+'%'}
            </div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#ededf0',textAlign:'right'}}>{c.vol.toFixed(1)}</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)',textAlign:'right'}}>{c.listed||'—'}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}