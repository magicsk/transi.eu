'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDevicePlatform } from '@/lib/useDevicePlatform'
import type { ScreenshotEntry } from '@/lib/github'

type Platform = 'ios' | 'android'

/**
 * Hides image (opacity 0) until fully loaded, then fades in.
 * The container background acts as the placeholder - no top-to-bottom
 * progressive strips visible. For a true blur-up you'd need server-side
 * LQIP thumbnails; this gives the same "clean reveal" feel without them.
 */
function FadeImg({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
}: {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
}) {
  const [loaded, setLoaded] = useState(false)
  return (
    <Image
      src={src}
      alt={alt}
      {...(fill ? { fill: true } : { width: width!, height: height! })}
      sizes={sizes}
      className={`${className ?? ''} transition-opacity duration-500 ease-out ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
      onLoad={() => setLoaded(true)}
    />
  )
}

export default function Screenshots({
  iosScreenshots,
  androidScreenshots,
}: {
  iosScreenshots: ScreenshotEntry[]
  androidScreenshots: ScreenshotEntry[]
}) {
  const detectedPlatform = useDevicePlatform()
  const [platform, setPlatform] = useState<Platform>('ios')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [active, setActive] = useState(0)

  useEffect(() => {
    setPlatform(detectedPlatform)
    setActive(0)
  }, [detectedPlatform])

  if (iosScreenshots.length === 0 && androidScreenshots.length === 0)
    return null

  // Auto-switch if the selected platform has no screenshots
  const effectivePlatform =
    platform === 'ios' && iosScreenshots.length === 0
      ? 'android'
      : platform === 'android' && androidScreenshots.length === 0
        ? 'ios'
        : platform
  const screenshots =
    effectivePlatform === 'ios' ? iosScreenshots : androidScreenshots
  const current = screenshots[Math.min(active, screenshots.length - 1)]
  const hasThemeVariants = screenshots.some((s) => s.dark !== s.light)
  // Intrinsic height at 270px width matching each platform's actual screenshot ratio
  // iOS 1206×2622 → 587px, Android 1280×2856 → 602px
  // Prevents layout jump when the browser resolves the image's natural dimensions
  const phoneH = effectivePlatform === 'android' ? 602 : 587

  const handlePlatform = (p: Platform) => {
    setPlatform(p)
    setActive(0)
  }

  const prev = () =>
    setActive((i) => (i === 0 ? screenshots.length - 1 : i - 1))
  const next = () =>
    setActive((i) => (i === screenshots.length - 1 ? 0 : i + 1))

  return (
    <section id="screenshots" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-brand-500/5 blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-brand-700/4 blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-brand-500 text-sm font-semibold tracking-widest uppercase mb-4">
            See it in action
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text)] mb-5">
            Screenshots
          </h2>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {/* Platform tabs - only shown when both platforms have screenshots */}
          {iosScreenshots.length > 0 && androidScreenshots.length > 0 && (
            <div
              role="group"
              aria-label="Platform"
              className="flex items-center gap-1 p-1 rounded-xl glass border border-[var(--border)]"
            >
              <button
                onClick={() => handlePlatform('ios')}
                aria-pressed={effectivePlatform === 'ios'}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none ${
                  effectivePlatform === 'ios'
                    ? 'bg-ios/20 text-ios border border-ios/30'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <AppleIcon />
                iOS
              </button>
              <button
                onClick={() => handlePlatform('android')}
                aria-pressed={effectivePlatform === 'android'}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none ${
                  effectivePlatform === 'android'
                    ? 'bg-android/20 text-android border border-android/30'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <AndroidIcon />
                Android
              </button>
            </div>
          )}

          {/* Theme toggle - only when the current platform has dark/light variants */}
          {hasThemeVariants && (
            <div
              role="group"
              aria-label="Color theme"
              className="flex items-center gap-1 p-1 rounded-xl glass border border-[var(--border)]"
            >
              <button
                onClick={() => setTheme('dark')}
                aria-pressed={theme === 'dark'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-[var(--card-bg)] text-[var(--text)]'
                    : 'text-[var(--text-faint)] hover:text-[var(--text)]'
                }`}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => setTheme('light')}
                aria-pressed={theme === 'light'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none ${
                  theme === 'light'
                    ? 'bg-[var(--card-bg)] text-[var(--text)]'
                    : 'text-[var(--text-faint)] hover:text-[var(--text)]'
                }`}
              >
                ☀️ Light
              </button>
            </div>
          )}
        </div>

        {/* Carousel */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Thumbnails - desktop left */}
          {screenshots.length > 1 && (
            <div className="hidden lg:flex flex-col gap-3 flex-shrink-0">
              {screenshots.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={s.label}
                  aria-current={i === active ? 'true' : undefined}
                  className={`relative w-14 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer focus:outline-none ${
                    i === active
                      ? 'border-brand-500/70 scale-105'
                      : 'border-[var(--border)] opacity-40 hover:opacity-65'
                  }`}
                >
                  <FadeImg
                    src={theme === 'dark' ? s.dark : s.light}
                    alt={s.label}
                    fill
                    sizes="56px"
                    className="object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Phone + arrows (inline, no absolute overflow) */}
          <div className="flex flex-col items-center gap-5 flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* ← */}
              {screenshots.length > 1 && (
                <button
                  onClick={prev}
                  aria-label="Previous screenshot"
                  className="w-9 h-9 rounded-full glass border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:border-brand-500/30 transition-all flex-shrink-0 cursor-pointer focus:outline-none"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
              )}

              {/* Phone frame */}
              <motion.div
                layout
                transition={{ layout: { duration: 0.35, ease: 'easeInOut' } }}
                className="relative w-[240px] sm:w-[270px]"
              >
                <div className="absolute inset-0 rounded-[2.6rem] bg-brand-500/8 blur-xl scale-105" />
                <div className="relative rounded-[2.6rem] border border-[var(--border-strong)] overflow-hidden phone-shadow bg-[var(--phone-frame)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${platform}-${active}-${theme}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FadeImg
                        src={theme === 'dark' ? current.dark : current.light}
                        alt={current.label}
                        width={270}
                        height={phoneH}
                        sizes="(min-width: 640px) 270px, 240px"
                        className="w-full h-auto block"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* → */}
              {screenshots.length > 1 && (
                <button
                  onClick={next}
                  aria-label="Next screenshot"
                  className="w-9 h-9 rounded-full glass border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:border-brand-500/30 transition-all flex-shrink-0 cursor-pointer focus:outline-none"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Dot indicators */}
            {screenshots.length > 1 && (
              <div
                className="flex items-center gap-2"
                role="group"
                aria-label="Screenshot navigation"
              >
                {screenshots.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Screenshot ${i + 1} of ${screenshots.length}`}
                    aria-current={i === active ? 'true' : undefined}
                    className={`rounded-full transition-all duration-200 cursor-pointer focus:outline-none ${
                      i === active
                        ? 'w-5 h-1.5 bg-brand-500'
                        : 'w-1.5 h-1.5 bg-[var(--border-strong)]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description + mobile thumbnails */}
          <div className="w-64 lg:w-72 text-center lg:text-left">
            {/* w-full on relative so absolute child resolves to the right width */}
            <div className="relative w-full min-h-[5rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${platform}-${active}`}
                  className="absolute inset-x-0 top-0"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-2xl font-bold text-[var(--text)] mb-2">
                    {current.label}
                  </h3>
                  <p className="text-[var(--text-muted)] text-base leading-relaxed">
                    {current.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile thumbnails */}
            {screenshots.length > 1 && (
              <div className="flex lg:hidden gap-2 justify-center mt-5">
                {screenshots.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={s.label}
                    aria-current={i === active ? 'true' : undefined}
                    className={`relative w-12 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer focus:outline-none ${
                      i === active
                        ? 'border-brand-500/70 scale-105'
                        : 'border-[var(--border)] opacity-40'
                    }`}
                  >
                    <FadeImg
                      src={theme === 'dark' ? s.dark : s.light}
                      alt={s.label}
                      fill
                      sizes="48px"
                      className="object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function AppleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.16 1.26-2.14 3.76.03 2.96 2.6 3.95 2.63 3.96l-.04.1c-.18.6-.46 1.2-.8 1.8zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function AndroidIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 200 200"
      aria-hidden="true"
    >
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
