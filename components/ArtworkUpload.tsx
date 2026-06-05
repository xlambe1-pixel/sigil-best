'use client'
import { useState } from 'react'

export default function ArtworkUpload({ onUpload }: { onUpload: (url: string, hash: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState('')
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setUploaded(data.url)
      onUpload(data.url, data.ipfsHash)
    } catch (e) {
      setError('Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div
        onDragOver={e=>e.preventDefault()}
        onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f)}}
        style={{border:`.5px dashed ${uploaded?'rgba(74,222,128,.4)':'rgba(124,111,247,.3)'}`,borderRadius:'12px',padding:'3rem 2rem',textAlign:'center',background:uploaded?'rgba(74,222,128,.03)':'rgba(124,111,247,.03)',cursor:'pointer',marginBottom:'1rem',position:'relative'}}
        onClick={()=>document.getElementById('artwork-input')?.click()}
      >
        <input
          id="artwork-input"
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp,video/mp4"
          style={{display:'none'}}
          onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f)}}
        />
        {uploading ? (
          <>
            <div style={{fontSize:'32px',marginBottom:'1rem'}}>⏳</div>
            <div style={{fontSize:'14px',fontWeight:600,marginBottom:'.5rem'}}>uploading to ipfs...</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)'}}>please wait</div>
          </>
        ) : uploaded ? (
          <>
            <div style={{fontSize:'32px',marginBottom:'1rem'}}>✓</div>
            <div style={{fontSize:'14px',fontWeight:600,color:'#4ade80',marginBottom:'.5rem'}}>uploaded to ipfs!</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.35)',wordBreak:'break-all'}}>{uploaded}</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,.25)',marginTop:'.5rem'}}>click to replace</div>
          </>
        ) : (
          <>
            <div style={{fontSize:'32px',marginBottom:'1rem',opacity:.4}}>↑</div>
            <div style={{fontSize:'14px',fontWeight:600,marginBottom:'.5rem'}}>upload your artwork</div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.3)',lineHeight:1.8}}>
              drag & drop or click to browse<br/>
              supports: png, jpg, gif, webp, mp4<br/>
              max 100mb per file
            </div>
          </>
        )}
      </div>
      {error && (
        <div style={{background:'rgba(248,113,113,.08)',border:'.5px solid rgba(248,113,113,.2)',borderRadius:'7px',padding:'.65rem .85rem',fontFamily:'DM Mono,monospace',fontSize:'11px',color:'#f87171'}}>
          ✗ {error}
        </div>
      )}
    </div>
  )
}