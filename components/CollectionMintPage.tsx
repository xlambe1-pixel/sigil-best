'use client'
import { useAccount, useConnect, useWriteContract, useReadContract } from 'wagmi'
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

function ShareModal({ collection, slug, artworkUrl, onClose }: { collection: any, slug: string, artworkUrl: string, onClose: () => void }) {
  const pageUrl = `https://sigil.best/collection/${slug}`
  const twitterText = `Just minted from ${collection.name} on Sigil! 🔮\n\nFirst NFT launchpad on Ritual Chain testnet.\n\nMint here: ${pageUrl}\n\nsigil.best`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`
  const [copied, setCopied] = useState(false)

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}} onClick={onClose}>
      <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.1)',borderRadius:'16px',padding:'1.5rem',maxWidth:'420px',width:'100%',position:'relative'}} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:'absolute',top:'1rem',right:'1rem',background:'transparent',border:'none',color:'rgba(255,255,255,.4)',fontSize:'18px',cursor:'pointer'}}>✕</button>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em',marginBottom:'1rem'}}>// share this collection</div>
        {artworkUrl && (
          <div style={{borderRadius:'10px',overflow:'hidden',marginBottom:'1rem',height:'200px',position:'relative'}}>
            <img src={artworkUrl} alt={collection.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
            <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(to top, rgba(8,8,9,.95) 0%, transparent 60%)',padding:'.75rem'}}>
              <div style={{fontSize:'14px',fontWeight:700}}>{collection.name}</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.4)'}}>sigil.best · ritual testnet</div>
            </div>
          </div>
        )}
        <div style={{background:'#080809',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'8px',padding:'.75rem',marginBottom:'1rem',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.5)',lineHeight:1.8}}>
          Just minted from <span style={{color:'#ededf0',fontWeight:600}}>{collection.name}</span> on Sigil! 🔮<br/>
          First NFT launchpad on Ritual Chain testnet.<br/>
          <span style={{color:'#7c6ff7'}}>sigil.best/collection/{slug.slice(0,12)}...</span>
        </div>
        <div style={{display:'flex',gap:'.75rem',marginBottom:'1rem'}}>
          <a href={twitterUrl} target="_blank" style={{flex:1,fontFamily:'DM Mono,monospace',fontSize:'12px',color:'#080809',background:'#ededf0',border:'none',padding:'.65rem',borderRadius:'7px',cursor:'pointer',textDecoration:'none',letterSpacing:'.04em',textAlign:'center',display:'block',fontWeight:700}}>
            𝕏 post on twitter
          </a>
        </div>
        <div style={{display:'flex',gap:'.5rem'}}>
          <div style={{flex:1,background:'#080809',border:'.5px solid rgba(255,255,255,.08)',borderRadius:'6px',padding:'.5rem .75rem',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.3)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
            sigil.best/collection/{slug.slice(0,16)}...
          </div>
          <button onClick={()=>{navigator.clipboard.writeText(pageUrl);setCopied(true);setTimeout(()=>setCopied(false),2000)}} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:copied?'#4ade80':'rgba(255,255,255,.5)',background:'rgba(255,255,255,.05)',border:`.5px solid ${copied?'rgba(74,222,128,.3)':'rgba(255,255,255,.1)'}`,padding:'.5rem .85rem',borderRadius:'6px',cursor:'pointer',whiteSpace:'nowrap'}}>
            {copied?'copied!':'copy link'}
          </button>
        </div>
        {artworkUrl && (
          <div style={{marginTop:'.75rem',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.2)',textAlign:'center'}}>
            tip: right-click the image above to save it for your tweet 📸
          </div>
        )}
      </div>
    </div>
  )
}

export default function CollectionMintPage({ slug }: { slug: string }) {
  const [qty, setQty] = useState(1)
  const [dbCollection, setDbCollection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showShare, setShowShare] = useState(false)
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
    artworkUrl: dbCollection.artwork_url || '',
  } : null)

  const isRealContract = collection?.contract && collection.contract !== '0x0000000000000000000000000000000000000000'

  const { data: totalMintedData, refetch: refetchMinted } = useReadContract({
    address: collection?.contract as `0x${string}`,
    abi: ABI,
    functionName: 'totalMinted',
    query: { enabled: !!isRealContract, refetchInterval: 5000 },
  })

  const { data: mintOpen } = useReadContract({
    address: collection?.contract as `0x${string}`,
    abi: ABI,
    functionName: 'mintOpen',
    query: { enabled: !!isRealContract, refetchInterval: 5000 },
  })

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

  const minted = totalMintedData ? Number(totalMintedData) : 0
  const supply = collection.supply
  const pct = supply > 0 ? Math.round((minted / supply) * 100) : 0
  const priceNum = parseFloat(collection.price)
  const total = (priceNum * qty).toFixed(4)
  const isLive = mintOpen === true
  const creatorAddress = (collection as any).creatorFull || ''
  const artworkUrl = (collection as any).artworkUrl || ''

  const handleMint = () => {
    if (!isConnected) { connect({ connector: injected() }); return }
    if (!isRealContract) return
    writeContract({
      address: collection.contract as `0x${string}`,
      abi: ABI,
      functionName: 'mint',
      args: [BigInt(qty)],
      value: parseEther((priceNum * qty).toString()),
    }, {
      onSuccess: () => {
        setTimeout(() => refetchMinted(), 2000)
        setShowShare(true)
      }
    })
  }

  return (
    <div>
      {showShare && <ShareModal collection={collection} slug={slug} artworkUrl={artworkUrl} onClose={()=>setShowShare(false)} />}
      <div style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.65rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.05)',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.25)'}}>
        <a href="/" style={{color:'rgba(255,255,255,.25)',textDecoration:'none'}}>explore</a>
        <span>›</span>
        <span style={{color:'rgba(255,255,255,.5)'}}>{collection.name}</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',minHeight:'600px'}}>
        <div style={{padding:'2rem 1.75rem',borderRight:'.5px solid rgba(255,255,255,.06)'}}>
          <div style={{borderRadius:'12px',overflow:'hidden',marginBottom:'1.5rem',position:'relative',height:'340px',background:collection.bg}}>
            {artworkUrl ? (
              <img src={artworkUrl} alt={collection.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
            ) : (
              <>
                <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 30% 40%, ${collection.accent}88, transparent 65%)`}} />
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(8,8,9,.95) 0%, transparent 60%)'}} />
                <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.08)',letterSpacing:'.2em'}}>{collection.symbol}</div>
              </>
            )}
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.4rem'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#7c6ff7',letterSpacing:'.08em'}}>✓ verified collection · ritual testnet</div>
              <button onClick={()=>setShowShare(true)} style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.35)',background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.1)',padding:'.25rem .65rem',borderRadius:'5px',cursor:'pointer'}}>
                𝕏 share
              </button>
            </div>
            <div style={{fontSize:'26px',fontWeight:800,letterSpacing:'-.02em',marginBottom:'.35rem'}}>{collection.name}</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)',display:'flex',alignItems:'center',gap:'.5rem'}}>
              <div style={{width:'18px',height:'18px',borderRadius:'50%',background:'rgba(124,111,247,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:'#7c6ff7',fontWeight:700}}>{collection.symbol?.slice(0,2)}</div>
              <a href={creatorAddress ? `/creator/${creatorAddress}` : '#'} style={{color:'#7c6ff7',textDecoration:'none'}}>by {collection.creator}</a>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'1.5rem'}}>
            {[
              {label:'supply', val:supply.toLocaleString(), sub:'total items'},
              {label:'minted', val:minted.toString(), sub:`${pct}% complete`},
              {label:'floor', val:collection.price, sub:'RITUAL'},
              {label:'volume', val:collection.volume?.toFixed(1)||'0', sub:'RITUAL total'},
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
            <a href={`https://explorer.ritualfoundation.org/address/${collection.contract}`} target="_blank" style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#7c6ff7',textDecoration:'none',wordBreak:'break-all'}}>{collection.contract} ↗</a>
          </div>
        </div>
        <div style={{padding:'2rem 1.5rem'}}>
          <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.1)',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.1rem'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em'}}>mint now</div>
              <div style={{display:'flex',alignItems:'center',gap:'.35rem',fontFamily:'DM Mono,monospace',fontSize:'10px',color:isRealContract?(isLive?'#4ade80':'#f87171'):'rgba(255,255,255,.3)',background:isRealContract?(isLive?'rgba(74,222,128,.08)':'rgba(248,113,113,.08)'):'rgba(255,255,255,.04)',border:`.5px solid ${isRealContract?(isLive?'rgba(74,222,128,.18)':'rgba(248,113,113,.18)'):'rgba(255,255,255,.08)'}`,padding:'.22rem .6rem',borderRadius:'10px'}}>
                <span style={{width:'4px',height:'4px',borderRadius:'50%',background:isRealContract?(isLive?'#4ade80':'#f87171'):'rgba(255,255,255,.3)',display:'inline-block'}} />
                {isRealContract?(isLive?'live':'paused'):'no contract'}
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
              <div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.25rem'}}>price per nft</div>
                <div style={{fontSize:'24px',fontWeight:800}}>{collection.price}<span style={{fontSize:'13px',fontWeight:400,color:'rgba(124,111,247,.7)',marginLeft:'.3rem'}}>RITUAL</span></div>
              </div>
            </div>
            {isRealContract && (
              <div style={{marginBottom:'1rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.28)',marginBottom:'.5rem',letterSpacing:'.04em'}}>
                  <span>minted</span><span>{minted} / {supply} ({pct}%)</span>
                </div>
                <div style={{background:'rgba(255,255,255,.05)',borderRadius:'3px',height:'5px',overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:'3px',background:'#7c6ff7',width:`${pct}%`,transition:'width .5s'}} />
                </div>
              </div>
            )}
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
            {isSuccess && (
              <div style={{background:'rgba(74,222,128,.08)',border:'.5px solid rgba(74,222,128,.2)',borderRadius:'7px',padding:'.65rem .85rem',marginBottom:'1rem',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#4ade80',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>✓ minted successfully!</span>
                <button onClick={()=>setShowShare(true)} style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#7c6ff7',background:'transparent',border:'.5px solid rgba(124,111,247,.3)',padding:'.2rem .55rem',borderRadius:'4px',cursor:'pointer'}}>share 𝕏</button>
              </div>
            )}
            {error && <div style={{background:'rgba(248,113,113,.08)',border:'.5px solid rgba(248,113,113,.2)',borderRadius:'7px',padding:'.65rem .85rem',marginBottom:'1rem',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#f87171'}}>✗ {error.message.slice(0,80)}...</div>}
            <button onClick={handleMint} disabled={isPending||!isLive||!isRealContract} style={{width:'100%',background:isPending||!isLive||!isRealContract?'rgba(124,111,247,.4)':'#7c6ff7',border:'none',color:'#080809',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'14px',padding:'.75rem',borderRadius:'8px',cursor:isPending||!isLive||!isRealContract?'not-allowed':'pointer',letterSpacing:'.04em',marginBottom:'.65rem'}}>
              {isPending?'confirming...':!isRealContract?'no contract':!isLive?'mint paused':isConnected?'mint now':'connect wallet to mint'}
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