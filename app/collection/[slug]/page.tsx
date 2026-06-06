import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import BiggestMovers from '@/components/BiggestMovers'
import CollectionsTable from '@/components/CollectionsTable'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main style={{minHeight:'100vh',background:'#080809',color:'#ededf0'}}>
      <Navbar />
      <Hero />
      <Stats />
      <BiggestMovers />
      <CollectionsTable />
      <Footer />
    </main>
  )
}