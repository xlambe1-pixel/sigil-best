import Link from 'next/link'
import { collections } from '@/lib/collections'

export default function Hero() {
  const featured = collections.slice(0, 3)

  return (
    <div style={{padding:'1rem 1.25rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'.75rem'}}>
        // featured collections
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'8px'}}>
        {featured.map((c,i) => (
          <Link key={i} href={`/collection/${c.slug}`} style={{textDecoration:'none'}}>
            <div style={{position:'relative',borderRadius:'8px',overflow:'hidden',cursor:'pointer',background:c.bg,height:'120px'}}>
              {c.artworkUrl ? (
                <img src={c.artworkUrl} alt={c.name} style={{width:'100%',height:'120px',objectFit:'cover',objectPosition:'center 20%',display:'block'}} />
              ) : (
                <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 30% 40%, ${c.accent}66, transparent 70%)`}} />
              )}
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(8,8,9,.95) 0%, transparent 50%)'}} />
              <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'.5rem .65rem'}}>
                <div style={{fontSize:'12px',fontWeight:700,color:'#ededf0',marginBottom:'.2rem'}}>{c.name}</div>
                <div style={{display:'flex',alignItems:'center',gap:'6px',fontFamily:'DM Mono,monospace',fontSize:'9px'}}>
                  {c.status==='live' ? (
                    <span style={{display:'flex',alignItems:'center',gap:'3px',color:'#4ade80'}}>
                      <span style={{width:'3px',height:'3px',borderRadius:'50%',background:'#4ade80',display:'inline-block'}} />
                      live
                    </span>
                  ) : (
                    <span style={{color:'#7c6ff7'}}>soon</span>
                  )}
                  <span style={{color:'rgba(165,160,255,.7)'}}>{c.price} RITUAL</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}