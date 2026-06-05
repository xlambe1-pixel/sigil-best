'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',flexDirection:'column',gap:'1.5rem',padding:'2rem',textAlign:'center'}}>
      <div style={{fontSize:'32px',opacity:.4}}>◈</div>
      <div style={{fontSize:'18px',fontWeight:700}}>something went wrong</div>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.3)',maxWidth:'400px',lineHeight:1.8}}>
        {error.message || 'an unexpected error occurred'}
      </div>
      <div style={{display:'flex',gap:'.75rem'}}>
        <button onClick={reset} style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'#080809',background:'#7c6ff7',border:'none',padding:'.6rem 1.25rem',borderRadius:'6px',cursor:'pointer',letterSpacing:'.04em'}}>
          try again
        </button>
        <a href="/" style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.4)',background:'transparent',border:'.5px solid rgba(255,255,255,.12)',padding:'.6rem 1.25rem',borderRadius:'6px',cursor:'pointer',textDecoration:'none',letterSpacing:'.04em'}}>
          go home
        </a>
      </div>
    </div>
  )
}
