'use client'

import { useState } from 'react'
import { Code, Copy, Download as DownloadIcon, ExternalLink, SquarePlus } from 'lucide-react'
import type { ReleaseInfo } from '@/lib/github'
import Shot from '@/components/Shot'

const ALTSTORE_REPO = 'https://api.magicsk.eu/transi/store.json'
const ALTSTORE_INSTALL = 'altstore://source?url=' + encodeURIComponent(ALTSTORE_REPO)
const SIDESTORE_INSTALL = 'sidestore://source?url=' + encodeURIComponent(ALTSTORE_REPO)
const GITHUB_ANDROID = 'https://github.com/magicsk/Transi'
const GITHUB_IOS = 'https://github.com/magicsk/Transi-swift'

// "Version 1.4.1, " or nothing when GitHub could not be reached
const version = (r: ReleaseInfo) => (r.version !== '-' ? `Version ${r.version}, ` : '')

const AppIcon = () => (
  <Shot
    dark="/logo/transi-iOS-Dark-1024x1024@1x.webp"
    light="/logo/transi-iOS-Default-1024x1024@1x.webp"
    width={1024}
    height={1024}
    alt=""
    sizes="60px"
  />
)

/**
 * The end of the line. Android is always first and iOS second, for every visitor; which of the two
 * stations the tram ends on is decided in <Route />. Each .term's station (its ::after ring) is placed
 * by <Route /> through the --st custom property.
 */
export default function Download({ android, ios }: { android: ReleaseInfo; ios: ReleaseInfo }) {
  const [copied, setCopied] = useState(false)
  // the clipboard can refuse (no permission, insecure page): then the label just doesn't change
  const copy = () =>
    navigator.clipboard?.writeText(ALTSTORE_REPO).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }, () => {})

  return (
    <>
      <div className="end" id="install">
        <h2>Last stop: install</h2>
        <p className="s-lede">
          Transi is free, open-source, and distributed directly via GitHub. No app store required.
        </p>
      </div>

      <div className="inst">
        <div className="term android" id="install-android">
          <div className="th">
            <AppIcon />
            <div>
              <h3>Android</h3>
              <p>{version(android)}Kotlin</p>
            </div>
          </div>
          <p className="tp">
            Download the APK and install it on your device. You may need to enable “Install from
            unknown sources” in settings.
          </p>
          <a className="act main" href={android.downloadUrl || GITHUB_ANDROID + '/releases/latest'}>
            <DownloadIcon size={22} aria-hidden="true" />
            <span>
              <b>Download APK</b>
              <small>{android.assetName || 'Latest release on GitHub'}</small>
            </span>
          </a>
          <a className="act" href={GITHUB_ANDROID + '/releases'} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={22} aria-hidden="true" />
            <span>
              <b>All releases on GitHub</b>
              <small>github.com/magicsk/Transi</small>
            </span>
          </a>
          <a className="act" href={GITHUB_ANDROID} target="_blank" rel="noopener noreferrer">
            <Code size={22} aria-hidden="true" />
            <span>
              <b>Source code</b>
              <small>GPL-3.0, contributions welcome</small>
            </span>
          </a>
        </div>

        <div className="term ios" id="install-ios">
          <div className="th">
            <AppIcon />
            <div>
              <h3>iOS</h3>
              <p>{version(ios)}SwiftUI, iOS 16 or later</p>
            </div>
          </div>
          <p className="tp">
            Install via AltStore or SideStore for automatic updates, or sideload the IPA manually.
          </p>
          <a className="act main" href={ALTSTORE_INSTALL}>
            <SquarePlus size={22} aria-hidden="true" />
            <span>
              <b>Add to AltStore</b>
              <small>Auto-updates via AltStore</small>
            </span>
          </a>
          <a className="act" href={SIDESTORE_INSTALL}>
            <SquarePlus size={22} aria-hidden="true" />
            <span>
              <b>Add to SideStore</b>
              <small>Alternative to AltStore</small>
            </span>
          </a>
          <a className="act" href={ios.downloadUrl || GITHUB_IOS + '/releases/latest'}>
            <DownloadIcon size={22} aria-hidden="true" />
            <span>
              <b>Download IPA manually</b>
              <small>{ios.assetName || 'Latest release on GitHub'}</small>
            </span>
          </a>
          <button type="button" className="act" onClick={copy}>
            <Copy size={22} aria-hidden="true" />
            <span>
              <b aria-live="polite">{copied ? 'Copied' : 'Copy source URL'}</b>
              <small className="src">{ALTSTORE_REPO}</small>
            </span>
          </button>
          <a className="act" href={GITHUB_IOS} target="_blank" rel="noopener noreferrer">
            <Code size={22} aria-hidden="true" />
            <span>
              <b>Source code</b>
              <small>GPL-3.0, contributions welcome</small>
            </span>
          </a>
        </div>
      </div>
    </>
  )
}
