'use client'
import { useAccount, useConnect, useWriteContract } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { parseEther } from 'viem'
import { useState, useEffect } from 'react'
import { getCollection } from '@/lib/collections'
import { supabase } from '@/lib/supabase'

const ABI = [
  { name:'mint', type:'function', stateMutability:'payable', inputs:[{name:'quantity',type:'uint256'}], outputs:[] },
  { name:'totalMinted', type:'function', stateMutability:'view', inputs:[], outputs:[{type:'uint256'}] },
  { name:'mintOpen', type:'function', stateMutability:'view', inputs:[], outputs:[{type:'bool'}] },
] as const

const activity = [
  {type:'mint', name:'Minted #0438', user:'@cryptovoid', price:'0.05', time:'2m ago'},
  {type:'mint', name:'Minted #0437', user:'@ritualist', price:'0.05', time:'5m ago'},
  {type:'sale', name:'Sold #0301', user:'@void.eth → @ritualist', price:'0.18', time:'12m ago'},
  {type:'list', name:'Listed #0219', user:'@hexmkr', price:'0.14', time:'18m ago'},
  {type:'mint', name:'Minted #0436', user:'@glyph99', price:'0.05', time:'24m ago'},
]
const typeColor: Record<string,string> = { mint:'rgba(74,222,128,.1)', sale:'rgba(251,191,36,.1)', list:'rgba(124,111,247,.1)' }
const typeText: Record<string,string> = { mint:'#4ade80', sale:'#fbbf24', list:'#7c6ff7' }
const typeSymbol: Record<string,string> = { mint:'+', sale:'⇄', list:'◈' }

