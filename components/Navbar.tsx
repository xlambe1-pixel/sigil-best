import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.85rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.07)',background:'#080809'}}>
      <div style={{display:'flex',alignItems:'center',gap:'2rem'}}>
        <Link href="/" style={{textDecoration:'none'}}>
          <div style={{fontSize:'18px',fontWeight:800,letterSpacing:'-.02em',color:'#ededf0'}}>
            Sigil<span style={{color:'#7c6ff7'}}>.</span>
          </div>
        </Link>
        <div style={{display:'flex',gap:'.15rem'}}>
          {[['explore','/'],['launchpad','/launch'],['trade','#'],['my nfts','#'],['stats','#']].map(([item,href]) => (
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
        <div style={{display:'flex',alignItems:'center',gap:'.35rem',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#7c6ff7',background:'rgba(124,111,247,.07)',border:'.5px solid rgba(124,111,247,.2)',padding:'.28rem .7rem',borderRadius:'20px'}}>
          <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'#7c6ff7',display:'inline-block'}} />
          ritual · 1979
        </div>
        <button style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#080809',background:'#7c6ff7',border:'none',padding:'.38rem .95rem',borderRadius:'5px',cursor:'pointer',fontWeight:500}}>
          connect wallet
        </button>
      </div>
    </nav>
  )
}