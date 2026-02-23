'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeLogo from '@/components/ThemeLogo'

const GITHUB_ANDROID = 'https://github.com/magicsk/Transi'
const GITHUB_IOS = 'https://github.com/magicsk/Transi-swift'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-label="Main"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b backdrop-blur-xl ${
        scrolled
          ? 'bg-[var(--glass-bg)] border-[var(--border)] py-3'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <ThemeLogo className="w-8 h-8" />
          <span className="font-semibold text-lg tracking-tight text-[var(--text)]">
            Transi
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-5 text-sm text-[var(--text-muted)]">
          <a
            href="#features"
            className="hover:text-[var(--text)] transition-colors"
          >
            Features
          </a>
          <a
            href="#screenshots"
            className="hover:text-[var(--text)] transition-colors"
          >
            Screenshots
          </a>
          <a
            href="#download"
            className="hover:text-[var(--text)] transition-colors"
          >
            Download
          </a>

          {/* GitHub - both repos */}
          <span className="text-[var(--border-strong)]">·</span>
          <a
            href={GITHUB_ANDROID}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--text)] transition-colors"
            title="Android source"
          >
            <GitHubIcon />
            Android
          </a>
          <a
            href={GITHUB_IOS}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--text)] transition-colors"
            title="iOS source"
          >
            <GitHubIcon />
            iOS
          </a>
        </div>

        <a
          href="#download"
          className="px-4 py-1.5 rounded-full bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-all duration-200"
        >
          Download
        </a>
      </div>
    </motion.nav>
  )
}

function GitHubIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="opacity-70"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
