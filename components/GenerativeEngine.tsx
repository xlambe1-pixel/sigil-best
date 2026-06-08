'use client'
import { useState, useCallback } from 'react'

interface Layer {
  name: string
  files: File[]
}

interface GenerativeEngineProps {
  onGenerated: (images: File[], metadata: any[]) => void
}

export default function GenerativeEngine({ onGenerated }: GenerativeEngineProps) {
  const [layers, setLayers] = useState<Layer[]>([
    { name: 'Background', files: [] },
    { name: 'Body', files: [] },
    { name: 'Eyes', files: [] },
    { name: 'Hat', files: [] },
  ])
  const [supply, setSupply] = useState(100)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [newLayerName, setNewLayerName] = useState('')

  const addLayer = () => {
    if (!newLayerName.trim()) return
    setLayers(l => [...l, { name: newLayerName, files: [] }])
    setNewLayerName('')
  }

  const removeLayer = (i: number) => {
    setLayers(l => l.filter((_,idx) => idx !== i))
  }

  const handleFiles = (i: number, files: FileList | null) => {
    if (!files) return
    setLayers(l => l.map((layer, idx) =>
      idx === i ? { ...layer, files: Array.from(files) } : layer
    ))
  }

  const totalCombinations = layers.reduce((a, l) => a * (l.files.length || 1), 1)

  const generateCollection = async () => {
    const filledLayers = layers.filter(l => l.files.length > 0)
    if (filledLayers.length === 0) return

    setGenerating(true)
    setProgress(0)

    const canvas = document.createElement('canvas')
    canvas.width = 1000
    canvas.height = 1000
    const ctx = canvas.getContext('2d')!

    const generatedImages: File[] = []
    const generatedMetadata: any[] = []
    const usedCombinations = new Set<string>()

    const count = Math.min(supply, totalCombinations)

    for (let i = 0; i < count; i++) {
      let combination: string
      let selectedFiles: {layer: Layer, file: File}[]

      // Generate unique combination
      do {
        selectedFiles = filledLayers.map(layer => ({
          layer,
          file: layer.files[Math.floor(Math.random() * layer.files.length)]
        }))
        combination = selectedFiles.map(s => s.file.name).join('|')
      } while (usedCombinations.has(combination) && usedCombinations.size < totalCombinations)

      usedCombinations.add(combination)

      // Draw layers on canvas
      ctx.clearRect(0, 0, 1000, 1000)

      for (const { file } of selectedFiles) {
        await new Promise<void>(resolve => {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0, 1000, 1000)
            URL.revokeObjectURL(img.src)
            resolve()
          }
          img.src = URL.createObjectURL(file)
        })
      }

      // Export as PNG
      const blob = await new Promise<Blob>(resolve => canvas.toBlob(b => resolve(b!), 'image/png'))
      generatedImages.push(new File([blob], `${i + 1}.png`, { type: 'image/png' }))

      // Generate metadata
      const attributes = selectedFiles.map(({ layer, file }) => ({
        trait_type: layer.name,
        value: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      }))
      generatedMetadata.push({
        name: `#${String(i + 1).padStart(4, '0')}`,
        description: 'Generated on Sigil',
        image: `ipfs://PLACEHOLDER/${i + 1}.png`,
        attributes,
      })

      setProgress(Math.round(((i + 1) / count) * 100))
    }

    setGenerating(false)
    onGenerated(generatedImages, generatedMetadata)
  }

  return (
    <div>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.12em',marginBottom:'1rem'}}>// generative art engine</div>

      {/* Layers */}
      <div style={{marginBottom:'1.5rem'}}>
        {layers.map((layer, i) => (
          <div key={i} style={{background:'#0f0f14',border:'.5px solid rgba(255,255,255,.07)',borderRadius:'8px',padding:'.85rem 1rem',marginBottom:'.5rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.5rem'}}>
              <div style={{fontSize:'13px',fontWeight:600}}>{layer.name}</div>
              <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                {layer.files.length > 0 && (
                  <span style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'#4ade80'}}>{layer.files.length} traits</span>
                )}
                <button onClick={() => removeLayer(i)} style={{background:'transparent',border:'none',color:'rgba(255,255,255,.3)',cursor:'pointer',fontSize:'14px'}}>✕</button>
              </div>
            </div>
            <label style={{display:'block',background:'rgba(124,111,247,.05)',border:'.5px dashed rgba(124,111,247,.3)',borderRadius:'6px',padding:'.65rem',textAlign:'center',cursor:'pointer',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)'}}>
              <input type="file" accept="image/png" multiple onChange={e => handleFiles(i, e.target.files)} style={{display:'none'}} />
              {layer.files.length > 0 ? `${layer.files.length} PNG files selected` : 'upload PNG files (transparent background)'}
            </label>
          </div>
        ))}

        {/* Add layer */}
        <div style={{display:'flex',gap:'.5rem',marginTop:'.75rem'}}>
          <input
            value={newLayerName}
            onChange={e => setNewLayerName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addLayer()}
            placeholder="new layer name..."
            style={{flex:1,fontFamily:'DM Mono,monospace',fontSize:'11px',background:'#0f0f14',border:'.5px solid rgba(255,255,255,.1)',color:'#ededf0',padding:'.45rem .75rem',borderRadius:'6px',outline:'none'}}
          />
          <button onClick={addLayer} style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#080809',background:'#7c6ff7',border:'none',padding:'.45rem .85rem',borderRadius:'6px',cursor:'pointer'}}>
            + add layer
          </button>
        </div>
      </div>

      {/* Supply + combinations info */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.5rem'}}>
        <div>
          <label style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.35)',display:'block',marginBottom:'.4rem'}}>how many NFTs to generate</label>
          <input
            type="number"
            value={supply}
            onChange={e => setSupply(parseInt(e.target.value) || 100)}
            style={{width:'100%',fontFamily:'DM Mono,monospace',fontSize:'12px',background:'#0f0f14',border:'.5px solid rgba(255,255,255,.1)',color:'#ededf0',padding:'.65rem .85rem',borderRadius:'7px',outline:'none'}}
          />
        </div>
        <div style={{background:'rgba(124,111,247,.05)',border:'.5px solid rgba(124,111,247,.15)',borderRadius:'7px',padding:'.65rem .85rem',display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'rgba(255,255,255,.25)',marginBottom:'.25rem'}}>possible combinations</div>
          <div style={{fontSize:'20px',fontWeight:800,color:'#7c6ff7'}}>{totalCombinations.toLocaleString()}</div>
        </div>
      </div>

      {/* Generate button */}
      {generating ? (
        <div>
          <div style={{display:'flex',justifyContent:'space-between',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)',marginBottom:'.5rem'}}>
            <span>generating...</span>
            <span>{progress}%</span>
          </div>
          <div style={{background:'rgba(255,255,255,.05)',borderRadius:'4px',height:'6px',overflow:'hidden'}}>
            <div style={{height:'100%',background:'#7c6ff7',width:`${progress}%`,transition:'width .3s'}} />
          </div>
        </div>
      ) : (
        <button
          onClick={generateCollection}
          disabled={layers.filter(l => l.files.length > 0).length === 0}
          style={{width:'100%',background:layers.filter(l=>l.files.length>0).length>0?'#7c6ff7':'rgba(255,255,255,.06)',border:'none',color:layers.filter(l=>l.files.length>0).length>0?'#080809':'rgba(255,255,255,.25)',fontFamily:'Inter,sans-serif',fontWeight:700,fontSize:'13px',padding:'.7rem',borderRadius:'7px',cursor:layers.filter(l=>l.files.length>0).length>0?'pointer':'not-allowed',letterSpacing:'.04em'}}
        >
          🎨 generate {supply} NFTs
        </button>
      )}
    </div>
  )
}