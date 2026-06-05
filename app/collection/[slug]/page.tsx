import Navbar from '@/components/Navbar'
import CollectionMintPage from '@/components/CollectionMintPage'

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <main style={{minHeight:'100vh',background:'#080809',color:'#ededf0'}}>
      <Navbar />
      <CollectionMintPage slug={decodeURIComponent(slug)} />
    </main>
  )
}