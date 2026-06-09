'use client'
import { useAccount, useConnect, useWriteContract, useReadContract } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import WhitelistManager from './WhitelistManager'

const ABI = [
  { name:'setMintOpen', type:'function', stateMutability:'nonpayable', inputs:[{name:'_open',type:'bool'}], outputs:[] },
  { name:'mintOpen', type:'function', stateMutability:'view', inputs:[], outputs:[{type:'bool'}] },
] as const

function MintToggle({ contractAddress }: { contractAddress: string }) {
  const { writeContract, isPending } = useWriteContract()
  const { data: mintOpen, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'mintOpen',
    query: { enabled: !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000' }
  })

  const toggle = async () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: ABI,
      functionName: 'setMintOpen',
      args: [!mintOpen],
    }, {
      onSuccess: () => setTimeout(() => refetch(), 2000)
    })
  }

  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    return <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.2)'}}>no contract</div>
  }

  return (
    <button onClick={toggle} disabled={isPending} style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:isPending?'rgba(255,255,255,.3)':mintOpen?'#f87171':'#4ade80',background:isPending?'rgba(255,255,255,.04)':mintOpen?'rgba(248,113,113,.1)':'rgba(74,222,128,.1)',border:`.5px solid ${isPending?'rgba(255,255,255,.08)':mintOpen?'rgba(248,113,113,.25)':'rgba(74,222,128,.25)'}`,padding:'.3rem .7rem',borderRadius:'6px',cursor:isPending?'not-allowed':'pointer',letterSpacing:'.04em',whiteSpace:'nowrap'}}>
      {isPending?'waiting...':mintOpen?'pause mint':'open mint'}
    </button>
  )
}

function ShareButton({ collection }: { collection: any }) {
  const slug = collection.slug || collection.tx_hash || collection.id
  const mintUrl = `https://sigil.best/collection/${slug}`
  const tweetText = `🔮 Just launched "${collection.name}" on @sigilbest!\n\nMint now on Ritual Chain testnet 👇\n${mintUrl}\n\n#RitualChain #NFT #Web3`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`

  return (
    <a href={twitterUrl} target="_blank" style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.5)',background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.1)',padding:'.3rem .7rem',borderRadius:'6px',cursor:'pointer',textDecoration:'none',whiteSpace:'nowrap',display:'inline-flex',alignItems:'center',gap:'.3rem'}}>
      𝕏 share
    </a>
  )
}

export default function MyLaunches() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const [launches, setLaunches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [expanded, setExpanded] = useState<string|null>(null)

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
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)'}}>{launches.length} collection{launches.length!==1?'s':''}</div>
              <a href="/launch" style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#080809',background:'#7c6ff7',border:'none',padding:'.38rem .95rem',borderRadius:'5px',cursor:'pointer',textDecoration:'none',letterSpacing:'.04em'}}>+ new collection</a>
            </div>
          )}
        </div>
      </div>

      {!isConnected ? (
        <div style={{textAlign:'center',padding:'5rem 2rem',border:'.5px dashed rgba(255,255,255,.1)',borderRadius:'12px'}}>
          <div style={{fontSize:'32px',marginBottom:'1rem',opacity:.3}}>◈</div>
          <div style={{fontSize:'16px',fontWeight:600,marginBottom:'.5rem'}}>connect your wallet</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.3)',marginBottom:'1.5rem'}}>to view your launched collections</div>
          <button onClick={()=>connect({connector:injected()})} style={{background:'#7c6ff7',border:'none',color:'#080809',fontFamily:'Inter,sans-serif',fontWeight:700,fontSize:'13px',padding:'.7rem 1.75rem',borderRadius:'7px',cursor:'pointer'}}>connect wallet</button>
        </div>
      ) : loading ? (
        <div style={{textAlign:'center',padding:'5rem 2rem',fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.25)'}}>loading...</div>
      ) : launches.length === 0 ? (
        <div style={{textAlign:'center',padding:'5rem 2rem',border:'.5px dashed rgba(255,255,255,.1)',borderRadius:'12px'}}>
          <div style={{fontSize:'32px',marginBottom:'1rem',opacity:.3}}>◈</div>
          <div style={{fontSize:'16px',fontWeight:600,marginBottom:'.5rem'}}>no collections yet</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.3)',marginBottom:'1.5rem'}}>launch your first nft collection on ritual testnet</div>
          <a href="/launch" style={{background:'#7c6ff7',border:'none',color:'#080809',fontFamily:'Inter,sans-serif',fontWeight:700,fontSize:'13px',padding:'.7rem 1.75rem',borderRadius:'7px',cursor:'pointer',textDecoration:'none',letterSpacing:'.04em'}}>launch collection</a>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {launches.map((l) => (
            <div key={l.id} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{display:'grid',gridTemplateColumns:'120px 1fr',alignItems:'stretch'}}>
                <a href={`/collection/${l.slug||l.tx_hash||l.id}`} style={{textDecoration:'none',color:'inherit'}}>
                  <div style={{height:'100%',minHeight:'100px',position:'relative',overflow:'hidden',background:'#0c0818'}}>
                    {l.artwork_url ? (
                      <img src={l.artwork_url} alt={l.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                    ) : (
                      <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 35% 40%, #5b21b688, transparent 65%)'}} />
                    )}
                    <div style={{position:'absolute',bottom:'8px',left:'8px',fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.4)',background:'rgba(8,8,9,.7)',padding:'.15rem .4rem',borderRadius:'3px'}}>{l.symbol}</div>
                  </div>
                </a>
                <div style={{padding:'.85rem 1rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.5rem'}}>
                    <div>
                      <div style={{fontSize:'15px',fontWeight:600,marginBottom:'.15rem'}}>{l.name}</div>
                      <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)'}}>{l.type} · {l.supply?.toLocaleString()} items · {l.price} RITUAL</div>
                    </div>
                    <div style={{display:'flex',gap:'.5rem',alignItems:'center',flexWrap:'wrap',justifyContent:'flex-end'}}>
                      {l.contract_address && <MintToggle contractAddress={l.contract_address} />}
                      <ShareButton collection={l} />
                      <button onClick={()=>setExpanded(expanded===l.id?null:l.id)} style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(124,111,247,.6)',background:'rgba(124,111,247,.06)',border:'.5px solid rgba(124,111,247,.2)',padding:'.3rem .7rem',borderRadius:'6px',cursor:'pointer',letterSpacing:'.04em'}}>
                        {expanded===l.id?'hide whitelist':'manage whitelist'}
                      </button>
                    </div>
                  </div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.2)'}}>
                    deployed {new Date(l.created_at).toLocaleDateString('en-GB')}
                    {l.contract_address && <span style={{marginLeft:'.75rem',color:'rgba(124,111,247,.5)'}}>{l.contract_address.slice(0,10)}...{l.contract_address.slice(-6)}</span>}
                  </div>
                </div>
              </div>
              {expanded===l.id && l.contract_address && (
                <div style={{padding:'0 1rem 1rem'}}>
                  <WhitelistManager contractAddress={l.contract_address} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}