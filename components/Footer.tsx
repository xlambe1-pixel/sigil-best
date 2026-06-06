import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{borderTop:'.5px solid rgba(255,255,255,.06)',background:'#080809',padding:'2rem 1.75rem',marginTop:'3rem'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'2rem',marginBottom:'2rem'}}>

          <div>
            <div style={{fontSize:'20px',fontWeight:800,letterSpacing:'-.02em',color:'#ededf0',marginBottom:'.75rem'}}>
              Sigil<span style={{color:'#7c6ff7'}}>.</span>
            </div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)',lineHeight:1.9,maxWidth:'260px'}}>
              The first NFT launchpad and marketplace on Ritual Chain testnet. Launch, mint and trade NFTs on the most advanced AI-native blockchain.
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginTop:'1rem'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(251,191,36,.7)',background:'rgba(251,191,36,.07)',border:'.5px solid rgba(251,191,36,.18)',padding:'.2rem .55rem',borderRadius:'10px',letterSpacing:'.05em'}}>
                testnet
              </div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(124,111,247,.7)',background:'rgba(124,111,247,.07)',border:'.5px solid rgba(124,111,247,.18)',padding:'.2rem .55rem',borderRadius:'10px',letterSpacing:'.05em'}}>
                ritual · 1979
              </div>
            </div>
          </div>

          <div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em',marginBottom:'.85rem'}}>// explore</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
              {[['collections','/'],[' launchpad','/launch'],['trade','/trade'],['stats','/stats']].map(([label,href]) => (
                <Link key={label} href={href} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)',textDecoration:'none',letterSpacing:'.03em'}}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em',marginBottom:'.85rem'}}>// account</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
              {[['my nfts','/my-nfts'],['my launches','/my-launches'],['faucet','/faucet'],['about','/about']].map(([label,href]) => (
                <Link key={label} href={href} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)',textDecoration:'none',letterSpacing:'.03em'}}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em',marginBottom:'.85rem'}}>// network</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
              {[
                ['ritual chain ↗','https://ritual.net'],
                ['explorer ↗','https://explorer.ritualfoundation.org'],
                ['faucet ↗','https://faucet.ritualfoundation.org'],
                ['docs ↗','https://docs.ritual.net'],
              ].map(([label,href]) => (
                <a key={label} href={href} target="_blank" style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)',textDecoration:'none',letterSpacing:'.03em'}}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{borderTop:'.5px solid rgba(255,255,255,.05)',paddingTop:'1.25rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.15)',letterSpacing:'.05em'}}>
            © 2026 sigil.best · built on ritual chain · chain id 1979
          </div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.15)',letterSpacing:'.05em'}}>
            all transactions on testnet · no real value
          </div>
        </div>
      </div>
    </footer>
  )
}
