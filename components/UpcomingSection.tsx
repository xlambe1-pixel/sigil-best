'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

function Countdown({ mintDate }: { mintDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = new Date(mintDate).getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [mintDate])

  return (
    <div style={{display:'flex',gap:'8px',justifyContent:'center'}}>
      {[['days',timeLeft.days],['hrs',timeLeft.hours],['min',timeLeft.minutes],['sec',timeLeft.seconds]].map(([label,val]) => (
        <div key={label as string} style={{background:'rgba(124,111,247,.1)',border:'.5px solid rgba(124,111,247,.2)',borderRadius:'8px',padding:'.5rem .75rem',minWidth:'52px',textAlign:'center'}}>
          <div style={{fontSize:'20px',fontWeight:800,color:'#ededf0',lineHeight:1,fontFamily:'DM Mono,monospace'}}>{String(val).padStart(2,'0')}</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.3)',marginTop:'.2rem',letterSpacing:'.06em'}}>{label}</div>
        </div>
      ))}
    </div>
  )
}

function WhitelistChecker({ contractAddress }: { contractAddress: string }) {
  const [address, setAddress] = useState('')
  const [result, setResult] = useState<boolean|null>(null)
  const [checking, setChecking] = useState(false)

  const check = async () => {
    if (!address.startsWith('0x') || address.length !== 42) return
    setChecking(true)
    try {
      const response = await fetch('https://rpc.ritualfoundation.org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [{
            to: contractAddress,
            data: '0xe7f43c68' + address.slice(2).padStart(64, '0'),
          }, 'latest'],
          id: 1,
        }),
      })
      const data = await response.json()
      const isWhitelisted = data.result === '0x0000000000000000000000000000000000000000000000000000000000000001'
      setResult(isWhitelisted)
    } catch (e) {
      setResult(false)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div style={{marginTop:'.75rem'}}>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.4rem'}}>check whitelist</div>
      <div style={{display:'flex',gap:'.5rem'}}>
        <input
          value={address}
          onChange={e=>{setAddress(e.target.value);setResult(null)}}
          placeholder="0x..."
          style={{flex:1,fontFamily:'DM Mono,monospace',fontSize:'11px',background:'#080809',border:`.5px solid ${address?'rgba(124,111,247,.4)':'rgba(255,255,255,.1)'}`,color:'#ededf0',padding:'.45rem .75rem',borderRadius:'6px',outline:'none'}}
        />
        <button onClick={check} disabled={checking} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#080809',background:'#7c6ff7',border:'none',padding:'.45rem .85rem',borderRadius:'6px',cursor:'pointer',whiteSpace:'nowrap'}}>
          {checking ? '...' : 'check'}
        </button>
      </div>
      {result !== null && (
        <div style={{marginTop:'.5rem',fontFamily:'DM Mono,monospace',fontSize:'11px',color:result?'#4ade80':'#f87171',background:result?'rgba(74,222,128,.08)':'rgba(248,113,113,.08)',border:`.5px solid ${result?'rgba(74,222,128,.2)':'rgba(248,113,113,.2)'}`,padding:'.45rem .75rem',borderRadius:'6px'}}>
          {result ? '✓ you are whitelisted!' : '✗ not whitelisted'}
        </div>
      )}
    </div>
  )
}

export default function UpcomingSection() {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpcoming = async () => {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .eq('status', 'upcoming')
        .order('mint_date', { ascending: true })
      setCollections(data || [])
      setLoading(false)
    }
    fetchUpcoming()
  }, [])

  if (loading || collections.length === 0) return null

  return (
    <div style={{maxWidth:'1100px',margin:'0 auto',padding:'1rem 1.75rem',borderBottom:'.5px solid rgba(255,255,255,.06)'}}>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'1rem'}}>// upcoming mints</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:'10px'}}>
        {collections.map((c) => (
          <a key={c.id} href={`/collection/${c.slug || c.tx_hash || c.id}`} style={{textDecoration:'none',color:'inherit',display:'block',background:'#0f0f14',border:'.5px solid rgba(124,111,247,.15)',borderRadius:'12px',overflow:'hidden'}}>
            <div style={{height:'140px',position:'relative',overflow:'hidden',background:'#0c0818'}}>
              {c.artwork_url ? (
                <img src={c.artwork_url} alt={c.name} style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.8}} />
              ) : (
                <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 35% 40%, #5b21b688, transparent 65%)'}} />
              )}
              <div style={{position:'absolute',top:'10px',right:'10px',fontFamily:'DM Mono,monospace',fontSize:'9px',color:'#7c6ff7',background:'rgba(124,111,247,.15)',border:'.5px solid rgba(124,111,247,.3)',padding:'.2rem .55rem',borderRadius:'8px'}}>
                upcoming
              </div>
            </div>
            <div style={{padding:'1rem'}}>
              <div style={{fontSize:'14px',fontWeight:700,marginBottom:'.25rem'}}>{c.name}</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.3)',marginBottom:'.75rem'}}>
                {c.supply?.toLocaleString()} items · {c.price} RITUAL
              </div>
              {c.mint_date && (
                <div style={{marginBottom:'.75rem'}}>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',letterSpacing:'.08em',marginBottom:'.4rem',textAlign:'center'}}>mint starts in</div>
                  <Countdown mintDate={c.mint_date} />
                </div>
              )}
              {c.contract_address && c.contract_address !== '0x0000000000000000000000000000000000000000' && (
                <WhitelistChecker contractAddress={c.contract_address} />
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}