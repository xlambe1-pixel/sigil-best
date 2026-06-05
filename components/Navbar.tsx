'use client'
import Link from 'next/link'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const short = (addr: string) => addr.slice(0,6)+'...'+addr.slice(-4)

  return (
    <nav style={{borderBottom:'.5px solid rgba(255,255,255,.07)',background:'#080809',position:'sticky',top:0,zIndex:10}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.85rem 1.25rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
          <Link href="/" style={{textDecoration:'none'}}>
            <div style={{fontSize:'18px',fontWeight:800,letterSpacing:'-.02em',color:'#ededf0'}}>
              Sigil<span style={{color:'#7c6ff7'}}>.</span>
            </div>
          </Link>
          <div className="nav-links">
            {[['explore','/'],['launchpad','/launch'],['trade','#'],['my nfts','/my-nfts'],['my launches','/my-launches'],['stats','/stats']].map(([item,href]) => (
              <Link key={item} href={href} style={{textDecoration:'none'}}>
                <button style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)',background:'transparent',border:'none',padding:'.38rem .85rem',borderRadius:'5px',cursor:'pointer',letterSpacing:'.03em'}}>
                  {item}
                </button>
              </Link>
            ))}
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'.55rem'}}>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(251,191,36,.7)',background:'rgba(251,191,36,.07)',border:'.5px solid rgba(251,191,36,.18)',padding:'.2rem .55rem',borderRadius:'10px',letterSpacing:'.05em'}}>
            testnet
          </div>
          <div className="nav-chain" style={{alignItems:'center',gap:'.35rem',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#7c6ff7',background:'rgba(124,111,247,.07)',border:'.5px solid rgba(124,111,247,.2)',padding:'.28rem .7rem',borderRadius:'20px'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'#7c6ff7',display:'inline-block'}} />
            ritual · 1979
          </div>
          {mounted && isConnected ? (
            <button onClick={()=>disconnect()} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#4ade80',background:'rgba(74,222,128,.08)',border:'.5px solid rgba(74,222,128,.2)',padding:'.38rem .95rem',borderRadius:'5px',cursor:'pointer'}}>
              {short(address!)}
            </button>
          ) : (
            <button onClick={()=>connect({connector:injected()})} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#080809',background:'#7c6ff7',border:'none',padding:'.38rem .95rem',borderRadius:'5px',cursor:'pointer',fontWeight:500}}>
              connect
            </button>
          )}
          <button onClick={()=>setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{background:'transparent',border:'.5px solid rgba(255,255,255,.15)',color:'#ededf0',borderRadius:'5px',padding:'.35rem .6rem',cursor:'pointer',fontSize:'14px'}}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div style={{padding:'.75rem 1.25rem 1rem',borderTop:'.5px solid rgba(255,255,255,.06)',display:'flex',flexDirection:'column',gap:'.25rem'}}>
          {[['explore','/'],['launchpad','/launch'],['trade','#'],['my nfts','/my-nfts'],['my launches','/my-launches'],['stats','/stats']].map(([item,href]) => (
            <Link key={item} href={href} style={{textDecoration:'none'}} onClick={()=>setMenuOpen(false)}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.5)',padding:'.5rem .75rem',borderRadius:'5px',cursor:'pointer',letterSpacing:'.03em'}}>
                {item}
              </div>
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}