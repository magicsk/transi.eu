'use client'

import { motion, AnimatePresence, type Variants } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Download, ChevronDown } from 'lucide-react'
import { useColorScheme } from '@/lib/useColorScheme'
import { useDevicePlatform } from '@/lib/useDevicePlatform'
import type { ScreenshotEntry } from '@/lib/github'

interface SloganGroup {
  anchor: string
  slogans: string[]
}

const SLOGAN_GROUPS: SloganGroup[] = [
  {
    anchor: 'Transi.',
    slogans: [
      'Your city, on time.',
      'Never miss your ride.',
      'Move smarter.',
      'Always on track.',
    ],
  },
  {
    anchor: 'Get on board.',
    slogans: ['Plan your trip.', 'Track your ride.', 'Skip the waiting.'],
  },
  {
    anchor: 'Less waiting.',
    slogans: ['More living.', 'More exploring.', 'More arriving.', 'More you.'],
  },
  {
    anchor: 'One app.',
    slogans: [
      'Every route.',
      'Every departure.',
      'Your whole city.',
      'Zero surprises.',
    ],
  },
  {
    anchor: 'Real time.',
    slogans: [
      'Real simple.',
      'Real freedom.',
      'Real confidence.',
      'Your time.',
    ],
  },
  {
    anchor: "Don't guess.",
    slogans: ['Know.', 'Plan.', 'Transi.', 'Just go.'],
  },
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12 },
  }),
}

function AnimatedSlogan({ slogans }: { slogans: string[] }) {
  const [index, setIndex] = useState(0)
  const widest = slogans.reduce((a, b) => (a.length >= b.length ? a : b))

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slogans.length),
      3200,
    )
    return () => clearInterval(id)
  }, [slogans])

  return (
    <span className="relative block" aria-live="polite" aria-atomic="true">
      {/* Invisible widest slogan reserves minimum height; both spans wrap at the same container width */}
      <span
        className="gradient-text invisible select-none block"
        aria-hidden="true"
      >
        {widest}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className="gradient-text absolute left-0 top-0 w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          {slogans[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero({
  androidApk,
  iosIpa,
  androidVersion,
  iosVersion,
  iosHero,
  androidHero,
}: {
  androidApk: string
  iosIpa: string
  androidVersion: string
  iosVersion: string
  iosHero: ScreenshotEntry
  androidHero: ScreenshotEntry
}) {
  const scheme = useColorScheme()
  const platform = useDevicePlatform()
  const iosFirst = platform === 'ios'
  const heroSrc = (platform === 'ios' ? iosHero : androidHero)[
    scheme === 'dark' ? 'dark' : 'light'
  ]

  // UTC hour % length — deterministic on both server and client, changes each hour
  const [groupIndex] = useState(() => new Date().getUTCHours() % SLOGAN_GROUPS.length)
  const group = SLOGAN_GROUPS[groupIndex]

  const iosButton = (
    <a
      href={iosIpa}
      className={`group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 w-full sm:w-auto justify-center ${
        iosFirst
          ? 'bg-brand-500 text-white hover:bg-brand-600'
          : 'glass border border-[var(--border-strong)] text-[var(--text)] hover:border-brand-500/40 hover:bg-brand-500/8'
      }`}
    >
      <AppleIcon />
      Download IPA
      <Download
        size={15}
        className="opacity-70 group-hover:translate-y-0.5 transition-transform"
        aria-hidden="true"
      />
    </a>
  )

  const androidButton = (
    <a
      href={androidApk}
      className={`group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 w-full sm:w-auto justify-center ${
        !iosFirst
          ? 'bg-brand-500 text-white hover:bg-brand-600'
          : 'glass bg-android/5 border border-[var(--border-strong)] text-[var(--text)] hover:border-android/40 hover:bg-android/10'
      }`}
    >
      <AndroidIcon />
      Download APK
      <Download
        size={15}
        className="opacity-70 group-hover:translate-y-0.5 transition-transform"
        aria-hidden="true"
      />
    </a>
  )

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden animated-gradient noise">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-500/8 blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 rounded-full bg-brand-700/6 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-brand-400/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(241,57,83,1) 1px, transparent 1px), linear-gradient(90deg, rgba(241,57,83,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16 flex flex-col lg:flex-row items-center gap-16">
        {/* Left — text */}
        <div className="flex-1 text-center lg:text-left">
          {/* Live badge
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand-500/30 text-brand-500 text-sm font-medium mb-8"
          >
            <span className="relative w-2 h-2 pulse-ring">
              <span className="w-2 h-2 rounded-full bg-brand-500 block" />
            </span>
            Live departures
          </motion.div> */}

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-[var(--text)]"
          >
            {group.anchor}
            <br />
            <AnimatedSlogan key={groupIndex} slogans={group.slogans} />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg sm:text-xl text-[var(--text-muted)] leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10"
          >
            Transi is a native iOS &amp; Android app for Bratislava public
            transport. Real-time virtual tables, seamless trip planning, and
            full timetables — all in one sleek package.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row items-center lg:items-start gap-3 justify-center lg:justify-start"
          >
            {iosFirst ? (
              <>
                {iosButton}
                {androidButton}
              </>
            ) : (
              <>
                {androidButton}
                {iosButton}
              </>
            )}
          </motion.div>

          {/* Version chips */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex items-center gap-3 mt-5 justify-center lg:justify-start text-xs text-[var(--text-faint)]"
          >
            {iosFirst ? (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-ios" />
                  iOS v{iosVersion}
                </span>
                <span className="text-[var(--text-faintest)]">·</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-android" />
                  Android v{androidVersion}
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-android" />
                  Android v{androidVersion}
                </span>
                <span className="text-[var(--text-faintest)]">·</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-ios" />
                  iOS v{iosVersion}
                </span>
              </>
            )}
          </motion.div>
        </div>

        {/* Right — phone mockup */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-shrink-0 relative"
        >
          <PhoneMockup src={heroSrc} />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--text-faint)] text-xs"
      >
        <span>Scroll to explore</span>
        <ChevronDown size={16} className="animate-bounce" aria-hidden="true" />
      </motion.div>
    </section>
  )
}

