export default function AboutPage() {
  return (
    <div style={{maxWidth:'800px',margin:'0 auto',padding:'2.5rem 1.75rem'}}>

      <div style={{marginBottom:'3rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'.75rem'}}>// about</div>
        <h1 style={{fontSize:'36px',fontWeight:800,letterSpacing:'-.02em',marginBottom:'1rem'}}>
          Sigil<span style={{color:'#7c6ff7'}}>.</span>
        </h1>
        <p style={{fontFamily:'DM Mono,monospace',fontSize:'13px',color:'rgba(255,255,255,.45)',lineHeight:2,maxWidth:'600px'}}>
          The first NFT launchpad and marketplace built natively on Ritual Chain. Launch, mint, and trade NFTs on the most advanced AI-native blockchain.
        </p>
      </div>

      {/* What is Sigil */}
      <div style={{marginBottom:'2.5rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#7c6ff7',letterSpacing:'.1em',marginBottom:'.75rem'}}>// what is sigil</div>
        <h2 style={{fontSize:'20px',fontWeight:700,marginBottom:'1rem'}}>A marketplace built for Ritual</h2>
        <p style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.4)',lineHeight:2,marginBottom:'1rem'}}>
          Sigil is an NFT launchpad and secondary marketplace built exclusively for the Ritual Chain ecosystem. We believe the future of digital ownership lives on AI-native blockchains — and Ritual is leading that charge.
        </p>
        <p style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.4)',lineHeight:2}}>
          Our platform makes it easy for creators to launch NFT collections and for collectors to discover, mint, and trade unique digital assets — all without leaving the Ritual ecosystem.
        </p>
      </div>

      {/* Features */}
      <div style={{marginBottom:'2.5rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#7c6ff7',letterSpacing:'.1em',marginBottom:'.75rem'}}>// features</div>
        <h2 style={{fontSize:'20px',fontWeight:700,marginBottom:'1.25rem'}}>Everything you need</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          {[
            {icon:'◈', title:'launchpad', desc:'Deploy ERC-721 contracts in minutes. No code required. Set your supply, price, and whitelist.'},
            {icon:'⬡', title:'marketplace', desc:'Browse and mint from live collections. Secondary trading coming soon with on-chain escrow.'},
            {icon:'◉', title:'creator dashboard', desc:'Track your launches, manage collections, and monitor performance from one place.'},
            {icon:'⬟', title:'collector tools', desc:'View your NFT portfolio, track floor prices, and explore new collections.'},
            {icon:'◎', title:'on-chain everything', desc:'Smart contracts deployed directly on Ritual testnet. No off-chain metadata for minting.'},
            {icon:'⬢', title:'ritual native', desc:'Built exclusively for Ritual Chain. First to market on the most exciting new blockchain.'},
          ].map(f => (
            <div key={f.title} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'10px',padding:'1rem'}}>
              <div style={{fontSize:'18px',color:'#7c6ff7',marginBottom:'.5rem',opacity:.7}}>{f.icon}</div>
              <div style={{fontSize:'13px',fontWeight:600,marginBottom:'.35rem'}}>{f.title}</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)',lineHeight:1.8}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Ritual */}
      <div style={{marginBottom:'2.5rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#7c6ff7',letterSpacing:'.1em',marginBottom:'.75rem'}}>// why ritual chain</div>
        <h2 style={{fontSize:'20px',fontWeight:700,marginBottom:'1rem'}}>The AI-native blockchain</h2>
        <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'}}>
          <p style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.4)',lineHeight:2,marginBottom:'1rem'}}>
            Ritual Chain is a Layer 1 blockchain designed from the ground up for AI-native applications. With Infernet nodes embedded directly in the protocol, Ritual enables on-chain AI inference — something no other blockchain offers.
          </p>
          <p style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.4)',lineHeight:2}}>
            For NFTs, this means generative art that uses real on-chain AI, dynamic metadata that evolves based on network activity, and smart contracts that can reason about their own state.
          </p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px'}}>
          {[
            {label:'chain id', val:'1979'},
            {label:'consensus', val:'proof of stake'},
            {label:'ai layer', val:'infernet nodes'},
            {label:'evm compatible', val:'yes'},
            {label:'status', val:'testnet'},
            {label:'mainnet', val:'coming soon'},
          ].map(s => (
            <div key={s.label} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'8px',padding:'.65rem .85rem'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.2rem'}}>{s.label}</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#ededf0'}}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div style={{marginBottom:'2.5rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#7c6ff7',letterSpacing:'.1em',marginBottom:'.75rem'}}>// roadmap</div>
        <h2 style={{fontSize:'20px',fontWeight:700,marginBottom:'1.25rem'}}>What's coming</h2>
        <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
          {[
            {phase:'phase 1', title:'testnet launch', desc:'Launchpad, mint, basic marketplace. Live now.', status:'live'},
            {phase:'phase 2', title:'secondary trading', desc:'On-chain buy/sell with escrow contracts.', status:'building'},
            {phase:'phase 3', title:'ipfs artwork', desc:'Full artwork upload and IPFS storage integration.', status:'planned'},
            {phase:'phase 4', title:'mainnet', desc:'Full launch on Ritual mainnet when available.', status:'planned'},
            {phase:'phase 5', title:'ai features', desc:'On-chain AI-generated art using Ritual Infernet nodes.', status:'future'},
          ].map(r => (
            <div key={r.phase} style={{display:'flex',alignItems:'center',gap:'1rem',background:'#0f0f14',border:`.5px solid ${r.status==='live'?'rgba(74,222,128,.2)':r.status==='building'?'rgba(124,111,247,.2)':'rgba(255,255,255,.07)'}`,borderRadius:'8px',padding:'.85rem 1rem'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.06em',minWidth:'60px'}}>{r.phase}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:'13px',fontWeight:600,marginBottom:'.15rem'}}>{r.title}</div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.35)'}}>{r.desc}</div>
              </div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',padding:'.2rem .55rem',borderRadius:'10px',letterSpacing:'.06em',color:r.status==='live'?'#4ade80':r.status==='building'?'#7c6ff7':'rgba(255,255,255,.3)',background:r.status==='live'?'rgba(74,222,128,.1)':r.status==='building'?'rgba(124,111,247,.1)':'rgba(255,255,255,.05)',border:`.5px solid ${r.status==='live'?'rgba(74,222,128,.2)':r.status==='building'?'rgba(124,111,247,.2)':'rgba(255,255,255,.08)'}`}}>
                {r.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div style={{background:'rgba(124,111,247,.06)',border:'.5px solid rgba(124,111,247,.2)',borderRadius:'12px',padding:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:'14px',fontWeight:700,marginBottom:'.35rem'}}>ready to explore? 🔮</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)'}}>sigil.best · ritual testnet · chain id 1979</div>
        </div>
        <div style={{display:'flex',gap:'.75rem'}}>
          <a href="/" style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'#080809',background:'#7c6ff7',border:'none',padding:'.6rem 1.25rem',borderRadius:'6px',cursor:'pointer',textDecoration:'none',letterSpacing:'.04em'}}>explore →</a>
          <a href="/faucet" style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.4)',background:'transparent',border:'.5px solid rgba(255,255,255,.12)',padding:'.6rem 1.25rem',borderRadius:'6px',cursor:'pointer',textDecoration:'none',letterSpacing:'.04em'}}>get tokens</a>
        </div>
      </div>

    </div>
  )
}
