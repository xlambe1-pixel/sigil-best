'use client'
import { useState } from 'react'
import { useWriteContract, useReadContract } from 'wagmi'

const ABI = [
  {
    name: 'addToWhitelist',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'addresses', type: 'address[]' }],
    outputs: [],
  },
  {
    name: 'removeFromWhitelist',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'addresses', type: 'address[]' }],
    outputs: [],
  },
  {
    name: 'setWhitelistOnly',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_whitelistOnly', type: 'bool' }],
    outputs: [],
  },
  {
    name: 'whitelistOnly',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'bool' }],
  },
] as const

export default function WhitelistManager({ contractAddress }: { contractAddress: string }) {
  const [addresses, setAddresses] = useState('')
  const [tab, setTab] = useState<'add'|'remove'>('add')
  const [success, setSuccess] = useState('')

  const { writeContract, isPending } = useWriteContract()

  const { data: whitelistOnly, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'whitelistOnly',
    query: { enabled: !!contractAddress },
  })

  const parseAddresses = () => {
    return addresses
      .split(/[\n,]/)
      .map(a => a.trim())
      .filter(a => a.startsWith('0x') && a.length === 42) as `0x${string}`[]
  }

  const handleSubmit = () => {
    const parsed = parseAddresses()
    if (parsed.length === 0) return
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: ABI,
      functionName: tab === 'add' ? 'addToWhitelist' : 'removeFromWhitelist',
      args: [parsed],
    }, {
      onSuccess: () => {
        setSuccess(`${parsed.length} address${parsed.length!==1?'es':''} ${tab==='add'?'added to':'removed from'} whitelist!`)
        setAddresses('')
        setTimeout(() => setSuccess(''), 3000)
      }
    })
  }

  const toggleWhitelistOnly = () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: ABI,
      functionName: 'setWhitelistOnly',
      args: [!whitelistOnly],
    }, {
      onSuccess: () => setTimeout(() => refetch(), 2000)
    })
  }

  return (
    <div style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'12px',padding:'1.25rem',marginTop:'1rem'}}>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.28)',letterSpacing:'.1em',marginBottom:'1rem'}}>// whitelist manager</div>

      <div onClick={toggleWhitelistOnly} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.75rem 1rem',background:'rgba(124,111,247,.05)',border:`.5px solid ${whitelistOnly?'rgba(124,111,247,.3)':'rgba(255,255,255,.08)'}`,borderRadius:'8px',cursor:'pointer',marginBottom:'1rem'}}>
        <div>
          <div style={{fontSize:'13px',fontWeight:600,marginBottom:'.15rem'}}>whitelist only mode</div>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.3)'}}>only whitelisted wallets can mint</div>
        </div>
        <div style={{width:'36px',height:'20px',borderRadius:'10px',background:whitelistOnly?'#7c6ff7':'rgba(255,255,255,.1)',position:'relative',transition:'background .2s',flexShrink:0}}>
          <div style={{width:'16px',height:'16px',borderRadius:'50%',background:'#ededf0',position:'absolute',top:'2px',left:whitelistOnly?'18px':'2px',transition:'left .2s'}} />
        </div>
      </div>

      <div style={{display:'flex',gap:'.5rem',marginBottom:'1rem'}}>
        {(['add','remove'] as const).map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:tab===t?'#080809':'rgba(255,255,255,.35)',background:tab===t?'#7c6ff7':'rgba(255,255,255,.04)',border:`.5px solid ${tab===t?'#7c6ff7':'rgba(255,255,255,.1)'}`,padding:'.38rem .85rem',borderRadius:'5px',cursor:'pointer'}}>
            {t} addresses
          </button>
        ))}
      </div>

      <div style={{marginBottom:'1rem'}}>
        <label style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.35)',letterSpacing:'.08em',display:'block',marginBottom:'.4rem'}}>
          wallet addresses (one per line or comma separated)
        </label>
        <textarea
          value={addresses}
          onChange={e=>setAddresses(e.target.value)}
          placeholder={'0x1234...5678\n0xabcd...ef01'}
          rows={5}
          style={{width:'100%',fontFamily:'DM Mono,monospace',fontSize:'11px',background:'#080809',border:`.5px solid ${addresses?'rgba(124,111,247,.4)':'rgba(255,255,255,.1)'}`,color:'#ededf0',padding:'.65rem .85rem',borderRadius:'7px',outline:'none',resize:'vertical'}}
        />
        <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',marginTop:'.35rem'}}>
          {parseAddresses().length} valid address{parseAddresses().length!==1?'es':''} detected
        </div>
      </div>

      {success && (
        <div style={{background:'rgba(74,222,128,.08)',border:'.5px solid rgba(74,222,128,.2)',borderRadius:'7px',padding:'.65rem .85rem',marginBottom:'1rem',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#4ade80'}}>
          ✓ {success}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isPending||parseAddresses().length===0}
        style={{fontFamily:'DM Mono,monospace',fontSize:'12px',color:'#080809',background:isPending||parseAddresses().length===0?'rgba(124,111,247,.4)':'#7c6ff7',border:'none',padding:'.6rem 1.25rem',borderRadius:'6px',cursor:isPending||parseAddresses().length===0?'not-allowed':'pointer',letterSpacing:'.04em'}}
      >
        {isPending?'confirming...':`${tab} ${parseAddresses().length} address${parseAddresses().length!==1?'es':''}`}
      </button>
    </div>
  )
}