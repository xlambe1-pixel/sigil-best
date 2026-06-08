import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import UpcomingSection from '@/components/UpcomingSection'
import CollectionsTable from '@/components/CollectionsTable'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div style={{background:'#080809',minHeight:'100vh',color:'#ededf0'}}>
      <Navbar />
      <div style={{maxWidth:'1100px',margin:'0 auto',borderLeft:'.5px solid rgba(255,255,255,.06)',borderRight:'.5px solid rgba(255,255,255,.06)',minHeight:'100vh'}}>
        <UpcomingSection />
        <Hero />
        <CollectionsTable />
        <Footer />
      </div>
    </div>
  )
}