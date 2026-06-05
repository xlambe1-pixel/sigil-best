'use client'
import { useState } from 'react'

const steps = [
  {
    num: '01',
    title: 'install metamask',
    desc: 'Download and install MetaMask from metamask.io. Create a new wallet or import an existing one.',
    link: 'https://metamask.io',
    linkText: 'get metamask →',
    color: '#f6851b',
  },
  {
    num: '02',
    title: 'add ritual testnet',
    desc: 'Add the Ritual testnet network to your MetaMask wallet using the details below.',
    link: null,
    linkText: null,
    color: '#7c6ff7',
  },
  {
    num: '03',
    title: 'get ritual tokens',
    desc: 'Visit the official Ritual faucet and request free testnet RITUAL tokens for your wallet.',
    link: 'https://faucet.ritualfoundation.org',
    linkText: 'open faucet →',
    color: '#4ade80',
  },
  {
    num: '04',
    title: 'start minting',
    desc: 'With RITUAL in your wallet, head to Sigil and start minting or launching NFT collections!',
    link: '/',
    linkText: 'explore sigil →',
    color: '#7c6ff7',
  },
]

const networkDetails = [
  {label:'network name', val:'Ritual Testnet'},
  {label:'rpc url', val:'https://rpc.ritualfoundation.org'},
  {label:'chain id', val:'1979'},
  {label:'currency symbol', val:'RITUAL'},
  {label:'block explorer', val:'https://explorer.ritualfoundation.org'},
]

export default function FaucetPage() {
  const [copied, setCopied] = useState('')

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div style={{maxWidth:'800px',margin:'0 auto',padding:'2.5rem 1.75rem'}}>

      {/* Header */}
      <div style={{marginBottom:'2.5rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'.75rem'}}>// get started</div>
        <h1 style={{fontSize:'28px',fontWeight:800,letterSpacing:'-.02em',marginBottom:'.5rem'}}>get ritual testnet tokens</h1>
        <p style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.35)',lineHeight:1.8}}>
          follow these steps to set up your wallet and start using sigil on ritual testnet.
        </p>
      </div>

      {/* Steps */}
      <div style={{display:'flex',flexDirection:'column',gap:'1rem',marginBottom:'2.5rem'}}>
        {steps.map((s,i) => (
          <div key={i} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',padding:'1.25rem',display:'flex',gap:'1.25rem',alignItems:'flex-start'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'22px',fontWeight:800,color:s.color,opacity:.5,flexShrink:0,lineHeight:1,marginTop:'.1rem'}}>{s.num}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:'15px',fontWeight:700,marginBottom:'.4rem'}}>{s.title}</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.4)',lineHeight:1.8,marginBottom:s.link?'.75rem':'0'}}>{s.desc}</div>
              {s.link && (
                <a href={s.link} target={s.link.startsWith('http')?'_blank':'_self'} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:s.color,textDecoration:'none',letterSpacing:'.04em'}}>
                  {s.linkText}
                </a>
              )}
              {i === 1 && (
                <div style={{background:'#080809',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'8px',overflow:'hidden',marginTop:'.75rem'}}>
                  {networkDetails.map(d => (
                    <div key={d.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.5rem .85rem',borderBottom:'.5px solid rgba(255,255,255,.04)'}}>
                      <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.3)',letterSpacing:'.06em'}}>{d.label}</div>
                      <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                        <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#ededf0'}}>{d.val}</div>
                        <button onClick={()=>copy(d.val, d.label)} style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:copied===d.label?'#4ade80':'rgba(255,255,255,.3)',background:'transparent',border:'.5px solid rgba(255,255,255,.08)',padding:'.15rem .4rem',borderRadius:'3px',cursor:'pointer',letterSpacing:'.04em'}}>
                          {copied===d.label?'copied!':'copy'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',padding:'1.25rem',marginBottom:'1.5rem'}}>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.28)',letterSpacing:'.1em',marginBottom:'1rem'}}>// faq</div>
        {[
          {q:'what is ritual testnet?', a:'Ritual Chain is an AI-native Layer 1 blockchain. The testnet is a test environment where you can experiment without real funds.'},
          {q:'are testnet tokens worth anything?', a:'No — testnet RITUAL tokens have no monetary value. They are only used for testing purposes on the Ritual testnet.'},
          {q:'how much ritual do i need?', a:'Minting an NFT costs ~0.05 RITUAL + ~0.001 RITUAL for gas. Deploying a collection costs ~0.01 RITUAL for gas.'},
          {q:'can i use sigil on mainnet?', a:'Sigil will support Ritual mainnet when it launches. For now, everything is on testnet.'},
        ].map((f,i) => (
          <div key={i} style={{marginBottom:'1rem',paddingBottom:'1rem',borderBottom:i<3?'.5px solid rgba(255,255,255,.05)':'none'}}>
            <div style={{fontSize:'13px',fontWeight:600,marginBottom:'.35rem'}}>{f.q}</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.4)',lineHeight:1.8}}>{f.a}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{background:'rgba(124,111,247,.06)',border:'.5px solid rgba(124,111,247,.2)',borderRadius:'12px',padding:'1.5rem',textAlign:'center'}}>
        <div style={{fontSize:'16px',fontWeight:700,marginBottom:'.5rem'}}>ready to start? 🔮</div>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.35)',marginBottom:'1.25rem',lineHeight:1.8}}>
          once you have ritual tokens, come back and explore sigil.
        </div>
        <div style={{display:'flex',gap:'.75rem',justifyContent:'center'}}>
          <a href="https://faucet.ritualfoundation.org" target="_blank" style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'#080809',background:'#7c6ff7',border:'none',padding:'.6rem 1.25rem',borderRadius:'6px',cursor:'pointer',textDecoration:'none',letterSpacing:'.04em'}}>
            get tokens ↗
          </a>
          <a href="/" style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'rgba(255,255,255,.4)',background:'transparent',border:'.5px solid rgba(255,255,255,.12)',padding:'.6rem 1.25rem',borderRadius:'6px',cursor:'pointer',textDecoration:'none',letterSpacing:'.04em'}}>
            explore sigil
          </a>
        </div>
      </div>

    </div>
  )
}
