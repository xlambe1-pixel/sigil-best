'use client'
import { useAccount, useConnect, useReadContract } from 'wagmi'
import { injected } from 'wagmi/connectors'

const CONTRACT_ADDRESS = '0x6cf1e216d3aee8c1762ffaff16cec51da505ae1a' as const

const ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'totalMinted',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const

const colors = ['#0c0818','#0d1520','#0e0820','#111118','#130e00']
const accents = ['#5b21b6','#1e3a5f','#6d28d9','#374151','#78350f']

export default function MyNFTs() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()

  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: totalMinted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'totalMinted',
  })

  const count = balance ? Number(balance) : 0

  return (
    <div style={{maxWidth:'1100px',margin:'0 auto',padding:'2.5rem 1.75rem'}}>
      <div style={{marginBottom:'2rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'.75rem'}}>// my nfts</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <h1 style={{fontSize:'28px',fontWeight:800,letterSpacing:'-.02em'}}>my collection</h1>
          {isConnected && (
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)'}}>
              {count} nft{count!==1?'s':''} · {address?.slice(0,6)}...{address?.slice(-4)}
            </div>
          )}
        </div>
      </div>

      {!isConnected ? (
        <div style={{textAlign:'center',padding:'5rem 2rem',border:'.5px dashed rgba(255,255,255,.1)',borderRadius:'12px'}}>
          <div style={{fontSize:'32px',marginBottom:'1rem',opacity:.3}}>◈</div>
          <div style={{fontSize:'16px',fontWeight:600,marginBottom:'.5rem'}}>connect your wallet</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.3)',marginBottom:'1.5rem'}}>to view your nfts on ritual testnet</div>
          <button onClick={()=>connect({connector:injected()})} style={{background:'#7c6ff7',border:'none',color:'#080809',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'13px',padding:'.7rem 1.75rem',borderRadius:'7px',cursor:'pointer'}}>
            connect wallet
          </button>
        </div>
      ) : count === 0 ? (
        <div style={{textAlign:'center',padding:'5rem 2rem',border:'.5px dashed rgba(255,255,255,.1)',borderRadius:'12px'}}>
          <div style={{fontSize:'32px',marginBottom:'1rem',opacity:.3}}>◈</div>
          <div style={{fontSize:'16px',fontWeight:600,marginBottom:'.5rem'}}>no nfts yet</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.3)',marginBottom:'1.5rem'}}>mint your first nft from the launchpad</div>
          <a href="/collection" style={{background:'#7c6ff7',border:'none',color:'#080809',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'13px',padding:'.7rem 1.75rem',borderRadius:'7px',cursor:'pointer',textDecoration:'none'}}>
            explore drops
          </a>
        </div>
      ) : (
        <div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:'12px',marginBottom:'2rem'}}>
            {Array.from({length:count}).map((_,i) => (
              <div key={i} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',overflow:'hidden',cursor:'pointer'}}>
                <div style={{height:'180px',background:colors[i%colors.length],position:'relative'}}>
                  <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 35% 40%, ${accents[i%accents.length]}88, transparent 65%)`}} />
                  <div style={{position:'absolute',bottom:'8px',right:'8px',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.3)',background:'rgba(8,8,9,.6)',padding:'.2rem .5rem',borderRadius:'4px'}}>
                    #{String(i+1).padStart(4,'0')}
                  </div>
                </div>
                <div style={{padding:'.85rem'}}>
                  <div style={{fontSize:'13px',fontWeight:600,marginBottom:'.2rem'}}>Ethereal Voids #{String(i+1).padStart(4,'0')}</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',marginBottom:'.65rem'}}>ritual testnet</div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(124,111,247,.6)'}}>floor 0.05 RITUAL</div>
                    <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.2)',background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.07)',padding:'.18rem .5rem',borderRadius:'4px',cursor:'pointer'}}>list</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'10px',padding:'1rem 1.25rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.25rem'}}>contract</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#7c6ff7'}}>{CONTRACT_ADDRESS.slice(0,10)}...{CONTRACT_ADDRESS.slice(-8)}</div>
            </div>
            <div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.25rem'}}>total minted</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#ededf0'}}>{totalMinted ? Number(totalMinted) : 0} / 777</div>
            </div>
            <a href={`https://explorer.ritualfoundation.org/address/${CONTRACT_ADDRESS}`} target="_blank" style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(124,111,247,.6)',textDecoration:'none'}}>
              view on explorer ↗
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
