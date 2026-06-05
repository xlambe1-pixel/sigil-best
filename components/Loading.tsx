export default function Loading() {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',flexDirection:'column',gap:'1rem'}}>
      <div style={{width:'32px',height:'32px',position:'relative'}}>
        <div style={{position:'absolute',inset:0,border:'.5px solid rgba(124,111,247,.2)',borderRadius:'50%'}} />
        <div style={{position:'absolute',inset:0,border:'.5px solid transparent',borderTopColor:'#7c6ff7',borderRadius:'50%',animation:'spin 1s linear infinite'}} />
      </div>
      <div style={{fontFamily:'DM Mono,monospace',fontSize:'11px',color:'rgba(255,255,255,.25)',letterSpacing:'.1em'}}>loading...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
