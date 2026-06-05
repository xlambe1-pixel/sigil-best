'use client'
import { useAccount, useConnect, useWriteContract, useReadContract } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { parseEther, formatEther } from 'viem'
import { useState } from 'react'

const CONTRACT_ADDRESS = '0x6cf1e216d3aee8c1762ffaff16cec51da505ae1a' as const

const ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'quantity', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'totalMinted',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'maxSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'mintOpen',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'setMintOpen',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_open', type: 'bool' }],
    outputs: [],
  },
] as const

const traits = [
  {type:'background', val:'Void Black', rarity:'12.4%'},
  {type:'aura', val:'Spectral Blue', rarity:'8.1%'},
  {type:'form', val:'Fractal Ring', rarity:'5.3%'},
  {type:'glyph', val:'Sigma', rarity:'3.7%'},
  {type:'border', val:'None', rarity:'41.2%'},
  {type:'rarity', val:'Rare', rarity:'top 15%'},
]

const activity = [
  {type:'mint', name:'Minted #0438', user:'@cryptovoid', price:'0.05', time:'2m ago'},
  {type:'mint', name:'Minted #0437', user:'@ritualist', price:'0.05', time:'5m ago'},
  {type:'sale', name:'Sold #0301', user:'@void.eth → @ritualist', price:'0.18', time:'12m ago'},
  {type:'list', name:'Listed #0219', user:'@hexmkr', price:'0.14', time:'18m ago'},
  {type:'mint', name:'Minted #0436', user:'@glyph99', price:'0.05', time:'24m ago'},
]

const typeColor: Record<string,string> = {
  mint:'rgba(74,222,128,.1)', sale:'rgba(251,191,36,.1)', list:'rgba(124,111,247,.1)',
}
const typeText: Record<string,string> = {
  mint:'#4ade80', sale:'#fbbf24', list:'#7c6ff7',
}
const typeSymbol: Record<string,string> = {
  mint:'+', sale:'⇄', list:'◈',
}

