import type { ReleaseInfo } from '@/lib/github'
import Shot, { screenshot } from '@/components/Shot'

// "Version 1.4.1, " or nothing when GitHub could not be reached
const version = (r: ReleaseInfo) => (r.version !== '-' ? `Version ${r.version}, ` : '')

export default function Hero({ android, ios }: { android: ReleaseInfo; ios: ReleaseInfo }) {
  return (
    <div className="hero">
      <div className="hero-grid">
        <div>
          <h1>
            <span>Get on</span> <span>board.</span>
          </h1>
          <p className="tag">Plan your trip. Track your ride. Skip the waiting.</p>
          <p className="lede">
            Transi is a native iOS and Android app for Bratislava public transport: live departures,
            step-by-step trips, timetables and a map of every stop.
          </p>
          {/* The visitor's platform comes first and filled, from the data-platform attribute set before
              first paint (layout.tsx). The iOS button is rendered on both sides of Android and CSS shows one,
              so the order on screen is also the DOM order that Tab and screen readers follow. */}
          <div className="plats">
            <IosButton ios={ios} at="first" />
            <a className="pbtn android" href="#install-android">
              <AndroidIcon />
              <span>
                <b>Transi for Android</b>
                <small>{version(android)}APK download</small>
              </span>
            </a>
            <IosButton ios={ios} at="last" />
          </div>
          <p className="meta">Free and open-source under GPL-3.0. Not in the app stores.</p>
        </div>
        {/* The phone shows the visitor's platform; the other picture is display: none (same attribute). Both stay
            lazy: an eager one would be fetched even while hidden (up to 100 KB on a phone), and a lazy image on
            screen is fetched at the first layout anyway. */}
        <div className="phone">
          <Shot
            className="ios"
            {...screenshot('ios/map-departures')}
            alt="Transi on iOS: the map with live departures for a stop"
            sizes="(max-width: 900px) 250px, 300px"
          />
          <Shot
            className="android"
            {...screenshot('android/virtual-table')}
            alt="Transi on Android: live departures for a stop"
            sizes="(max-width: 900px) 250px, 300px"
          />
        </div>
      </div>
    </div>
  )
}

function IosButton({ ios, at }: { ios: ReleaseInfo; at: 'first' | 'last' }) {
  return (
    <a className={`pbtn ios ${at}`} href="#install-ios">
      <AppleIcon />
      <span>
        <b>Transi for iOS</b>
        <small>{version(ios)}AltStore or IPA</small>
      </span>
    </a>
  )
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M2.5 18.5a9.5 9.5 0 0 1 19 0zM7.8 13.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm8.4 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"
      />
      <path
        d="M7.4 10.2 5.5 6.9M16.6 10.2l1.9-3.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.16 1.26-2.14 3.76.03 2.96 2.6 3.95 2.63 3.96l-.04.1c-.18.6-.46 1.2-.8 1.8zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}
