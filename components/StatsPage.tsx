'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { createPublicClient, http } from 'viem'

const ritualTestnet = {
  id: 1979,
  name: 'Ritual Testnet',
  nativeCurrency: { name: 'RITUAL', symbol: 'RITUAL', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.ritualfoundation.org'] } },
} as const

const publicClient = createPublicClient({
  chain: ritualTestnet,
  transport: http(),
})

const ABI = [
  { name: 'totalMinted', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const

async function getMintedFromContract(contractAddress: string): Promise<number> {
  try {
    const result = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: ABI,
      functionName: 'totalMinted',
    })
    return Number(result)
  } catch {
    return 0
  }
}

export default function StatsPage() {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalMinted, setTotalMinted] = useState(0)
  const [totalVolume, setTotalVolume] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false })
      
      const cols = data || []
      setCollections(cols)

      let minted = 0
      let volume = 0
      
      for (const c of cols) {
        if (c.contract_address && c.contract_address !== '0x0000000000000000000000000000000000000000') {
          const count = await getMintedFromContract(c.contract_address)
          minted += count
          volume += count * parseFloat(c.price || '0')
        }
      }
      
      setTotalMinted(minted)
      setTotalVolume(volume)
      setLoading(false)
    }
    fetchData()
  }, [])

  const totalCollections = collections.length
  const creators = [...new Set(collections.map(c => c.creator_address))].filter(Boolean)
  const totalCreators = creators.length

  const topCreators = creators.map(addr => ({
    address: addr,
    collections: collections.filter(c => c.creator_address === addr).length,
    supply: collections.filter(c => c.creator_address === addr).reduce((a,c) => a+(c.supply||0), 0),
  })).sort((a,b) => b.collections - a.collections).slice(0,5)

  const recentCollections = [...collections].slice(0,5)

  return (
    <div style={{maxWidth:'1100px',margin:'0 auto',padding:'2.5rem 1.75rem'}}>
      <div style={{marginBottom:'2rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'.75rem'}}>// platform stats</div>
        <h1 style={{fontSize:'28px',fontWeight:800,letterSpacing:'-.02em'}}>sigil statistics</h1>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'2.5rem'}}>
        {[
          {label:'total collections', val:totalCollections.toString(), sub:'on ritual testnet'},
          {label:'total minted', val:loading?'...':totalMinted.toLocaleString(), sub:'nfts on-chain'},
          {label:'total volume', val:loading?'...':totalVolume.toFixed(4)+' RITUAL', sub:'all time'},
          {label:'unique creators', val:totalCreators.toString(), sub:'launched on sigil'},
        ].map(s => (
          <div key={s.label} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'10px',padding:'1.25rem'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.5rem'}}>{s.label}</div>
            <div style={{fontSize:'28px',fontWeight:800,color:'#ededf0',lineHeight:1,marginBottom:'.25rem'}}>{s.val}</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.2)'}}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginBottom:'2.5rem'}}>
        <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',overflow:'hidden'}}>
          <div style={{padding:'1rem 1.25rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.28)',letterSpacing:'.1em'}}>// top creators</div>
          </div>
          {loading ? (
            <div style={{padding:'2rem',textAlign:'center',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.25)'}}>loading...</div>
          ) : topCreators.length === 0 ? (
            <div style={{padding:'2rem',textAlign:'center',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.25)'}}>no data yet</div>
          ) : topCreators.map((c,i) => (
            <a key={c.address} href={`/creator/${c.address}`} style={{textDecoration:'none',color:'inherit',display:'block'}}>
              <div style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.75rem 1.25rem',borderBottom:'.5px solid rgba(255,255,255,.04)'}}>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.2)',width:'1rem'}}>{i+1}</div>
                <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'rgba(124,111,247,.2)',border:'.5px solid rgba(124,111,247,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:800,color:'#7c6ff7',flexShrink:0}}>
                  {c.address.slice(2,4).toUpperCase()}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#7c6ff7'}}>{c.address.slice(0,6)}...{c.address.slice(-4)}</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',marginTop:'.1rem'}}>{c.collections} collection{c.collections!==1?'s':''}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#ededf0'}}>{c.supply.toLocaleString()}</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',marginTop:'.1rem'}}>total supply</div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',overflow:'hidden'}}>
          <div style={{padding:'1rem 1.25rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.28)',letterSpacing:'.1em'}}>// recent launches</div>
          </div>
          {loading ? (
            <div style={{padding:'2rem',textAlign:'center',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.25)'}}>loading...</div>
          ) : recentCollections.length === 0 ? (
            <div style={{padding:'2rem',textAlign:'center',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.25)'}}>no launches yet</div>
          ) : recentCollections.map((c,i) => (
            <a key={c.id} href={`/collection/${c.slug||c.tx_hash||c.id}`} style={{textDecoration:'none',color:'inherit',display:'block'}}>
              <div style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.75rem 1.25rem',borderBottom:'.5px solid rgba(255,255,255,.04)'}}>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.2)',width:'1rem'}}>{i+1}</div>
                <div style={{width:'30px',height:'30px',borderRadius:'6px',overflow:'hidden',background:'#0c0818',border:'.5px solid rgba(255,255,255,.07)',flexShrink:0}}>
                  {c.artwork_url ? (
                    <img src={c.artwork_url} alt={c.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  ) : (
                    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontFamily:'DM Mono,monospace',color:'rgba(124,111,247,.6)'}}>
                      {c.symbol?.slice(0,3)}
                    </div>
                  )}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:'12px',fontWeight:600,color:'#ededf0'}}>{c.name}</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',marginTop:'.1rem'}}>{c.type} · {c.supply?.toLocaleString()} items</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#7c6ff7'}}>{c.price} RITUAL</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',marginTop:'.1rem'}}>{new Date(c.created_at).toLocaleDateString('en-GB')}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',padding:'1.25rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.28)',letterSpacing:'.1em',marginBottom:'1rem'}}>// ritual chain info</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
          {[
            {label:'network', val:'Ritual Testnet'},
            {label:'chain id', val:'1979'},
            {label:'rpc', val:'rpc.ritualfoundation.org'},
            {label:'explorer', val:'explorer.ritualfoundation.org'},
          ].map(s => (
            <div key={s.label}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.3rem'}}>{s.label}</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#ededf0'}}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}