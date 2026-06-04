const traits = [
  {type:'background', val:'Void Black', rarity:'12.4%'},
  {type:'aura', val:'Spectral Blue', rarity:'8.1%'},
  {type:'form', val:'Fractal Ring', rarity:'5.3%'},
  {type:'glyph', val:'Sigma', rarity:'3.7%'},
  {type:'border', val:'None', rarity:'41.2%'},
  {type:'rarity', val:'Rare', rarity:'top 15%'},
]

const activity = [
  {type:'mint', name:'Minted #0438', user:'@cryptovoid', price:'0.05', time:'2m ago'},
  {type:'mint', name:'Minted #0437', user:'@ritualist', price:'0.05', time:'5m ago'},
  {type:'sale', name:'Sold #0301', user:'@void.eth → @ritualist', price:'0.18', time:'12m ago'},
  {type:'list', name:'Listed #0219', user:'@hexmkr', price:'0.14', time:'18m ago'},
  {type:'mint', name:'Minted #0436', user:'@glyph99', price:'0.05', time:'24m ago'},
]

const typeColor: Record<string,string> = {
  mint: 'rgba(74,222,128,.1)',
  sale: 'rgba(251,191,36,.1)',
  list: 'rgba(124,111,247,.1)',
}
const typeText: Record<string,string> = {
  mint: '#4ade80',
  sale: '#fbbf24',
  list: '#7c6ff7',
}
const typeSymbol: Record<string,string> = {
  mint: '+',
  sale: '⇄',
  list: '◈',
}

