import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import UpcomingSection from '@/components/UpcomingSection'
import CollectionsTable from '@/components/CollectionsTable'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div style={{background:'#080809',minHeight:'100vh',color:'#ededf0'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <Navbar />
        <UpcomingSection />
        <Hero />
        <CollectionsTable />
        <Footer />
      </div>
    </div>
  )
}