'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useDevicePlatform } from '@/lib/useDevicePlatform'
import {
  Download as DownloadIcon,
  ExternalLink,
  Package,
  Shield,
  Check,
  Copy,
} from 'lucide-react'
import type { ReleaseInfo } from '@/lib/github'

const ALTSTORE_REPO = 'https://api.magicsk.eu/transi/store.json'
const ALTSTORE_INSTALL =
  'altstore://source?url=' + encodeURIComponent(ALTSTORE_REPO)
const SIDESTORE_INSTALL =
  'sidestore://source?url=' + encodeURIComponent(ALTSTORE_REPO)
const GITHUB_ANDROID = 'https://github.com/magicsk/Transi'
const GITHUB_IOS = 'https://github.com/magicsk/Transi-swift'

function CopyRepoUrl() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(ALTSTORE_REPO)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <>
      {/* Toast - fixed at top, never affects layout */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-500/40 text-brand-500 text-sm font-medium shadow-xl pointer-events-none"
          >
            <Check size={14} aria-hidden="true" />
            Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-2 mt-5 p-3 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)]">
        <Package
          size={14}
          className="text-brand-500/60 mt-0.5 flex-shrink-0"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-[var(--text-faint)] leading-relaxed mb-1.5">
            AltStore / SideStore source JSON:
          </p>
          <button
            onClick={copy}
            className="group flex items-center gap-2 w-full text-left"
            aria-label="Copy AltStore repo URL to clipboard"
          >
            <span className="text-xs font-mono text-brand-500/70 group-hover:text-brand-500 truncate transition-colors flex-1">
              {ALTSTORE_REPO}
            </span>
            <span className="flex-shrink-0 transition-all duration-200">
              {copied ? (
                <Check
                  size={13}
                  className="text-brand-500"
                  aria-hidden="true"
                />
              ) : (
                <Copy
                  size={13}
                  className="text-[var(--text-faint)] group-hover:text-brand-500 transition-colors"
                  aria-hidden="true"
                />
              )}
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