export default function CollectionMintPage({ slug }: { slug: string }) {
  const [qty, setQty] = useState(1)
  const [dbCollection, setDbCollection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { isConnected } = useAccount()
  const { connect } = useConnect()
  const { writeContract, isPending, isSuccess, error } = useWriteContract()

  const staticCollection = getCollection(slug)

  useEffect(() => {
    if (!staticCollection) {
      const fetchDb = async () => {
        const { data } = await supabase
          .from('collections')
          .select('*')
          .eq('tx_hash', slug)
          .single()
        setDbCollection(data)
        setLoading(false)
      }
      fetchDb()
    } else {
      setLoading(false)
    }
  }, [slug])

  const collection = staticCollection || (dbCollection ? {
    slug: dbCollection.tx_hash || dbCollection.id,
    name: dbCollection.name,
    symbol: dbCollection.symbol,
    creator: dbCollection.creator_address ? dbCollection.creator_address.slice(0,6)+'...'+dbCollection.creator_address.slice(-4) : '@unknown',
    creatorFull: dbCollection.creator_address || '',
    description: dbCollection.description || '',
    supply: dbCollection.supply || 0,
    price: dbCollection.price || '0.05',
    status: dbCollection.status || 'live',
    type: dbCollection.type || 'generative',
    contract: dbCollection.contract_address || '0x0000000000000000000000000000000000000000',
    floor: parseFloat(dbCollection.price) || 0,
    volume: 0,
    listed: 0,
    bg: '#0c0818',
    accent: '#5b21b6',
  } : null)

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em'}}>loading...</div>
    </div>
  )

  if (!collection) return (
    <div style={{textAlign:'center',padding:'5rem 2rem'}}>
      <div style={{fontSize:'28px',fontWeight:800,marginBottom:'1rem'}}>collection not found</div>
      <a href="/" style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'#7c6ff7'}}>← back to explore</a>
    </div>
  )

  const priceNum = parseFloat(collection.price)
  const total = (priceNum * qty).toFixed(2)
  const isRealContract = collection.contract !== '0x0000000000000000000000000000000000000000'
  const creatorAddress = (collection as any).creatorFull || ''

  const handleMint = () => {
    if (!isConnected) { connect({ connector: injected() }); return }
    if (!isRealContract) return
    writeContract({
      address: collection.contract as `0x${string}`,
      abi: ABI,
      functionName: 'mint',
      args: [BigInt(qty)],
      value: parseEther((priceNum * qty).toString()),
    })
  }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.65rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.05)',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.25)'}}>
        <a href="/" style={{color:'rgba(255,255,255,.25)',textDecoration:'none'}}>explore</a>
        <span>›</span>
        <span style={{color:'rgba(255,255,255,.5)'}}>{collection.name}</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',minHeight:'600px'}}>
        <div style={{padding:'2rem 1.75rem',borderRight:'.5px solid rgba(255,255,255,.06)'}}>
          <div style={{background:collection.bg,borderRadius:'12px',overflow:'hidden',marginBottom:'1.5rem',position:'relative',height:'340px'}}>
            <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 30% 40%, ${collection.accent}88, transparent 65%)`}} />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(8,8,9,.95) 0%, transparent 60%)'}} />
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.08)',letterSpacing:'.2em'}}>{collection.symbol}</div>
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#7c6ff7',letterSpacing:'.08em',marginBottom:'.4rem'}}>✓ verified collection · ritual testnet</div>
            <div style={{fontSize:'26px',fontWeight:800,letterSpacing:'-.02em',marginBottom:'.35rem'}}>{collection.name}</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)',display:'flex',alignItems:'center',gap:'.5rem'}}>
              <div style={{width:'18px',height:'18px',borderRadius:'50%',background:'rgba(124,111,247,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:'#7c6ff7',fontWeight:700}}>{collection.symbol?.slice(0,2)}</div>
              <a href={creatorAddress ? `/creator/${creatorAddress}` : '#'} style={{color:'#7c6ff7',textDecoration:'none',cursor:'pointer'}}>
                by {collection.creator}
              </a>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'1.5rem'}}>
            {[
              {label:'supply', val:collection.supply.toLocaleString(), sub:'total items'},
              {label:'price', val:collection.price, sub:'RITUAL'},
              {label:'floor', val:collection.floor.toString(), sub:'RITUAL'},
              {label:'volume', val:collection.volume.toFixed(1), sub:'RITUAL total'},
            ].map(s => (
              <div key={s.label} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'8px',padding:'.75rem .85rem'}}>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.22)',letterSpacing:'.08em',marginBottom:'.3rem'}}>{s.label}</div>
                <div style={{fontSize:'16px',fontWeight:700,lineHeight:1}}>{s.val}</div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',marginTop:'.15rem'}}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em',marginBottom:'.6rem'}}>// about</div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,.45)',lineHeight:1.9,fontWeight:300}}>{collection.description || 'no description provided.'}</div>
          </div>
          <div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em',marginBottom:'.6rem'}}>// contract</div>
            <a href={`https://explorer.ritualfoundation.org/address/${collection.contract}`} target="_blank" style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#7c6ff7',textDecoration:'none'}}>{collection.contract} ↗</a>
          </div>
        </div>
        <div style={{padding:'2rem 1.5rem'}}>
          <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.1)',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.1rem'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em'}}>mint now</div>
              <div style={{display:'flex',alignItems:'center',gap:'.35rem',fontFamily:'DM Mono,monospace',fontSize:'10px',color:collection.status==='live'?'#4ade80':'#f87171',background:collection.status==='live'?'rgba(74,222,128,.08)':'rgba(248,113,113,.08)',border:`.5px solid ${collection.status==='live'?'rgba(74,222,128,.18)':'rgba(248,113,113,.18)'}`,padding:'.22rem .6rem',borderRadius:'10px'}}>
                <span style={{width:'4px',height:'4px',borderRadius:'50%',background:collection.status==='live'?'#4ade80':'#f87171',display:'inline-block'}} />
                {collection.status==='live'?'live':collection.status==='soon'?'coming soon':'ended'}
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
              <div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.25rem'}}>price per nft</div>
                <div style={{fontSize:'24px',fontWeight:800}}>{collection.price}<span style={{fontSize:'13px',fontWeight:400,color:'rgba(124,111,247,.7)',marginLeft:'.3rem'}}>RITUAL</span></div>
              </div>
            </div>
            <div style={{marginBottom:'1rem'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.5rem'}}>quantity</div>
              <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:'32px',height:'32px',borderRadius:'6px',border:'.5px solid rgba(255,255,255,.12)',background:'transparent',color:'#ededf0',fontSize:'16px',cursor:'pointer'}}>−</button>
                <div style={{fontSize:'18px',fontWeight:700,minWidth:'24px',textAlign:'center',fontFamily:'DM Mono,monospace'}}>{qty}</div>
                <button onClick={()=>setQty(q=>Math.min(5,q+1))} style={{width:'32px',height:'32px',borderRadius:'6px',border:'.5px solid rgba(255,255,255,.12)',background:'transparent',color:'#ededf0',fontSize:'16px',cursor:'pointer'}}>+</button>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.22)',marginLeft:'auto'}}>max 5</div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)'}}>= {total} RITUAL</div>
              </div>
            </div>
            {isSuccess && <div style={{background:'rgba(74,222,128,.08)',border:'.5px solid rgba(74,222,128,.2)',borderRadius:'7px',padding:'.65rem .85rem',marginBottom:'1rem',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#4ade80'}}>✓ minted successfully!</div>}
            {error && <div style={{background:'rgba(248,113,113,.08)',border:'.5px solid rgba(248,113,113,.2)',borderRadius:'7px',padding:'.65rem .85rem',marginBottom:'1rem',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#f87171'}}>✗ {error.message.slice(0,80)}...</div>}
            <button onClick={handleMint} disabled={isPending||collection.status!=='live'} style={{width:'100%',background:isPending||collection.status!=='live'?'rgba(124,111,247,.4)':'#7c6ff7',border:'none',color:'#080809',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'14px',padding:'.75rem',borderRadius:'8px',cursor:isPending||collection.status!=='live'?'not-allowed':'pointer',letterSpacing:'.04em',marginBottom:'.65rem'}}>
              {isPending?'confirming...':isConnected?collection.status==='live'?'mint now':'coming soon':'connect wallet to mint'}
            </button>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.2)',textAlign:'center',letterSpacing:'.03em',lineHeight:1.7}}>gas fees estimated ~0.001 RITUAL · ritual testnet</div>
          </div>
          <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'10px',overflow:'hidden'}}>
            <div style={{padding:'.75rem 1rem',borderBottom:'.5px solid rgba(255,255,255,.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.28)',letterSpacing:'.1em'}}>recent activity</div>
              <span style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(124,111,247,.55)',cursor:'pointer'}}>all →</span>
            </div>
            {activity.map((a,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'.7rem',padding:'.55rem 1rem',borderBottom:i<activity.length-1?'.5px solid rgba(255,255,255,.04)':'none'}}>
                <div style={{width:'26px',height:'26px',borderRadius:'5px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',flexShrink:0,background:typeColor[a.type],color:typeText[a.type]}}>{typeSymbol[a.type]}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:'12px',fontWeight:600}}>{a.name}</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',marginTop:'.1rem'}}>{a.user}</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px'}}>{a.price} RITUAL</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.2)',marginTop:'.1rem'}}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}