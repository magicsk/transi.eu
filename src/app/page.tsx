import Navbar from '@/components/Navbar'
import Route from '@/components/Route'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Download from '@/components/Download'
import Footer from '@/components/Footer'
import Network from '@/components/Network'
import { fetchLatestRelease } from '@/lib/github'

export const revalidate = 3600

export default async function Home() {
  const [android, ios] = await Promise.all([
    fetchLatestRelease('Transi', '.apk'),
    fetchLatestRelease('Transi-swift', '.ipa'),
  ])

  return (
    <>
      <Network />
      <div className="wrap">
        <Navbar />
        <main id="main-content">
          <Route />
          <Hero android={android} ios={ios} />
          <Features />
          <Download android={android} ios={ios} />
        </main>
        <Footer />
      </div>
    </>
  )
}