export default function Download({
  android,
  ios,
}: {
  android: ReleaseInfo
  ios: ReleaseInfo
}) {
  const iosFirst = useDevicePlatform() === 'ios'

  return (
    <section id="download" className="relative py-28 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/4 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-brand-500 text-sm font-semibold tracking-widest uppercase mb-4">
            Get Transi
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text)] mb-5">
            Download &amp; Install
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto leading-relaxed">
            Transi is free, open-source, and distributed directly via GitHub -
            no app store required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Android card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: iosFirst ? 0.1 : 0 }}
            className={`relative rounded-3xl p-8 glass-card border border-android/20 bg-gradient-to-br from-android/8 to-transparent ${iosFirst ? 'order-2' : 'order-1'}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-android/15 border border-android/25 flex items-center justify-center">
                <AndroidIcon size={28} className="text-android" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text)]">
                  Android
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Kotlin · v{android.version}
                </p>
              </div>
            </div>

            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8">
              Download the APK directly and install it on your Android device.
              You may need to enable &ldquo;Install from unknown sources&rdquo;
              in settings.
            </p>

            <div className="space-y-3">
              <a
                href={android.downloadUrl}
                className="flex items-center justify-between gap-3 w-full px-5 py-4 rounded-2xl bg-android/15 border border-android/30 text-android font-semibold text-sm hover:bg-android/25 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <DownloadIcon size={18} aria-hidden="true" />
                  <div className="text-left">
                    <div className="font-semibold">Download APK</div>
                    <div className="text-xs text-android/60 font-normal">
                      {android.assetName}
                    </div>
                  </div>
                </div>
                <DownloadIcon
                  size={15}
                  className="opacity-50 group-hover:translate-y-0.5 transition-transform"
                  aria-hidden="true"
                />
              </a>

              <a
                href={GITHUB_ANDROID + '/releases'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 w-full px-5 py-3.5 rounded-2xl glass border border-[var(--border)] text-[var(--text-secondary)] text-sm hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Package size={16} aria-hidden="true" />
                  All releases on GitHub
                </div>
                <ExternalLink
                  size={14}
                  className="opacity-50"
                  aria-hidden="true"
                />
              </a>
            </div>

            <div className="flex items-start gap-2 mt-5 p-3 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)]">
              <Shield
                size={14}
                className="text-android/60 mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <p className="text-xs text-[var(--text-faint)] leading-relaxed">
                Open-source under GPL-3.0. You can audit every line at{' '}
                <a
                  href={GITHUB_ANDROID}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-android/60 hover:text-android/80 underline"
                >
                  github.com/magicsk/Transi
                </a>
              </p>
            </div>
          </motion.div>

          {/* iOS card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: iosFirst ? 0 : 0.1 }}
            className={`relative rounded-3xl p-8 glass-card border border-ios/20 bg-gradient-to-br from-ios/8 to-transparent ${iosFirst ? 'order-1' : 'order-2'}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-ios/15 border border-ios/25 flex items-center justify-center">
                <AppleIcon size={28} className="text-ios" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text)]">iOS</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  SwiftUI · v{ios.version}
                </p>
              </div>
            </div>

            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8">
              Install via AltStore or SideStore for automatic updates, or
              sideload the IPA manually. Requires iOS 16+ or later.
            </p>

            <div className="space-y-3">
              {/* AltStore */}
              <a
                href={ALTSTORE_INSTALL}
                className="flex items-center justify-between gap-3 w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-brand-500/20 to-brand-400/10 border border-brand-500/35 text-[var(--text)] font-semibold text-sm hover:from-brand-500/30 hover:border-brand-500/50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <AltStoreIcon />
                  <div className="text-left">
                    <div className="font-semibold text-brand-500">
                      Add to AltStore
                    </div>
                    <div className="text-xs text-[var(--text-faint)] font-normal">
                      Auto-updates via AltStore
                    </div>
                  </div>
                </div>
                <ExternalLink
                  size={15}
                  className="opacity-50 group-hover:opacity-80 transition-opacity"
                  aria-hidden="true"
                />
              </a>

              {/* SideStore */}
              <a
                href={SIDESTORE_INSTALL}
                className="flex items-center justify-between gap-3 w-full px-5 py-4 rounded-2xl bg-[var(--card-subtle)] border border-[var(--border)] text-[var(--text-secondary)] font-semibold text-sm hover:bg-[var(--card-bg)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <SideStoreIcon />
                  <div className="text-left">
                    <div className="font-semibold">Add to SideStore</div>
                    <div className="text-xs text-[var(--text-faint)] font-normal">
                      Alternative to AltStore
                    </div>
                  </div>
                </div>
                <ExternalLink
                  size={15}
                  className="opacity-50 group-hover:opacity-80 transition-opacity"
                  aria-hidden="true"
                />
              </a>

              {/* Manual IPA */}
              <a
                href={ios.downloadUrl}
                className="flex items-center justify-between gap-3 w-full px-5 py-3.5 rounded-2xl glass border border-[var(--border)] text-[var(--text-muted)] text-sm hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <DownloadIcon size={16} aria-hidden="true" />
                  Download IPA manually
                </div>
                <DownloadIcon
                  size={14}
                  className="opacity-40"
                  aria-hidden="true"
                />
              </a>
            </div>

            <CopyRepoUrl />
          </motion.div>
        </div>

        {/* Open source note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-[var(--text-faint)] text-sm">
            Both apps are free &amp; open-source.{' '}
            <a
              href={GITHUB_ANDROID}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] hover:text-brand-500 transition-colors"
            >
              Android
            </a>{' '}
            ·{' '}
            <a
              href={GITHUB_IOS}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] hover:text-brand-500 transition-colors"
            >
              iOS
            </a>{' '}
            - contributions welcome.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function AndroidIcon({
  size = 24,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
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

function AppleIcon({
  size = 24,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.16 1.26-2.14 3.76.03 2.96 2.6 3.95 2.63 3.96l-.04.1c-.18.6-.46 1.2-.8 1.8zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function AltStoreIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="text-brand-500"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 12h8M12 8v8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SideStoreIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="text-[var(--text-muted)]"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 12h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}
