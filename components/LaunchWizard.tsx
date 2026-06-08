'use client'
import { useState } from 'react'
import { useAccount, useConnect, useDeployContract, usePublicClient } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { parseEther } from 'viem'
import { supabase } from '@/lib/supabase'
import ArtworkUpload from './ArtworkUpload'

const ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_symbol', type: 'string' },
      { name: '_mintPrice', type: 'uint256' },
      { name: '_maxSupply', type: 'uint256' },
      { name: '_maxPerWallet', type: 'uint256' },
      { name: '_baseTokenURI', type: 'string' },
    ],
  },
] as const

const steps = ['collection info', 'artwork', 'mint config', 'review & deploy']

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function LaunchWizard() {
  const [step, setStep] = useState(0)
  const [deploying, setDeploying] = useState(false)
  const [deployed, setDeployed] = useState('')
  const [contractAddress, setContractAddress] = useState('')
  const [artworkUrl, setArtworkUrl] = useState('')
  const [artworkHash, setArtworkHash] = useState('')
  const [form, setForm] = useState({
    name: '', symbol: '', description: '', website: '', twitter: '', discord: '',
    supply: '', price: '', maxPerWallet: '', mintDate: '', whitelist: false, type: 'generative',
  })

  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { deployContract } = useDeployContract()
  const publicClient = usePublicClient()

  const update = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleDeploy = async () => {
    if (!isConnected) { connect({ connector: injected() }); return }
    setDeploying(true)
    try {
      const res = await fetch('/api/bytecode')
      const { bytecode } = await res.json()
      const baseURI = artworkHash ? `ipfs://${artworkHash}/` : 'ipfs://placeholder/'
      deployContract({
        abi: ABI,
        bytecode: bytecode as `0x${string}`,
        args: [
          form.name,
          form.symbol,
          parseEther(form.price || '0.05'),
          BigInt(form.supply || '100'),
          BigInt(form.maxPerWallet || '5'),
          baseURI,
        ],
      }, {
        onSuccess: async (hash) => {
          try {
            const receipt = await publicClient!.waitForTransactionReceipt({ hash })
            const contractAddr = receipt.contractAddress || ''
            const slug = generateSlug(form.name)
            await supabase.from('collections').insert({
              name: form.name,
              symbol: form.symbol,
              description: form.description,
              creator_address: address,
              supply: parseInt(form.supply),
              price: form.price,
              max_per_wallet: parseInt(form.maxPerWallet) || 5,
              whitelist: form.whitelist,
              type: form.type,
              tx_hash: hash,
              slug: slug,
              contract_address: contractAddr,
              artwork_url: artworkUrl,
              artwork_hash: artworkHash,
              status: 'live',
            })
            setContractAddress(contractAddr)
            setDeployed(hash)
          } catch (e) {
            console.error(e)
          } finally {
            setDeploying(false)
          }
        },
        onError: (e) => {
          console.error(e)
          setDeploying(false)
        }
      })
    } catch (e) {
      console.error(e)
      setDeploying(false)
    }
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.75rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.25)', letterSpacing: '.12em', marginBottom: '.75rem' }}>// launchpad</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-.02em', marginBottom: '.5rem' }}>launch your collection</h1>
        <p style={{ fontFamily: 'DM Mono,monospace', fontSize: '12px', color: 'rgba(255,255,255,.35)', lineHeight: 1.8 }}>deploy your nft collection on ritual chain testnet in minutes.</p>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: '2.5rem', borderBottom: '.5px solid rgba(255,255,255,.06)' }}>
        {steps.map((s, i) => (
          <div key={s} onClick={() => i < step + 1 && setStep(i)} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.6rem 1.1rem', borderBottom: i === step ? '1.5px solid #7c6ff7' : '1.5px solid transparent', cursor: i <= step ? 'pointer' : 'default', opacity: i > step ? 0.35 : 1 }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: i < step ? '#7c6ff7' : i === step ? 'rgba(124,111,247,.2)' : 'rgba(255,255,255,.06)', border: `.5px solid ${i <= step ? '#7c6ff7' : 'rgba(255,255,255,.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontFamily: 'DM Mono,monospace', color: i < step ? '#080809' : '#7c6ff7', flexShrink: 0 }}>
              {i < step ? '✓' : i + 1}
            </div>
            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '11px', color: i === step ? '#ededf0' : 'rgba(255,255,255,.35)', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>{s}</div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', display: 'block', marginBottom: '.4rem' }}>collection name *</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Ethereal Voids" style={{ width: '100%', fontFamily: 'DM Mono,monospace', fontSize: '12px', background: '#0f0f14', border: `.5px solid ${form.name ? 'rgba(124,111,247,.4)' : 'rgba(255,255,255,.1)'}`, color: '#ededf0', padding: '.65rem .85rem', borderRadius: '7px', outline: 'none' }} />
              {form.name && <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',marginTop:'.3rem'}}>slug: sigil.best/collection/{generateSlug(form.name)}</div>}
            </div>
            <div>
              <label style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', display: 'block', marginBottom: '.4rem' }}>symbol *</label>
              <input value={form.symbol} onChange={e => update('symbol', e.target.value.toUpperCase())} placeholder="e.g. EVOID" style={{ width: '100%', fontFamily: 'DM Mono,monospace', fontSize: '12px', background: '#0f0f14', border: `.5px solid ${form.symbol ? 'rgba(124,111,247,.4)' : 'rgba(255,255,255,.1)'}`, color: '#ededf0', padding: '.65rem .85rem', borderRadius: '7px', outline: 'none' }} />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', display: 'block', marginBottom: '.4rem' }}>description *</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="describe your collection..." rows={4} style={{ width: '100%', fontFamily: 'DM Mono,monospace', fontSize: '12px', background: '#0f0f14', border: `.5px solid ${form.description ? 'rgba(124,111,247,.4)' : 'rgba(255,255,255,.1)'}`, color: '#ededf0', padding: '.65rem .85rem', borderRadius: '7px', outline: 'none', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', display: 'block', marginBottom: '.4rem' }}>type</label>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              {['generative', 'pfp', 'art'].map(t => (
                <button key={t} onClick={() => update('type', t)} style={{ fontFamily: 'DM Mono,monospace', fontSize: '11px', color: form.type === t ? '#080809' : 'rgba(255,255,255,.35)', background: form.type === t ? '#7c6ff7' : 'rgba(255,255,255,.04)', border: `.5px solid ${form.type === t ? '#7c6ff7' : 'rgba(255,255,255,.1)'}`, padding: '.4rem .9rem', borderRadius: '5px', cursor: 'pointer' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {[['website', 'https://yoursite.com'], ['twitter', '@yourhandle'], ['discord', 'discord.gg/...']].map(([k, ph]) => (
              <div key={k}>
                <label style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', display: 'block', marginBottom: '.4rem' }}>{k}</label>
                <input value={(form as any)[k]} onChange={e => update(k, e.target.value)} placeholder={ph} style={{ width: '100%', fontFamily: 'DM Mono,monospace', fontSize: '11px', background: '#0f0f14', border: '.5px solid rgba(255,255,255,.1)', color: '#ededf0', padding: '.6rem .75rem', borderRadius: '7px', outline: 'none' }} />
              </div>
            ))}
          </div>
          <button onClick={() => form.name && form.symbol && form.description && setStep(1)} style={{ background: form.name && form.symbol && form.description ? '#7c6ff7' : 'rgba(255,255,255,.06)', border: 'none', color: form.name && form.symbol && form.description ? '#080809' : 'rgba(255,255,255,.25)', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '13px', padding: '.7rem 1.75rem', borderRadius: '7px', cursor: form.name && form.symbol && form.description ? 'pointer' : 'not-allowed', letterSpacing: '.04em' }}>
            continue →
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <ArtworkUpload onUpload={(url, hash) => { setArtworkUrl(url); setArtworkHash(hash) }} />
          <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem' }}>
            <button onClick={() => setStep(0)} style={{ background: 'transparent', border: '.5px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.4)', fontFamily: 'DM Mono,monospace', fontSize: '12px', padding: '.7rem 1.25rem', borderRadius: '7px', cursor: 'pointer' }}>← back</button>
            <button onClick={() => setStep(2)} style={{ background: '#7c6ff7', border: 'none', color: '#080809', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '13px', padding: '.7rem 1.75rem', borderRadius: '7px', cursor: 'pointer', letterSpacing: '.04em' }}>
              {artworkUrl ? 'continue →' : 'skip for now →'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', display: 'block', marginBottom: '.4rem' }}>total supply *</label>
              <input value={form.supply} onChange={e => update('supply', e.target.value)} placeholder="e.g. 1000" type="number" style={{ width: '100%', fontFamily: 'DM Mono,monospace', fontSize: '12px', background: '#0f0f14', border: `.5px solid ${form.supply ? 'rgba(124,111,247,.4)' : 'rgba(255,255,255,.1)'}`, color: '#ededf0', padding: '.65rem .85rem', borderRadius: '7px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', display: 'block', marginBottom: '.4rem' }}>mint price (RITUAL) *</label>
              <input value={form.price} onChange={e => update('price', e.target.value)} placeholder="e.g. 0.05" type="number" style={{ width: '100%', fontFamily: 'DM Mono,monospace', fontSize: '12px', background: '#0f0f14', border: `.5px solid ${form.price ? 'rgba(124,111,247,.4)' : 'rgba(255,255,255,.1)'}`, color: '#ededf0', padding: '.65rem .85rem', borderRadius: '7px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', display: 'block', marginBottom: '.4rem' }}>max per wallet</label>
              <input value={form.maxPerWallet} onChange={e => update('maxPerWallet', e.target.value)} placeholder="e.g. 5" type="number" style={{ width: '100%', fontFamily: 'DM Mono,monospace', fontSize: '12px', background: '#0f0f14', border: '.5px solid rgba(255,255,255,.1)', color: '#ededf0', padding: '.65rem .85rem', borderRadius: '7px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', display: 'block', marginBottom: '.4rem' }}>mint date</label>
              <input value={form.mintDate} onChange={e => update('mintDate', e.target.value)} type="datetime-local" style={{ width: '100%', fontFamily: 'DM Mono,monospace', fontSize: '12px', background: '#0f0f14', border: '.5px solid rgba(255,255,255,.1)', color: '#ededf0', padding: '.65rem .85rem', borderRadius: '7px', outline: 'none', colorScheme: 'dark' }} />
            </div>
          </div>
          <div onClick={() => update('whitelist', !form.whitelist)} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.85rem 1rem', background: 'rgba(124,111,247,.05)', border: `.5px solid ${form.whitelist ? 'rgba(124,111,247,.35)' : 'rgba(255,255,255,.08)'}`, borderRadius: '8px', cursor: 'pointer', marginBottom: '2rem' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: form.whitelist ? '#7c6ff7' : 'transparent', border: `.5px solid ${form.whitelist ? '#7c6ff7' : 'rgba(255,255,255,.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#080809', flexShrink: 0 }}>
              {form.whitelist ? '✓' : ''}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '.15rem' }}>enable whitelist phase</div>
              <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.3)' }}>allow only approved wallets to mint first</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '.75rem' }}>
            <button onClick={() => setStep(1)} style={{ background: 'transparent', border: '.5px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.4)', fontFamily: 'DM Mono,monospace', fontSize: '12px', padding: '.7rem 1.25rem', borderRadius: '7px', cursor: 'pointer' }}>← back</button>
            <button onClick={() => form.supply && form.price && setStep(3)} style={{ background: form.supply && form.price ? '#7c6ff7' : 'rgba(255,255,255,.06)', border: 'none', color: form.supply && form.price ? '#080809' : 'rgba(255,255,255,.25)', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '13px', padding: '.7rem 1.75rem', borderRadius: '7px', cursor: form.supply && form.price ? 'pointer' : 'not-allowed', letterSpacing: '.04em' }}>
              continue →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          {!deployed ? (
            <>
              <div style={{ background: '#0f0f14', border: '.5px solid rgba(255,255,255,.07)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.25)', letterSpacing: '.1em', marginBottom: '1rem' }}>// review your collection</div>
                {[
                  { label: 'name', val: form.name },
                  { label: 'slug', val: `sigil.best/collection/${generateSlug(form.name)}` },
                  { label: 'symbol', val: form.symbol },
                  { label: 'type', val: form.type },
                  { label: 'supply', val: form.supply + ' items' },
                  { label: 'mint price', val: form.price + ' RITUAL' },
                  { label: 'max per wallet', val: form.maxPerWallet || 'unlimited' },
                  { label: 'whitelist', val: form.whitelist ? 'enabled' : 'disabled' },
                  { label: 'artwork', val: artworkUrl ? '✓ uploaded to ipfs' : '— no artwork' },
                  { label: 'network', val: 'ritual testnet · chain id 1979' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem 0', borderBottom: '.5px solid rgba(255,255,255,.04)' }}>
                    <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '11px', color: 'rgba(255,255,255,.3)', letterSpacing: '.05em' }}>{r.label}</div>
                    <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '11px', color: r.label==='artwork'&&artworkUrl?'#4ade80':r.label==='slug'?'#7c6ff7':'#ededf0' }}>{r.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(124,111,247,.06)', border: '.5px solid rgba(124,111,247,.2)', borderRadius: '8px', padding: '.85rem 1rem', marginBottom: '1.5rem', fontFamily: 'DM Mono,monospace', fontSize: '11px', color: 'rgba(124,111,247,.8)', lineHeight: 1.8 }}>
                {deploying ? '⏳ waiting for transaction confirmation...' : 'deploying will create a smart contract on ritual testnet. make sure your wallet is connected and has enough RITUAL for gas (~0.01 RITUAL).'}
              </div>
              <div style={{ display: 'flex', gap: '.75rem' }}>
                <button onClick={() => setStep(2)} disabled={deploying} style={{ background: 'transparent', border: '.5px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.4)', fontFamily: 'DM Mono,monospace', fontSize: '12px', padding: '.7rem 1.25rem', borderRadius: '7px', cursor: deploying ? 'not-allowed' : 'pointer' }}>← back</button>
                <button onClick={handleDeploy} disabled={deploying} style={{ background: deploying ? 'rgba(124,111,247,.5)' : '#7c6ff7', border: 'none', color: '#080809', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '13px', padding: '.7rem 2rem', borderRadius: '7px', cursor: deploying ? 'not-allowed' : 'pointer', letterSpacing: '.04em' }}>
                  {deploying ? 'deploying...' : '🔮 deploy collection'}
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🔮</div>
              <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '.5rem' }}>collection deployed!</div>
              <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '12px', color: 'rgba(255,255,255,.35)', marginBottom: '2rem', lineHeight: 1.9 }}>your collection is now live on sigil.best</div>
              {contractAddress && (
                <div style={{ background: '#0f0f14', border: '.5px solid rgba(74,222,128,.2)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1rem', textAlign: 'left' }}>
                  <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.25)', marginBottom: '.4rem' }}>contract address</div>
                  <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '11px', color: '#4ade80', wordBreak: 'break-all' }}>{contractAddress}</div>
                </div>
              )}
              <div style={{ background: '#0f0f14', border: '.5px solid rgba(124,111,247,.2)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,.25)', marginBottom: '.4rem' }}>collection url</div>
                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '11px', color: '#7c6ff7' }}>sigil.best/collection/{generateSlug(form.name)}</div>
              </div>
              <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center' }}>
                <a href={`/collection/${generateSlug(form.name)}`} style={{ fontFamily: 'DM Mono,monospace', fontSize: '12px', color: '#080809', background: '#7c6ff7', border: 'none', padding: '.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer', textDecoration: 'none', letterSpacing: '.04em' }}>view my collection ↗</a>
                <a href={`https://explorer.ritualfoundation.org/tx/${deployed}`} target="_blank" style={{ fontFamily: 'DM Mono,monospace', fontSize: '12px', color: 'rgba(255,255,255,.4)', background: 'transparent', border: '.5px solid rgba(255,255,255,.12)', padding: '.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer', textDecoration: 'none', letterSpacing: '.04em' }}>view on explorer ↗</a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}