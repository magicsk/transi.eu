import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import Screenshots from "@/components/Screenshots";
import Download from "@/components/Download";
import Footer from "@/components/Footer";
import { fetchLatestRelease } from "@/lib/github";
import screenshots from "@/data/screenshots.json";

export const revalidate = 3600;

export default async function Home() {
  const [android, ios] = await Promise.all([
    fetchLatestRelease("Transi", ".apk"),
    fetchLatestRelease("Transi-swift", ".ipa"),
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      <Hero
        androidApk={android.downloadUrl}
        iosIpa={ios.downloadUrl}
        androidVersion={android.version}
        iosVersion={ios.version}
        iosHero={screenshots.ios[0]}
        androidHero={screenshots.android[0]}
      />
      <Stats />
      <Features />
      <Screenshots iosScreenshots={screenshots.ios} androidScreenshots={screenshots.android} />
      <Download android={android} ios={ios} />
      <Footer />
    </main>
  );
}
