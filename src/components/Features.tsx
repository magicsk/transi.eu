import { Fragment } from 'react'
import Shot, { screenshot } from '@/components/Shot'

interface Minor {
  title: string
  only?: 'iOS' | 'Android' // badged only when it's on one platform; everything else runs on both
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
    text: 'Live departures for any stop, with real-time delays and vehicle details. Save favorite stops and set a default. On Android the board also shows regional buses and service info.',
    shots: [
      { name: 'ios/virtual-table', caption: 'iOS' },
      { name: 'android/virtual-table', caption: 'Android' },
    ],
    minors: [
      {
        title: 'Live departure notifications',
        text: 'Keep a departure on the lock screen: a Live Activity with Dynamic Island on iOS, a live notification on Android (a Live Update on Android 16 and later).',
      },
    ],
  },
  {
    id: 'planner',
    title: 'Trip planner',
    text: 'Routes from two sources. Leave now or arrive by a set time, and swipe between recent searches.',
    shots: [
      { name: 'ios/trip-planner', caption: 'iOS' },
      { name: 'android/trip-planner', caption: 'Android' },
    ],
    minors: [
      {
        title: 'Journey details on a map',
        text: 'Every stop, platform, zone border, transfer and live delay. On iOS, rides follow the real roads and tracks.',
      },
      {
        title: 'IDS BK season pass',
        text: 'Set your pass once and every trip tells you whether it’s covered, or which ticket to buy.',
      },
    ],
  },
  {
    id: 'trip',
    title: 'Start a trip',
    text: 'Transi tells you when to get off or change, warns you before you miss a connection and offers other options if you do. On iOS the trip follows your location on the map and in a Live Activity; on Android it runs in a live notification.',
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
        text: 'Download timetables and plan trips without a connection. On iOS, timetables are in beta and the planner in alpha.',
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
    minors: [{ title: 'iPad', only: 'iOS', text: 'Transi runs on iPad as well.' }],
  },
]

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
          Five main stops, with smaller ones along the way. Everything runs on iOS and Android
          unless it says otherwise.
        </p>
      </div>
      {stops.map((stop, i) => {
        const even = lane(i) === 'even'
        const swing = i < stops.length - 1 && lane(i + 1) !== lane(i) && <div className="swing" />
        const text = (
          <div className="txt">
            <i className="dot" />
            <h3>{stop.title}</h3>
            <p>{stop.text}</p>
            {stop.minors?.map((m) => (
              <div className="minor" key={m.title}>
                <h3>
                  {m.title} {m.only && <span className="pf">{m.only}</span>}
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
                    sizes="(max-width: 900px) min(45vw, 240px), 212px"
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