export default function MintPage() {
  const [qty, setQty] = useState(1)
  const { isConnected } = useAccount()
  const { connect } = useConnect()
  const { writeContract, isPending, isSuccess, error } = useWriteContract()

  const { data: totalMinted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'totalMinted',
  })

  const { data: maxSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'maxSupply',
  })

  const { data: mintOpen } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'mintOpen',
  })

  const minted = totalMinted ? Number(totalMinted) : 0
  const supply = maxSupply ? Number(maxSupply) : 777
  const pct = Math.round((minted / supply) * 100)
  const pricePerNft = 0.05
  const total = (pricePerNft * qty).toFixed(2)

  const handleMint = () => {
    if (!isConnected) {
      connect({ connector: injected() })
      return
    }
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'mint',
      args: [BigInt(qty)],
      value: parseEther((pricePerNft * qty).toString()),
    })
  }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.65rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.05)',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.25)'}}>
        <a href="/" style={{color:'rgba(255,255,255,.25)',textDecoration:'none',cursor:'pointer'}}>explore</a>
        <span>›</span>
        <a href="/" style={{color:'rgba(255,255,255,.25)',textDecoration:'none',cursor:'pointer'}}>launchpad</a>
        <span>›</span>
        <span style={{color:'rgba(255,255,255,.5)'}}>Ethereal Voids</span>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',minHeight:'600px'}}>
        <div style={{padding:'2rem 1.75rem',borderRight:'.5px solid rgba(255,255,255,.06)'}}>
          <div style={{background:'#0c0818',borderRadius:'12px',overflow:'hidden',marginBottom:'1.5rem',position:'relative',height:'340px'}}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 30% 40%, #5b21b688, transparent 65%)'}} />
            <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 70% 70%, #1e3a5f55, transparent 60%)'}} />
            <div style={{position:'absolute',bottom:'1rem',right:'1rem',display:'flex',gap:'.4rem'}}>
              <button style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.6)',background:'rgba(8,8,9,.7)',border:'.5px solid rgba(255,255,255,.12)',padding:'.28rem .6rem',borderRadius:'4px',cursor:'pointer'}}>↺ shuffle</button>
              <button style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.6)',background:'rgba(8,8,9,.7)',border:'.5px solid rgba(255,255,255,.12)',padding:'.28rem .6rem',borderRadius:'4px',cursor:'pointer'}}>↗ full</button>
            </div>
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.08)',letterSpacing:'.2em'}}>#0441</div>
          </div>

          <div style={{marginBottom:'1.5rem'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#7c6ff7',letterSpacing:'.08em',marginBottom:'.4rem'}}>✓ verified collection · ritual testnet</div>
            <div style={{fontSize:'26px',fontWeight:800,letterSpacing:'-.02em',marginBottom:'.35rem'}}>Ethereal Voids</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)',display:'flex',alignItems:'center',gap:'.5rem'}}>
              <div style={{width:'18px',height:'18px',borderRadius:'50%',background:'rgba(124,111,247,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:'#7c6ff7',fontWeight:700}}>EV</div>
              by @etherealxyz · <span style={{color:'#7c6ff7',cursor:'pointer'}}>view profile</span>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'1.5rem'}}>
            {[
              {label:'supply', val:supply.toString(), sub:'total items'},
              {label:'minted', val:minted.toString(), sub:`${pct}% complete`},
              {label:'floor', val:'0.05', sub:'RITUAL'},
              {label:'contract', val:'0x6cf1...ae1a', sub:'ritual testnet'},
            ].map(s => (
              <div key={s.label} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'8px',padding:'.75rem .85rem'}}>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.22)',letterSpacing:'.08em',marginBottom:'.3rem'}}>{s.label}</div>
                <div style={{fontSize:'14px',fontWeight:700,lineHeight:1}}>{s.val}</div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',marginTop:'.15rem'}}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{marginBottom:'1.5rem'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em',marginBottom:'.6rem'}}>// about</div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,.45)',lineHeight:1.9,fontWeight:300}}>
              777 unique voids, each one a window into a different layer of the Ritual network. Generated on-chain using Infernet nodes — no two are alike, no metadata stored off-chain. Pure on-chain art.
            </div>
          </div>

          <div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em',marginBottom:'.75rem'}}>// traits (sample #0441)</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px'}}>
              {traits.map(t => (
                <div key={t.type} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'7px',padding:'.6rem .75rem'}}>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'#7c6ff7',letterSpacing:'.08em',marginBottom:'.2rem'}}>{t.type}</div>
                  <div style={{fontSize:'12px',fontWeight:600,marginBottom:'.15rem'}}>{t.val}</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)'}}>{t.rarity} have this</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{padding:'2rem 1.5rem'}}>
          <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.1)',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.1rem'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em'}}>mint now</div>
              <div style={{display:'flex',alignItems:'center',gap:'.35rem',fontFamily:'DM Mono,monospace',fontSize:'10px',color: mintOpen ? '#4ade80' : '#f87171', background: mintOpen ? 'rgba(74,222,128,.08)' : 'rgba(248,113,113,.08)',border:`.5px solid ${mintOpen ? 'rgba(74,222,128,.18)' : 'rgba(248,113,113,.18)'}`,padding:'.22rem .6rem',borderRadius:'10px'}}>
                <span style={{width:'4px',height:'4px',borderRadius:'50%',background: mintOpen ? '#4ade80' : '#f87171',display:'inline-block'}} />
                {mintOpen ? 'live' : 'paused'}
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
              <div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.25rem'}}>price per nft</div>
                <div style={{fontSize:'24px',fontWeight:800}}>0.05<span style={{fontSize:'13px',fontWeight:400,color:'rgba(124,111,247,.7)',marginLeft:'.3rem'}}>RITUAL</span></div>
              </div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.22)'}}>≈ $1.80 USD</div>
            </div>

            <div style={{marginBottom:'1rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.28)',marginBottom:'.5rem',letterSpacing:'.04em'}}>
                <span>minted</span><span>{minted} / {supply}</span>
              </div>
              <div style={{background:'rgba(255,255,255,.05)',borderRadius:'3px',height:'5px',overflow:'hidden'}}>
                <div style={{height:'100%',borderRadius:'3px',background:'#7c6ff7',width:`${pct}%`,transition:'width .5s'}} />
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

            {isSuccess && (
              <div style={{background:'rgba(74,222,128,.08)',border:'.5px solid rgba(74,222,128,.2)',borderRadius:'7px',padding:'.65rem .85rem',marginBottom:'1rem',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#4ade80'}}>
                ✓ minted successfully!
              </div>
            )}

            {error && (
              <div style={{background:'rgba(248,113,113,.08)',border:'.5px solid rgba(248,113,113,.2)',borderRadius:'7px',padding:'.65rem .85rem',marginBottom:'1rem',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#f87171'}}>
                ✗ {error.message.slice(0,80)}...
              </div>
            )}

            <button
              onClick={handleMint}
              disabled={isPending}
              style={{width:'100%',background:isPending?'rgba(124,111,247,.5)':'#7c6ff7',border:'none',color:'#080809',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'14px',padding:'.75rem',borderRadius:'8px',cursor:isPending?'not-allowed':'pointer',letterSpacing:'.04em',marginBottom:'.65rem'}}>
              {isPending ? 'confirming...' : isConnected ? 'mint now' : 'connect wallet to mint'}
            </button>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.2)',textAlign:'center',letterSpacing:'.03em',lineHeight:1.7}}>
              gas fees estimated ~0.001 RITUAL · ritual testnet
            </div>
          </div>

          <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'10px',overflow:'hidden'}}>
            <div style={{padding:'.75rem 1rem',borderBottom:'.5px solid rgba(255,255,255,.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.28)',letterSpacing:'.1em'}}>recent activity</div>
              <span style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(124,111,247,.55)',cursor:'pointer'}}>all →</span>
            </div>
            {activity.map((a,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'.7rem',padding:'.55rem 1rem',borderBottom:i<activity.length-1?'.5px solid rgba(255,255,255,.04)':'none'}}>
                <div style={{width:'26px',height:'26px',borderRadius:'5px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',flexShrink:0,background:typeColor[a.type],color:typeText[a.type]}}>
                  {typeSymbol[a.type]}
                </div>
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