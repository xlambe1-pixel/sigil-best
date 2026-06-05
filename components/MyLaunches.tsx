'use client'
import { useAccount, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const colors = ['#0c0818','#0d1520','#0e0820','#111118','#130e00','#0a1a10']
const accents = ['#5b21b6','#1e3a5f','#6d28d9','#374151','#78350f','#166534']

export default function MyLaunches() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const [launches, setLaunches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!address) { setLoading(false); return }
    const fetch = async () => {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .eq('creator_address', address)
        .order('created_at', { ascending: false })
      setLaunches(data || [])
      setLoading(false)
    }
    fetch()
  }, [address])

  if (!mounted) return null

  return (
    <div style={{maxWidth:'1100px',margin:'0 auto',padding:'2.5rem 1.75rem'}}>
      <div style={{marginBottom:'2rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'.75rem'}}>// my launches</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <h1 style={{fontSize:'28px',fontWeight:800,letterSpacing:'-.02em'}}>my collections</h1>
          {isConnected && (
            <div style={{display:'flex',gap:'.75rem',alignItems:'center'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)'}}>
                {launches.length} collection{launches.length!==1?'s':''}
              </div>
              <a href="/launch" style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#080809',background:'#7c6ff7',border:'none',padding:'.38rem .95rem',borderRadius:'5px',cursor:'pointer',textDecoration:'none',letterSpacing:'.04em'}}>
                + new collection
              </a>
            </div>
          )}
        </div>
      </div>

      {!isConnected ? (
        <div style={{textAlign:'center',padding:'5rem 2rem',border:'.5px dashed rgba(255,255,255,.1)',borderRadius:'12px'}}>
          <div style={{fontSize:'32px',marginBottom:'1rem',opacity:.3}}>◈</div>
          <div style={{fontSize:'16px',fontWeight:600,marginBottom:'.5rem'}}>connect your wallet</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.3)',marginBottom:'1.5rem'}}>to view your launched collections</div>
          <button onClick={()=>connect({connector:injected()})} style={{background:'#7c6ff7',border:'none',color:'#080809',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'13px',padding:'.7rem 1.75rem',borderRadius:'7px',cursor:'pointer'}}>
            connect wallet
          </button>
        </div>
      ) : loading ? (
        <div style={{textAlign:'center',padding:'5rem 2rem',fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.25)'}}>
          loading...
        </div>
      ) : launches.length === 0 ? (
        <div style={{textAlign:'center',padding:'5rem 2rem',border:'.5px dashed rgba(255,255,255,.1)',borderRadius:'12px'}}>
          <div style={{fontSize:'32px',marginBottom:'1rem',opacity:.3}}>◈</div>
          <div style={{fontSize:'16px',fontWeight:600,marginBottom:'.5rem'}}>no collections yet</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.3)',marginBottom:'1.5rem'}}>launch your first nft collection on ritual testnet</div>
          <a href="/launch" style={{background:'#7c6ff7',border:'none',color:'#080809',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'13px',padding:'.7rem 1.75rem',borderRadius:'7px',cursor:'pointer',textDecoration:'none',letterSpacing:'.04em'}}>
            launch collection
          </a>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:'12px'}}>
          {launches.map((l,i) => (
            <a key={l.id} href={`/collection/${l.tx_hash||l.id}`} style={{textDecoration:'none',color:'inherit'}}>
              <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',overflow:'hidden',cursor:'pointer'}}>
                <div style={{height:'160px',background:colors[i%colors.length],position:'relative'}}>
                  <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 35% 40%, ${accents[i%accents.length]}88, transparent 65%)`}} />
                  <div style={{position:'absolute',top:'10px',right:'10px',fontFamily:'DM Mono,monospace',fontSize:'9px',color:l.status==='live'?'#4ade80':'#f87171',background:l.status==='live'?'rgba(74,222,128,.12)':'rgba(248,113,113,.12)',border:`.5px solid ${l.status==='live'?'rgba(74,222,128,.25)':'rgba(248,113,113,.25)'}`,padding:'.2rem .55rem',borderRadius:'10px',display:'flex',alignItems:'center',gap:'.3rem'}}>
                    <span style={{width:'4px',height:'4px',borderRadius:'50%',background:l.status==='live'?'#4ade80':'#f87171',display:'inline-block'}} />
                    {l.status}
                  </div>
                  <div style={{position:'absolute',bottom:'10px',left:'10px',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.3)',background:'rgba(8,8,9,.6)',padding:'.2rem .5rem',borderRadius:'4px'}}>
                    {l.symbol}
                  </div>
                </div>
                <div style={{padding:'.85rem 1rem'}}>
                  <div style={{fontSize:'14px',fontWeight:600,marginBottom:'.25rem'}}>{l.name}</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',marginBottom:'.75rem',lineHeight:1.6}}>
                    {l.description?.slice(0,80)}{l.description?.length>80?'...':''}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px'}}>
                    {[
                      {label:'supply', val:l.supply?.toLocaleString()||'—'},
                      {label:'price', val:(l.price||'—')+' RITUAL'},
                      {label:'type', val:l.type||'—'},
                    ].map(s => (
                      <div key={s.label} style={{background:'#080809',borderRadius:'5px',padding:'.4rem .5rem'}}>
                        <div style={{fontFamily:'DM Mono,monospace',fontSize:'8px',color:'rgba(255,255,255,.2)',letterSpacing:'.06em',marginBottom:'.15rem'}}>{s.label}</div>
                        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.6)'}}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:'.75rem',paddingTop:'.75rem',borderTop:'.5px solid rgba(255,255,255,.05)',fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.2)'}}>
                    deployed {new Date(l.created_at).toLocaleDateString('en-GB')}
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
