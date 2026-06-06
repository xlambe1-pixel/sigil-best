'use client'
import { useState } from 'react'

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [type, setType] = useState<'bug'|'idea'|'other'>('idea')

  const handleSend = async () => {
    if (!feedback.trim()) return
    setSending(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message: feedback }),
      })
      setSent(true)
      setTimeout(() => { setSent(false); setFeedback(''); setOpen(false) }, 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{position:'fixed',bottom:'1.5rem',right:'1.5rem',zIndex:50,background:'#7c6ff7',border:'none',color:'#080809',fontFamily:'DM Mono,monospace',fontSize:'11px',fontWeight:700,padding:'.55rem 1rem',borderRadius:'20px',cursor:'pointer',letterSpacing:'.04em',boxShadow:'0 4px 20px rgba(124,111,247,.4)',display:'flex',alignItems:'center',gap:'.4rem'}}
      >
        ◈ feedback
      </button>

      {open && (
        <div style={{position:'fixed',bottom:'4.5rem',right:'1.5rem',zIndex:50,background:'#0f0f14',border:'.5px solid rgba(255,255,255,.1)',borderRadius:'14px',padding:'1.25rem',width:'300px',boxShadow:'0 8px 32px rgba(0,0,0,.6)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.28)',letterSpacing:'.1em'}}>// feedback</div>
            <button onClick={() => setOpen(false)} style={{background:'transparent',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:'16px'}}>✕</button>
          </div>

          <div style={{display:'flex',gap:'.4rem',marginBottom:'1rem'}}>
            {(['idea','bug','other'] as const).map(t => (
              <button key={t} onClick={() => setType(t)} style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:type===t?'#080809':'rgba(255,255,255,.35)',background:type===t?'#7c6ff7':'rgba(255,255,255,.04)',border:`.5px solid ${type===t?'#7c6ff7':'rgba(255,255,255,.1)'}`,padding:'.28rem .65rem',borderRadius:'4px',cursor:'pointer'}}>
                {t==='idea'?'💡 idea':t==='bug'?'🐛 bug':'💬 other'}
              </button>
            ))}
          </div>

          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="what's on your mind?"
            rows={4}
            style={{width:'100%',fontFamily:'DM Mono,monospace',fontSize:'11px',background:'#080809',border:`.5px solid ${feedback?'rgba(124,111,247,.4)':'rgba(255,255,255,.1)'}`,color:'#ededf0',padding:'.65rem .85rem',borderRadius:'7px',outline:'none',resize:'none',marginBottom:'1rem'}}
          />

          {sent ? (
            <div style={{textAlign:'center',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#4ade80',padding:'.5rem'}}>
              ✓ thanks for your feedback!
            </div>
          ) : (
            <button
              onClick={handleSend}
              disabled={!feedback.trim() || sending}
              style={{width:'100%',background:feedback.trim()&&!sending?'#7c6ff7':'rgba(255,255,255,.06)',border:'none',color:feedback.trim()&&!sending?'#080809':'rgba(255,255,255,.25)',fontFamily:'DM Mono,monospace',fontSize:'12px',fontWeight:700,padding:'.6rem',borderRadius:'7px',cursor:feedback.trim()&&!sending?'pointer':'not-allowed',letterSpacing:'.04em'}}
            >
              {sending ? 'sending...' : 'send feedback →'}
            </button>
          )}
        </div>
      )}
    </>
  )
}