function PhoneMockup({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false)
  const platform = useDevicePlatform()

  return (
    <div className="relative w-[260px] sm:w-[300px]">
      {/* Glow */}
      <div className="absolute inset-0 rounded-[2.8rem] bg-brand-500/10 blur-2xl scale-110" />

      {/* Phone frame — no fake chrome, screenshot already contains notch + pill */}
      <div className="relative rounded-[2.8rem] border border-[var(--border-strong)] overflow-hidden phone-shadow bg-[var(--phone-frame)]">
        <Image
          src={src}
          alt="Transi app screenshot"
          width={300}
          height={650}
          sizes="(min-width: 640px) 300px, 260px"
          className={`w-full h-auto block transition-opacity duration-500 ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
          priority
        />
      </div>

      {/* Floating badge — live */}
      <div className="absolute -right-22 top-20 flex items-center gap-2 px-3 py-2 rounded-xl glass border border-brand-500/30 text-xs font-medium text-brand-500 shadow-xl">
        <span className="relative w-2 h-2">
          <span className="absolute inset-0 rounded-full bg-brand-500 animate-ping opacity-70" />
          <span className="w-2 h-2 rounded-full bg-brand-500 block" />
        </span>
        {platform === 'ios' ? 'Live activities' : 'Live notifications'}
      </div>

      {/* Floating badge — stops */}
      <div className="absolute -left-15 bottom-24 flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] shadow-xl">
        ✋ Native design
      </div>
    </div>
  )
}

function AndroidIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 200 200" aria-hidden="true">
      <g stroke="#3DDC84" strokeWidth="6" strokeLinecap="round">
        <line x1="75" y1="35" x2="63" y2="14" />
        <line x1="125" y1="35" x2="137" y2="14" />
      </g>
      <g fill="#3DDC84">
        <path d="M 50,78 A 50,50 0 0,1 150,78 Z" />
        <path d="M 50,82 h 100 v 70 a 15,15 0 0 1 -15,15 h -70 a 15,15 0 0 1 -15,-15 z" />
        <rect x="25" y="82" width="20" height="65" rx="10" />
        <rect x="155" y="82" width="20" height="65" rx="10" />
        <rect x="70" y="150" width="20" height="45" rx="10" />
        <rect x="110" y="150" width="20" height="45" rx="10" />
      </g>
      <g fill="#FFFFFF">
        <circle cx="75" cy="50" r="5" />
        <circle cx="125" cy="50" r="5" />
      </g>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.16 1.26-2.14 3.76.03 2.96 2.6 3.95 2.63 3.96l-.04.1c-.18.6-.46 1.2-.8 1.8zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}
