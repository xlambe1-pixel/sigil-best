'use client'
import Link from 'next/link'

const collections = [
  {rank:1, name:'Ethereal Voids', type:'generative', floor:0.12, offer:0.10, chg:143.2, vol:38.4, listed:165, slug:'ethereal-voids'},
  {rank:2, name:'Runic Beasts', type:'pfp', floor:0.07, offer:0.06, chg:89.5, vol:24.1, listed:88, slug:'runic-beasts'},
  {rank:3, name:'Quantum Masks', type:'art', floor:0.03, offer:0.025, chg:67.8, vol:18.6, listed:310, slug:'quantum-masks'},
  {rank:4, name:'Obsidian Frames', type:'generative', floor:0.22, offer:0.20, chg:-8.4, vol:14.2, listed:42, slug:'obsidian-frames'},
  {rank:5, name:'Pale Signals', type:'art', floor:0.09, offer:0.08, chg:0, vol:9.7, listed:0, slug:'pale-signals'},
  {rank:6, name:'Null Portraits', type:'pfp', floor:0.15, offer:0.13, chg:-22.1, vol:7.3, listed:200, slug:'null-portraits'},
  {rank:7, name:'Circuit Glyphs', type:'generative', floor:0.04, offer:0.035, chg:31.0, vol:5.8, listed:490, slug:'circuit-glyphs'},
  {rank:8, name:'Drift Echoes', type:'art', floor:0.06, offer:0.05, chg:-4.7, vol:3.2, listed:130, slug:'drift-echoes'},
]

const colors = ['#0c0818','#0d1520','#0e0820','#111118','#130e00','#0a1a10','#0e0e14','#100a14']
const accents = ['#5b21b6','#1e3a5f','#6d28d9','#374151','#78350f','#166534','#1e1b4b','#6b21a8']

export default function CollectionsTable() {
  return (
    <div>
      <div style={{display:'flex',padding:'0 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
        {['top collections','live mints','upcoming','recently ended'].map((t,i) => (
          <div key={t} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:i===0?'#ededf0':'rgba(255,255,255,.3)',padding:'.6rem 1rem',borderBottom:i===0?'1.5px solid #7c6ff7':'1.5px solid transparent',cursor:'pointer',letterSpacing:'.04em'}}>
            {t}
          </div>
        ))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.65rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.05)'}}>
        <input placeholder="search collections..." style={{fontFamily:'DM Mono,monospace',fontSize:'11px',background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.09)',color:'#ededf0',padding:'.32rem .75rem',borderRadius:'5px',outline:'none',width:'170px'}} />
        <div style={{width:'.5px',height:'16px',background:'rgba(255,255,255,.07)',margin:'0 .25rem'}} />
        {['10m','1h','6h','1d','7d','30d'].map((t,i) => (
          <button key={t} style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:i===0?'#7c6ff7':'rgba(255,255,255,.32)',background:i===0?'rgba(124,111,247,.07)':'rgba(255,255,255,.03)',border:`.5px solid ${i===0?'rgba(124,111,247,.3)':'rgba(255,255,255,.07)'}`,padding:'.28rem .65rem',borderRadius:'4px',cursor:'pointer'}}>
            {t}
          </button>
        ))}
        <div style={{marginLeft:'auto',display:'flex',gap:'.4rem'}}>
          {['all','live','art','pfp','generative'].map((t,i) => (
            <button key={t} style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:i===0?'#7c6ff7':'rgba(255,255,255,.32)',background:i===0?'rgba(124,111,247,.07)':'rgba(255,255,255,.03)',border:`.5px solid ${i===0?'rgba(124,111,247,.3)':'rgba(255,255,255,.07)'}`,padding:'.28rem .65rem',borderRadius:'4px',cursor:'pointer'}}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2.2rem 1fr 100px 100px 78px 96px 68px',padding:'.45rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
        {['#','collection','floor','top offer','1h %','volume','listed'].map((h,i) => (
          <div key={h} style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.2)',letterSpacing:'.07em',textAlign:i===1?'left':'right'}}>
            {h}
          </div>
        ))}
      </div>
      {collections.map((c,i) => (
        <Link key={i} href={`/collection/${c.slug}`} style={{textDecoration:'none',color:'inherit',display:'block'}}>
          <div style={{display:'grid',gridTemplateColumns:'2.2rem 1fr 100px 100px 78px 96px 68px',padding:'.55rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.035)',alignItems:'center',cursor:'pointer'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.18)'}}>{c.rank}</div>
            <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
              <div style={{width:'34px',height:'34px',borderRadius:'7px',background:colors[i],flexShrink:0,position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 40% 40%, ${accents[i]}88, transparent 70%)`}} />
              </div>
              <div>
                <div style={{fontSize:'13px',fontWeight:600,color:'#ededf0'}}>{c.name}</div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',marginTop:'.1rem'}}>{c.type}</div>
              </div>
            </div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#ededf0',textAlign:'right'}}>{c.floor} <span style={{fontSize:'9px',color:'rgba(124,111,247,.5)'}}>RITUAL</span></div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.4)',textAlign:'right'}}>{c.offer}</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',textAlign:'right',color:c.chg>0?'#4ade80':c.chg<0?'#f87171':'rgba(255,255,255,.3)'}}>
              {c.chg===0?'—':(c.chg>0?'+':'')+c.chg.toFixed(1)+'%'}
            </div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#ededf0',textAlign:'right'}}>{c.vol.toFixed(1)}</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)',textAlign:'right'}}>{c.listed||'—'}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
