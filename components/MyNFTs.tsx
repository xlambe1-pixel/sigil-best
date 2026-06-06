'use client'
import { useAccount, useConnect, useReadContract } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'tokenOfOwnerByIndex',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }, { name: 'index', type: 'uint256' }],
    outputs: [{ type: 'uint256' }],
  },
] as const

const colors = ['#0c0818','#0d1520','#0e0820','#111118','#130e00','#0a1a10']
const accents = ['#5b21b6','#1e3a5f','#6d28d9','#374151','#78350f','#166534']

function NFTCard({ collection, tokenId, index }: { collection: any, tokenId: number, index: number }) {
  return (
    <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',overflow:'hidden'}}>
      <a href={`/collection/${collection.tx_hash||collection.id}`} style={{textDecoration:'none',color:'inherit',display:'block'}}>
        <div style={{height:'180px',background:colors[index%colors.length],position:'relative',overflow:'hidden'}}>
          {collection.artwork_url ? (
            <img src={collection.artwork_url} alt={collection.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
          ) : (
            <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 35% 40%, ${accents[index%accents.length]}88, transparent 65%)`}} />
          )}
          <div style={{position:'absolute',top:'10px',left:'10px',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.8)',background:'rgba(8,8,9,.7)',padding:'.25rem .6rem',borderRadius:'4px',fontWeight:600}}>
            #{String(tokenId).padStart(4,'0')}
          </div>
        </div>
      </a>
      <div style={{padding:'.85rem 1rem'}}>
        <div style={{fontSize:'13px',fontWeight:600,marginBottom:'.2rem'}}>{collection.name}</div>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',marginBottom:'.75rem'}}>{collection.symbol} · ritual testnet</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',marginBottom:'.15rem'}}>token id</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'#7c6ff7'}}>#{tokenId}</div>
          </div>
          <a href={`https://explorer.ritualfoundation.org/address/${collection.contract_address}`} target="_blank" style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.3)',textDecoration:'none',background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.08)',padding:'.25rem .6rem',borderRadius:'4px'}}>
            view ↗
          </a>
        </div>
      </div>
    </div>
  )
}

function CollectionNFTs({ collection, address }: { collection: any, address: string }) {
  const { data: balance } = useReadContract({
    address: collection.contract_address as `0x${string}`,
    abi: ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: { enabled: !!collection.contract_address && !!address },
  })

  const count = balance ? Number(balance) : 0
  const tokenIds = Array.from({length: Math.min(count, 20)}, (_, i) => i + 1)

  if (count === 0) return null

  return (
    <>
      {tokenIds.map((id, i) => (
        <NFTCard key={id} collection={collection} tokenId={id} index={i} />
      ))}
    </>
  )
}

export default function MyNFTs() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .not('contract_address', 'is', null)
        .order('created_at', { ascending: false })
      setCollections(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  if (!mounted) return null

  return (
    <div style={{maxWidth:'1100px',margin:'0 auto',padding:'2.5rem 1.75rem'}}>
      <div style={{marginBottom:'2rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'.75rem'}}>// my nfts</div>
        <h1 style={{fontSize:'28px',fontWeight:800,letterSpacing:'-.02em'}}>my collection</h1>
      </div>

      {!isConnected ? (
        <div style={{textAlign:'center',padding:'5rem 2rem',border:'.5px dashed rgba(255,255,255,.1)',borderRadius:'12px'}}>
          <div style={{fontSize:'32px',marginBottom:'1rem',opacity:.3}}>◈</div>
          <div style={{fontSize:'16px',fontWeight:600,marginBottom:'.5rem'}}>connect your wallet</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.3)',marginBottom:'1.5rem'}}>to view your NFTs</div>
          <button onClick={()=>connect({connector:injected()})} style={{background:'#7c6ff7',border:'none',color:'#080809',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'13px',padding:'.7rem 1.75rem',borderRadius:'7px',cursor:'pointer'}}>
            connect wallet
          </button>
        </div>
      ) : loading ? (
        <div style={{textAlign:'center',padding:'5rem 2rem',fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.25)'}}>loading...</div>
      ) : (
        <>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)',marginBottom:'1.5rem'}}>
            checking {collections.length} collections for your NFTs...
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:'12px'}}>
            {collections.map((c, i) => (
              <CollectionNFTs key={c.id} collection={c} address={address!} />
            ))}
          </div>
          <div style={{marginTop:'3rem',textAlign:'center',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.2)'}}>
            only collections launched on sigil.best are shown · ritual testnet
          </div>
        </>
      )}
    </div>
  )
}
