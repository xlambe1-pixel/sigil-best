import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import StatsBar from '@/components/StatsBar'
import CollectionsTable from '@/components/CollectionsTable'
import BiggestMovers from '@/components/BiggestMovers'

export default function Home() {
  return (
    <main style={{minHeight:'100vh',background:'#080809',color:'#ededf0'}}>
      <Navbar />
      <Hero />
      <StatsBar />
      <BiggestMovers />
      <CollectionsTable />
    </main>
  )
}