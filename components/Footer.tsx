export default function Footer() {
  return (
    <footer style={{borderTop:'.5px solid rgba(255,255,255,.06)',padding:'1.25rem 1.75rem',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2rem'}}>
      <div style={{fontFamily:'Syne,sans-serif',fontSize:'15px',fontWeight:800,color:'rgba(255,255,255,.15)'}}>
        Sigil<span style={{color:'rgba(124,111,247,.35)'}}>.</span>
      </div>
      <div style={{display:'flex',gap:'1.5rem'}}>
        {[
          ['about','/about'],
          ['faucet','/faucet'],
          ['stats','/stats'],
          ['explorer ↗','https://explorer.ritualfoundation.org'],
        ].map(([label,href]) => (
          <a key={label} href={href} target={href.startsWith('http')?'_blank':'_self'} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.2)',textDecoration:'none',letterSpacing:'.04em'}}>
            {label}
          </a>
        ))}
      </div>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.15)',letterSpacing:'.07em'}}>
        ritual chain · chain id 1979 · testnet
      </div>
    </footer>
  )
}