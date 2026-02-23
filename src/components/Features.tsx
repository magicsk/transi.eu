'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion'
import { useDevicePlatform } from '@/lib/useDevicePlatform'
import {
  Bell,
  Map,
  Clock,
  Navigation,
  Share2,
  Save,
  Activity,
  TableOfContents,
} from 'lucide-react'

const features = [
  {
    icon: TableOfContents,
    title: 'Virtual Tables',
    description:
      'Live departure boards with real-time delay info and vehicle details. See exactly when your bus or tram arrives.',
    color: 'from-brand-500/20 to-brand-600/10',
    border: 'border-brand-500/25',
    accent: 'text-brand-500',
  },
  {
    icon: Navigation,
    title: 'Trip Planner',
    description:
      'Plan your journey with routes from multiple sources. Long-press results to get persistent trip notifications (android only).',
    color: 'from-sky-500/15 to-sky-600/8',
    border: 'border-sky-500/20',
    accent: 'text-sky-500',
  },
  {
    icon: Clock,
    title: 'Timetables',
    description:
      'Full schedule access for every line. Browse departures at any stop for any route, any time of day.',
    color: 'from-violet-500/15 to-violet-600/8',
    border: 'border-violet-500/20',
    accent: 'text-violet-500',
  },
  {
    icon: Bell,
    title: 'Live Notifications',
    description:
      'Long-press any departure to pin a real-time updating notification to your status bar. Never miss a connection.',
    color: 'from-amber-500/15 to-amber-600/8',
    border: 'border-amber-500/20',
    accent: 'text-amber-500',
    androidOnly: true,
  },
  {
    icon: Map,
    title: 'Transit Map',
    description:
      'Interactive map with all public transport stop in region of Bratislava. Find the closest stop and browse departures or find directions from the map.',
    color: 'from-emerald-500/15 to-emerald-600/8',
    border: 'border-emerald-500/20',
    accent: 'text-emerald-500',
  },
  {
    icon: Activity,
    title: 'Live Activities',
    description:
      'iOS Live Activities and Dynamic Island integration - your trip countdown right on the lock screen.',
    color: 'from-rose-500/15 to-rose-600/8',
    border: 'border-rose-500/20',
    accent: 'text-rose-500',
    iosOnly: true,
  },
  {
    icon: Save,
    title: 'Havy caching',
    description:
      'Stops database and map tiles are cached locally for minimal data usage. Soon also trip planner and timetables available offline.',
    color: 'from-teal-500/15 to-teal-600/8',
    border: 'border-teal-500/20',
    accent: 'text-teal-500',
  },
  {
    icon: Share2,
    title: 'Share with friends',
    description:
      'Share stop departure boards or trip plans with friends. Native iOS sharing and Android intents supported.',
    color: 'from-indigo-500/15 to-indigo-600/8',
    border: 'border-indigo-500/20',
    accent: 'text-indigo-500',
  },
]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Features() {
  const iosFirst = useDevicePlatform() === 'ios'

  return (
    <section id="features" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-brand-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-sky-500/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-brand-500 text-sm font-semibold tracking-widest uppercase mb-4">
            What&apos;s inside
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text)] mb-5">
            Everything you need
            <br />
            <span className="gradient-text">to ride the city</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto leading-relaxed">
            Built natively for iOS and Android - fast, reliable, and packed with
            features designed for daily commuters in Bratislava.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => (
            <TiltCard
              key={feature.title}
              className={`relative glass-card rounded-2xl p-6 bg-gradient-to-br ${feature.color} border ${feature.border}`}
            >
              {feature.iosOnly && (
                <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-ios/15 text-ios/80 font-medium border border-ios/20">
                  iOS
                </span>
              )}
              {feature.androidOnly && (
                <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-android/15 text-android/80 font-medium border border-android/20">
                  Android
                </span>
              )}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.color} border ${feature.border}`}
              >
                <feature.icon
                  size={20}
                  className={feature.accent}
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-semibold text-[var(--text)] text-base mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {feature.description}
              </p>
            </TiltCard>
          ))}
        </motion.div>

        {/* Platform chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-12"
        >
          {iosFirst ? (
            <>
              <PlatformChip
                color="bg-ios/10 border-ios/20 text-ios/80"
                label="iOS - SwiftUI"
              />
              <PlatformChip
                color="bg-android/10 border-android/20 text-android/80"
                label="Android - Kotlin"
              />
            </>
          ) : (
            <>
              <PlatformChip
                color="bg-android/10 border-android/20 text-android/80"
                label="Android - Kotlin"
              />
              <PlatformChip
                color="bg-ios/10 border-ios/20 text-ios/80"
                label="iOS - SwiftUI"
              />
            </>
          )}
          <PlatformChip
            color="border-[var(--border)] text-[var(--text-faint)]"
            label="GPL-3.0 Open Source"
          />
        </motion.div>
      </div>
    </section>
  )
}

function TiltCard({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 400, damping: 35 })
  const y = useSpring(rawY, { stiffness: 400, damping: 35 })
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10])
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.04 }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      transition={{ scale: { type: 'spring', stiffness: 300, damping: 25 } }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  )
}

function PlatformChip({ color, label }: { color: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border ${color}`}
    >
      {label}
    </span>
  )
}
