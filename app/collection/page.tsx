import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import UpcomingSection from '@/components/UpcomingSection'
import CollectionsTable from '@/components/CollectionsTable'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main style={{minHeight:'100vh',background:'#080809',color:'#ededf0',maxWidth:'1400px',margin:'0 auto'}}>
      <Navbar />
      <UpcomingSection />
      <Hero />
      <CollectionsTable />
      <Footer />
    </main>
  )
}