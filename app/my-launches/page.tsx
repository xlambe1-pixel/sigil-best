import Navbar from '@/components/Navbar'
import MyLaunches from '@/components/MyLaunches'

export default function MyLaunchesPage() {
  return (
    <main style={{minHeight:'100vh',background:'#080809',color:'#ededf0'}}>
      <Navbar />
      <MyLaunches />
    </main>
  )
}
