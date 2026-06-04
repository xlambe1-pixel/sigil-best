const stats = [
  {num:'47', label:'collections'},
  {num:'2,841', label:'total volume (ritual)'},
  {num:'18,390', label:'nfts traded'},
  {num:'3,120', label:'unique traders'},
]

export default function StatsBar() {
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
      {stats.map((s, i) => (
        <div key={i} style={{padding:'.9rem 1.75rem',textAlign:'center',borderRight:i<3?'.5px solid rgba(255,255,255,.04)':'none'}}>
          <div style={{fontSize:'20px',fontWeight:700,color:'#ededf0',lineHeight:1}}>{s.num}</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.22)',letterSpacing:'.08em',marginTop:'.25rem'}}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}
