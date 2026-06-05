import Navbar from '@/components/Navbar'
import LaunchWizard from '@/components/LaunchWizard'

export default function Launch() {
  return (
    <main style={{minHeight:'100vh',background:'#080809',color:'#ededf0'}}>
      <Navbar />
      <LaunchWizard />
    </main>
  )
}
