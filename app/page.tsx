import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import UpcomingSection from '@/components/UpcomingSection'
import BiggestMovers from '@/components/BiggestMovers'
import CollectionsTable from '@/components/CollectionsTable'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div style={{background:'#080809',minHeight:'100vh',color:'#ededf0'}}>
      <div style={{
        maxWidth:'1100px',
        margin:'0 auto',
        borderLeft:'.5px solid rgba(255,255,255,.04)',
        borderRight:'.5px solid rgba(255,255,255,.04)',
      }}>
        <Navbar />
        <UpcomingSection />
        <Hero />
        <BiggestMovers />
        <CollectionsTable />
        <Footer />
      </div>
    </div>
  )
}