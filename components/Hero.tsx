import Link from 'next/link'
import { collections } from '@/lib/collections'

export default function Hero() {
  const featured = collections.slice(0, 3)

  return (
    <div style={{padding:'1.25rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'.9rem'}}>
        // featured collections
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'9px',height:'220px'}}>
        {featured.map((c,i) => (
          <Link key={i} href={`/collection/${c.slug}`} style={{textDecoration:'none'}}>
            <div style={{position:'relative',borderRadius:'11px',overflow:'hidden',cursor:'pointer',background:c.bg,height:'100%'}}>
              {c.artworkUrl ? (
                <img src={c.artworkUrl} alt={c.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
              ) : (
                <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 30% 40%, ${c.accent}66, transparent 70%)`}} />
              )}
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(8,8,9,.95) 0%, transparent 60%)'}} />
              <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'.75rem'}}>
                <div style={{fontSize:'14px',fontWeight:700,color:'#ededf0',marginBottom:'.3rem'}}>{c.name}</div>
                <div style={{display:'flex',alignItems:'center',gap:'8px',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.35)',flexWrap:'wrap'}}>
                  {c.status==='live' ? (
                    <span style={{display:'flex',alignItems:'center',gap:'4px',color:'#4ade80'}}>
                      <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'#4ade80',display:'inline-block'}} />
                      live
                    </span>
                  ) : (
                    <span style={{color:'#7c6ff7'}}>coming soon</span>
                  )}
                  <span style={{color:'#a5a0ff'}}>{c.price} RITUAL</span>
                  <span>{c.supply.toLocaleString()} items</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}