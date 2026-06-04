const collections = [
  {name:'Ethereal Voids', status:'live', price:'0.12', items:'777', bg:'#0c0818', accent:'#5b21b6', color:'#8b5cf6'},
  {name:'Quantum Masks', status:'live', price:'0.03', items:'2,000', bg:'#08121c', accent:'#1e3a5f', color:'#3b82f6'},
  {name:'Pale Signals', status:'soon', price:'—', items:'500', bg:'#0e0820', accent:'#6d28d9', color:'#a78bfa'},
]

export default function Hero() {
  return (
    <div style={{padding:'1.4rem 1.75rem 1.2rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'.9rem'}}>
        // featured collections
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'9px',height:'220px'}}>
        {collections.map((c, i) => (
          <div key={i} style={{position:'relative',borderRadius:'11px',overflow:'hidden',cursor:'pointer',background:c.bg}}>
            <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 30% 40%, ${c.accent}66, transparent 70%)`}} />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(8,8,9,.95) 0%, transparent 60%)'}} />
            <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'1rem'}}>
              <div style={{fontSize:'15px',fontWeight:700,color:'#ededf0',marginBottom:'.4rem'}}>{c.name}</div>
              <div style={{display:'flex',alignItems:'center',gap:'10px',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.35)'}}>
                {c.status === 'live' ? (
                  <span style={{display:'flex',alignItems:'center',gap:'4px',color:'#4ade80'}}>
                    <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'#4ade80',display:'inline-block'}} />
                    live
                  </span>
                ) : (
                  <span style={{color:'#7c6ff7'}}>coming soon</span>
                )}
                {c.price !== '—' && <span style={{color:c.color}}>{c.price} RITUAL</span>}
                <span>{c.items} items</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
