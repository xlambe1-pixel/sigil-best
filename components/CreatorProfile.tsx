'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const colors = ['#0c0818','#0d1520','#0e0820','#111118','#130e00','#0a1a10']
const accents = ['#5b21b6','#1e3a5f','#6d28d9','#374151','#78350f','#166534']

export default function CreatorProfile({ address }: { address: string }) {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .eq('creator_address', address)
        .order('created_at', { ascending: false })
      setCollections(data || [])
      setLoading(false)
    }
    fetch()
  }, [address])

  const short = (addr: string) => addr.slice(0,6)+'...'+addr.slice(-4)
  const totalSupply = collections.reduce((a,c) => a + (c.supply||0), 0)

  return (
    <div style={{maxWidth:'1100px',margin:'0 auto',padding:'2.5rem 1.75rem'}}>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:'1.5rem',marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
        <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'rgba(124,111,247,.2)',border:'.5px solid rgba(124,111,247,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',fontWeight:800,color:'#7c6ff7',flexShrink:0}}>
          {address.slice(2,4).toUpperCase()}
        </div>
        <div>
          <div style={{fontSize:'22px',fontWeight:800,letterSpacing:'-.02em',marginBottom:'.3rem'}}>
            {short(address)}
          </div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)',marginBottom:'.5rem'}}>
            {address}
          </div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#7c6ff7',background:'rgba(124,111,247,.08)',border:'.5px solid rgba(124,111,247,.2)',padding:'.2rem .6rem',borderRadius:'10px'}}>
              ritual testnet
            </div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.3)',background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.08)',padding:'.2rem .6rem',borderRadius:'10px'}}>
              creator
            </div>
          </div>
        </div>
        <div style={{marginLeft:'auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
          {[
            {label:'collections', val:collections.length.toString()},
            {label:'total supply', val:totalSupply.toLocaleString()},
          ].map(s => (
            <div key={s.label} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'8px',padding:'.75rem 1rem',textAlign:'center'}}>
              <div style={{fontSize:'20px',fontWeight:700,color:'#ededf0',lineHeight:1}}>{s.val}</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginTop:'.25rem'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Collections */}
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em',marginBottom:'1rem'}}>// collections</div>

      {loading ? (
        <div style={{textAlign:'center',padding:'3rem',fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.25)'}}>loading...</div>
      ) : collections.length === 0 ? (
        <div style={{textAlign:'center',padding:'5rem 2rem',border:'.5px dashed rgba(255,255,255,.1)',borderRadius:'12px'}}>
          <div style={{fontSize:'32px',marginBottom:'1rem',opacity:.3}}>◈</div>
          <div style={{fontSize:'16px',fontWeight:600,marginBottom:'.5rem'}}>no collections yet</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.3)'}}>this creator hasn't launched anything yet</div>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:'12px'}}>
          {collections.map((c,i) => (
            <a key={c.id} href={`/collection/${c.tx_hash||c.id}`} style={{textDecoration:'none',color:'inherit'}}>
              <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',overflow:'hidden',cursor:'pointer'}}>
                <div style={{height:'160px',background:colors[i%colors.length],position:'relative'}}>
                  <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 35% 40%, ${accents[i%accents.length]}88, transparent 65%)`}} />
                  <div style={{position:'absolute',top:'10px',right:'10px',fontFamily:'DM Mono,monospace',fontSize:'9px',color:c.status==='live'?'#4ade80':'#f87171',background:c.status==='live'?'rgba(74,222,128,.12)':'rgba(248,113,113,.12)',border:`.5px solid ${c.status==='live'?'rgba(74,222,128,.25)':'rgba(248,113,113,.25)'}`,padding:'.2rem .55rem',borderRadius:'10px',display:'flex',alignItems:'center',gap:'.3rem'}}>
                    <span style={{width:'4px',height:'4px',borderRadius:'50%',background:c.status==='live'?'#4ade80':'#f87171',display:'inline-block'}} />
                    {c.status}
                  </div>
                  <div style={{position:'absolute',bottom:'10px',left:'10px',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.3)',background:'rgba(8,8,9,.6)',padding:'.2rem .5rem',borderRadius:'4px'}}>
                    {c.symbol}
                  </div>
                </div>
                <div style={{padding:'.85rem 1rem'}}>
                  <div style={{fontSize:'14px',fontWeight:600,marginBottom:'.25rem'}}>{c.name}</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',marginBottom:'.75rem',lineHeight:1.6}}>
                    {c.description?.slice(0,80)}{c.description?.length>80?'...':''}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
                    {[
                      {label:'supply', val:c.supply?.toLocaleString()||'—'},
                      {label:'price', val:(c.price||'—')+' RITUAL'},
                    ].map(s => (
                      <div key={s.label} style={{background:'#080809',borderRadius:'5px',padding:'.4rem .5rem'}}>
                        <div style={{fontFamily:'DM Mono,monospace',fontSize:'8px',color:'rgba(255,255,255,.2)',letterSpacing:'.06em',marginBottom:'.15rem'}}>{s.label}</div>
                        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.6)'}}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:'.75rem',paddingTop:'.75rem',borderTop:'.5px solid rgba(255,255,255,.05)',fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.2)'}}>
                    deployed {new Date(c.created_at).toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