export default function MintPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.65rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.05)',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.25)'}}>
        <a href="/" style={{color:'rgba(255,255,255,.25)',textDecoration:'none',cursor:'pointer'}}>explore</a>
        <span>›</span>
        <a href="/" style={{color:'rgba(255,255,255,.25)',textDecoration:'none',cursor:'pointer'}}>launchpad</a>
        <span>›</span>
        <span style={{color:'rgba(255,255,255,.5)'}}>Ethereal Voids</span>
      </div>

      {/* Main grid */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',minHeight:'600px'}}>

        {/* LEFT */}
        <div style={{padding:'2rem 1.75rem',borderRight:'.5px solid rgba(255,255,255,.06)'}}>

          {/* Art preview */}
          <div style={{background:'#0c0818',borderRadius:'12px',overflow:'hidden',marginBottom:'1.5rem',position:'relative',height:'340px'}}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 30% 40%, #5b21b688, transparent 65%)'}} />
            <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 70% 70%, #1e3a5f55, transparent 60%)'}} />
            <div style={{position:'absolute',bottom:'1rem',right:'1rem',display:'flex',gap:'.4rem'}}>
              <button style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.6)',background:'rgba(8,8,9,.7)',border:'.5px solid rgba(255,255,255,.12)',padding:'.28rem .6rem',borderRadius:'4px',cursor:'pointer'}}>
                ↺ shuffle
              </button>
              <button style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.6)',background:'rgba(8,8,9,.7)',border:'.5px solid rgba(255,255,255,.12)',padding:'.28rem .6rem',borderRadius:'4px',cursor:'pointer'}}>
                ↗ full
              </button>
            </div>
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.08)',letterSpacing:'.2em'}}>
              #0441
            </div>
          </div>

          {/* Collection info */}
          <div style={{marginBottom:'1.5rem'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#7c6ff7',letterSpacing:'.08em',marginBottom:'.4rem',display:'flex',alignItems:'center',gap:'.4rem'}}>
              ✓ verified collection · ritual testnet
            </div>
            <div style={{fontSize:'26px',fontWeight:800,letterSpacing:'-.02em',marginBottom:'.35rem'}}>Ethereal Voids</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)',display:'flex',alignItems:'center',gap:'.5rem'}}>
              <div style={{width:'18px',height:'18px',borderRadius:'50%',background:'rgba(124,111,247,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:'#7c6ff7',fontWeight:700}}>EV</div>
              by @etherealxyz ·
              <span style={{color:'#7c6ff7',cursor:'pointer'}}>view profile</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'1.5rem'}}>
            {[
              {label:'supply', val:'777', sub:'total items'},
              {label:'minted', val:'612', sub:'79% complete'},
              {label:'floor', val:'0.12', sub:'RITUAL'},
              {label:'volume', val:'38.4', sub:'RITUAL total'},
            ].map(s => (
              <div key={s.label} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'8px',padding:'.75rem .85rem'}}>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.22)',letterSpacing:'.08em',marginBottom:'.3rem'}}>{s.label}</div>
                <div style={{fontSize:'16px',fontWeight:700,lineHeight:1}}>{s.val}</div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',marginTop:'.15rem'}}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{marginBottom:'1.5rem'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em',marginBottom:'.6rem'}}>// about</div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,.45)',lineHeight:1.9,fontWeight:300}}>
              777 unique voids, each one a window into a different layer of the Ritual network. Generated on-chain using Infernet nodes — no two are alike, no metadata stored off-chain. Pure on-chain art.
            </div>
          </div>

          {/* Traits */}
          <div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em',marginBottom:'.75rem'}}>// traits (sample #0441)</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px'}}>
              {traits.map(t => (
                <div key={t.type} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'7px',padding:'.6rem .75rem',cursor:'pointer'}}>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'#7c6ff7',letterSpacing:'.08em',marginBottom:'.2rem'}}>{t.type}</div>
                  <div style={{fontSize:'12px',fontWeight:600,marginBottom:'.15rem'}}>{t.val}</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)'}}>{t.rarity} have this</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{padding:'2rem 1.5rem'}}>

          {/* Mint card */}
          <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.1)',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.1rem'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em'}}>mint now</div>
              <div style={{display:'flex',alignItems:'center',gap:'.35rem',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#4ade80',background:'rgba(74,222,128,.08)',border:'.5px solid rgba(74,222,128,.18)',padding:'.22rem .6rem',borderRadius:'10px'}}>
                <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'#4ade80',display:'inline-block'}} />
                live
              </div>
            </div>

            {/* Price */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
              <div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.25rem'}}>price per nft</div>
                <div style={{fontSize:'24px',fontWeight:800}}>0.05<span style={{fontSize:'13px',fontWeight:400,color:'rgba(124,111,247,.7)',marginLeft:'.3rem'}}>RITUAL</span></div>
              </div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.22)'}}>≈ $1.80 USD</div>
            </div>

            {/* Progress */}
            <div style={{marginBottom:'1rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.28)',marginBottom:'.5rem',letterSpacing:'.04em'}}>
                <span>minted</span><span>612 / 777</span>
              </div>
              <div style={{background:'rgba(255,255,255,.05)',borderRadius:'3px',height:'5px',overflow:'hidden'}}>
                <div style={{height:'100%',borderRadius:'3px',background:'#7c6ff7',width:'79%'}} />
              </div>
            </div>

            {/* Whitelist */}
            <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'1rem',padding:'.65rem .8rem',background:'rgba(124,111,247,.06)',border:'.5px solid rgba(124,111,247,.15)',borderRadius:'7px'}}>
              <span style={{fontSize:'13px'}}>✓</span>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(124,111,247,.8)'}}>whitelist phase active</div>
              <div style={{marginLeft:'auto',fontFamily:'DM Mono,monospace',fontSize:'9px',color:'#7c6ff7',background:'rgba(124,111,247,.12)',border:'.5px solid rgba(124,111,247,.25)',padding:'.18rem .5rem',borderRadius:'8px'}}>eligible</div>
            </div>

            {/* Quantity */}
            <div style={{marginBottom:'1rem'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.5rem'}}>quantity</div>
              <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                <button style={{width:'32px',height:'32px',borderRadius:'6px',border:'.5px solid rgba(255,255,255,.12)',background:'transparent',color:'#ededf0',fontSize:'16px',cursor:'pointer',fontFamily:'DM Mono,monospace'}}>−</button>
                <div style={{fontSize:'18px',fontWeight:700,minWidth:'24px',textAlign:'center',fontFamily:'DM Mono,monospace'}}>1</div>
                <button style={{width:'32px',height:'32px',borderRadius:'6px',border:'.5px solid rgba(255,255,255,.12)',background:'transparent',color:'#ededf0',fontSize:'16px',cursor:'pointer',fontFamily:'DM Mono,monospace'}}>+</button>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.22)',marginLeft:'auto'}}>max 5</div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)'}}>= 0.05 RITUAL</div>
              </div>
            </div>

            {/* Mint button */}
            <button style={{width:'100%',background:'#7c6ff7',border:'none',color:'#080809',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'14px',padding:'.75rem',borderRadius:'8px',cursor:'pointer',letterSpacing:'.04em',marginBottom:'.65rem'}}>
              mint now
            </button>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.2)',textAlign:'center',letterSpacing:'.03em',lineHeight:1.7}}>
              gas fees estimated ~0.001 RITUAL · ritual testnet
            </div>
          </div>

          {/* Activity */}
          <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'10px',overflow:'hidden'}}>
            <div style={{padding:'.75rem 1rem',borderBottom:'.5px solid rgba(255,255,255,.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.28)',letterSpacing:'.1em'}}>recent activity</div>
              <span style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(124,111,247,.55)',cursor:'pointer'}}>all →</span>
            </div>
            {activity.map((a,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'.7rem',padding:'.55rem 1rem',borderBottom:i<activity.length-1?'.5px solid rgba(255,255,255,.04)':'none'}}>
                <div style={{width:'26px',height:'26px',borderRadius:'5px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',flexShrink:0,background:typeColor[a.type],color:typeText[a.type]}}>
                  {typeSymbol[a.type]}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:'12px',fontWeight:600}}>{a.name}</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',marginTop:'.1rem'}}>{a.user}</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px'}}>{a.price} RITUAL</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.2)',marginTop:'.1rem'}}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
