import Navbar from '@/components/Navbar'
import CreatorProfile from '@/components/CreatorProfile'

export default async function CreatorPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params
  return (
    <main style={{minHeight:'100vh',background:'#080809',color:'#ededf0'}}>
      <Navbar />
      <CreatorProfile address={decodeURIComponent(address)} />
    </main>
  )
}
