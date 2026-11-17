import { Fragment } from 'react'
import Shot, { screenshot } from '@/components/Shot'

const BOTH = ['iOS', 'Android']

interface Minor {
  title: string
  on: string[]
  text: string
}

interface Stop {
  id: string // the nav links to these
  title: string
  text: string
  shots: { name: string; caption: string }[] // name: path under /public/screenshots, without -dark/-light.webp
  minors?: Minor[]
}

// The main stops on the route, in order. Smaller features hang off the stop they belong to.
const stops: Stop[] = [
  {
    id: 'departures',
    title: 'Departure board',
    text: 'Live departures for any stop, with real-time delays and vehicle details. Keep favourite stops and set a default one; on iOS, swipe a stop to favourite it. On Android the board also merges in regional buses and shows service info.',
    shots: [
      { name: 'ios/virtual-table', caption: 'iOS' },
      { name: 'android/virtual-table', caption: 'Android' },
    ],
    minors: [
      {
        title: 'Live departure notifications',
        on: BOTH,
        text: 'On Android, “Notify me” pins a live notification that keeps updating with the app closed, shown as a Live Update on Android 16 and later. On iOS it is a Live Activity, with Dynamic Island.',
      },
    ],
  },
  {
    id: 'planner',
    title: 'Trip planner',
    text: 'Plan a journey with routes from two sources. Leave now or plan for an arrival time, and swipe between your recent searches.',
    shots: [
      { name: 'ios/trip-planner', caption: 'iOS' },
      { name: 'android/trip-planner', caption: 'Android' },
    ],
    minors: [
      {
        title: 'Journey details on a map',
        on: BOTH,
        text: 'Every stop, platform, zone border, transfer time and live delay. On iOS, rides are drawn along the real roads and tracks.',
      },
      {
        title: 'IDS BK season pass',
        on: BOTH,
        text: 'Set your pass in Settings and trip details tell you whether it covers the trip, or which ticket to buy.',
      },
    ],
  },
  {
    id: 'trip',
    title: 'Start a trip',
    text: 'Follow a trip step by step. Transi alerts you when to get off or change, warns you when you may miss a connection, and offers other options when you do. On iOS the trip shows on the map and as a Live Activity, follows your location and tells you how far your stop is. On Android it runs in a live notification.',
    shots: [
      { name: 'ios/trip', caption: 'iOS' },
      { name: 'android/trip', caption: 'Android' },
    ],
  },
  {
    id: 'timetables',
    title: 'Timetables',
    text: 'Full timetables for every line. Pick a date, direction and trip, or see a stop’s whole day, hour by hour.',
    shots: [
      { name: 'ios/timetables', caption: 'iOS' },
      { name: 'android/timetable', caption: 'Android' },
    ],
    minors: [
      {
        title: 'Offline',
        on: BOTH,
        text: 'Download timetables and plan trips without a connection. On iOS, offline timetables are marked beta and the offline planner alpha.',
      },
    ],
  },
  {
    id: 'map',
    title: 'Map',
    text: 'Every stop on one map, with live departures and directions. On Android, transi:// links open stops, lines and the map directly.',
    shots: [
      { name: 'ios/map', caption: 'iOS' },
      { name: 'android/map', caption: 'Android' },
    ],
    minors: [{ title: 'iPad', on: ['iOS'], text: 'Transi runs on iPad as well.' }],
  },
]

const Platforms = ({ on }: { on: string[] }) =>
  on.map((p) => (
    <span className="pf" key={p}>
      {p}
    </span>
  ))

// Stops alternate between the middle lane ("even": phones left, text right) and the left lane ("odd"),
// starting in the middle. The last stop always takes the left lane, so the line runs down the left edge
// into the terminals and iOS branches off across the page.
const lane = (i: number) => (i % 2 === 0 && i < stops.length - 1 ? 'even' : 'odd')

/**
 * The route. Each .swing is the room where the red line crosses to the next stop's lane; the line itself
 * is drawn by <Route /> from where the .dot and .swing elements end up.
 */
export default function Features() {
  return (
    <div className="route" id="features">
      <div className="head">
        <h2>What’s inside</h2>
        <p className="s-lede">
          Five main stops, with smaller ones along the way. The badges show which platform each one
          runs on.
        </p>
      </div>
      {stops.map((stop, i) => {
        const even = lane(i) === 'even'
        const swing = i < stops.length - 1 && lane(i + 1) !== lane(i) && <div className="swing" />
        const text = (
          <div className="txt">
            <i className="dot" />
            <h3>{stop.title}</h3>
            <div className="xc">
              <Platforms on={BOTH} />
            </div>
            <p>{stop.text}</p>
            {stop.minors?.map((m) => (
              <div className="minor" key={m.title}>
                <h3>
                  {m.title} <Platforms on={m.on} />
                </h3>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
        )
        const shots = (
          <div className="shots">
            {stop.shots.map((s) => (
              <figure key={s.caption}>
                <div className="phone">
                  <Shot
                    {...screenshot(s.name)}
                    alt={`${stop.title}: ${s.caption}`}
                    sizes="(max-width: 900px) 45vw, 212px"
                  />
                </div>
                <figcaption>{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        )
        return (
          <Fragment key={stop.id}>
            {even ? (
              <section className="stop even" id={stop.id}>
                {text}
                {shots}
              </section>
            ) : (
              <section className="stop odd" id={stop.id}>
                <div>
                  {text}
                  {swing}
                </div>
                {shots}
              </section>
            )}
            {even && swing}
          </Fragment>
        )
      })}
    </div>
  )
}
