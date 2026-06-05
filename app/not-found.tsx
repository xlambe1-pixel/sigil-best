export default function NotFound() {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',flexDirection:'column',gap:'1.5rem',padding:'2rem',textAlign:'center',background:'#080809',color:'#ededf0'}}>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(124,111,247,.5)',letterSpacing:'.12em',marginBottom:'.5rem'}}>// 404</div>
      <div style={{fontSize:'18px',fontWeight:700}}>page not found</div>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.3)',lineHeight:1.8}}>
        this sigil does not exist
      </div>
      <a href="/" style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'#080809',background:'#7c6ff7',border:'none',padding:'.6rem 1.25rem',borderRadius:'6px',cursor:'pointer',textDecoration:'none',letterSpacing:'.04em'}}>
        back to explore
      </a>
    </div>
  )
}
