'use client'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import CollectionsTable from '@/components/CollectionsTable'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main style={{minHeight:'100vh',background:'#080809',color:'#ededf0'}}>
      <Navbar />
      <Hero />
      <CollectionsTable />
      <Footer />
    </main>
  )
}