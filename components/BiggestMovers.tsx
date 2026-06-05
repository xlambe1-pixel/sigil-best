const movers = [
  {name:'Ethereal Voids', floor:0.12, chg:143.2, type:'generative', bg:'#0c0818', accent:'#5b21b6'},
  {name:'Runic Beasts', floor:0.07, chg:89.5, type:'pfp', bg:'#0d1520', accent:'#1e3a5f'},
  {name:'Quantum Masks', floor:0.03, chg:67.8, type:'art', bg:'#0e0820', accent:'#6d28d9'},
  {name:'Circuit Glyphs', floor:0.04, chg:31.0, type:'generative', bg:'#0e0e14', accent:'#1e1b4b'},
  {name:'Null Portraits', floor:0.15, chg:-22.1, type:'pfp', bg:'#0a1a10', accent:'#166534'},
]

export default function BiggestMovers() {
  return (
    <div style={{padding:'1.5rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
        <div style={{fontSize:'14px',fontWeight:700}}>biggest movers</div>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(124,111,247,.55)',cursor:'pointer'}}>see all →</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'8px'}}>
        {movers.map((m,i) => (
          <div key={i} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'9px',padding:'.75rem',cursor:'pointer',display:'flex',alignItems:'center',gap:'.6rem'}}>
            <div style={{width:'38px',height:'38px',borderRadius:'7px',background:m.bg,flexShrink:0,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 40% 40%, ${m.accent}99, transparent 70%)`}} />
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:'12px',fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginBottom:'.12rem'}}>{m.name}</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.28)',marginBottom:'.12rem'}}>{m.floor} RITUAL</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',fontWeight:500,color:m.chg>0?'#4ade80':'#f87171'}}>
                {m.chg>0?'+':''}{m.chg.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
