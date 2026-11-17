type Pt = [number, number]

// A faint, made-up network behind the whole page: decoration, not a real map. It's drawn 1:1 on a fixed
// canvas, centred and cropped to the page (which is 6-9k px tall), so it scrolls with the content. Trunks run
// down the page and cross lines run across it, octilinear, from a fixed seed so every render is the same.
// Trains (the dashes) run along every line; a stop fills when a train reaches it, like the stops on the red
// line, and empties a while after it leaves. All of it is CSS: one keyframes for the trains and one for the
// fills, each element only gets its own delay. Where it should hold still (globals.css), it's paused, so it
// still shows a frame with trains out and some stops filled.
// It's background, so it moves in ticks, TICK times a second: trains step, fills switch on and off, and every
// delay is a whole number of ticks, so the whole network changes on the same frames and the page repaints
// TICK times a second instead of every frame.
// ponytail: a page taller than H gets no network below H; raise H if the page grows.
const W = 2400, H = 9600
const TRAIN = 640, PERIOD = 2600, SPEED = 100 // a train every PERIOD along the line, in px and px/s
const T = PERIOD / SPEED // 26s, a whole number of ticks
const TICK = 12 // ponytail: steps of SPEED / TICK = 8px; raise it for smoother trains at more repaints
const tick = (s: number) => Math.round(s * TICK) / TICK
const pct = (s: number) => ((s / T) * 100).toFixed(3) + '%' // seconds into a run, as a keyframe offset
const LIT = tick((TRAIN + 600) / SPEED) // how long a stop stays filled

let seed = 7
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const snap = (a: number, b: number) => Math.round((a + rand() * (b - a)) / 20) * 20

// Long straight runs joined by 45-degree jogs, wandering around `home` on the cross axis. A stop sits in the
// middle of each run; `at` is how far along the line it is.
function walk(home: number, across: boolean) {
  const end = (across ? W : H) + 60
  const flip = ([m, s]: Pt): Pt => (across ? [m, s] : [s, m])
  let m = -60, s = home, d = 0
  const pts: Pt[] = [[m, s]], stops: { p: Pt; at: number }[] = []
  while (m < end) {
    const run = snap(260, 900)
    stops.push({ p: flip([m + run / 2, s]), at: d + run / 2 })
    m += run
    d += run
    pts.push([m, s])
    const j = snap(60, 220) * (s > home + 80 ? -1 : s < home - 80 ? 1 : rand() < 0.5 ? -1 : 1)
    m += Math.abs(j)
    s += j
    d += Math.abs(j) * Math.SQRT2
    pts.push([m, s])
  }
  // half the lines run the other way, so trains don't all go the same direction
  const back = rand() < 0.5, len = d
  return {
    d: 'M' + (back ? [...pts].reverse() : pts).map((p) => flip(p).join(' ')).join('L'),
    stops: stops.map(({ p, at }) => ({ p, at: back ? len - at : at })),
    phase: rand() * T,
  }
}

// a negative delay, so everything is already mid-run on load
const delay = (t: number) => `${-tick(((t % T) + T) % T).toFixed(4)}s`

const LINES = [
  ...[240, 700, 1200, 1700, 2160].map((x) => walk(x, false)),
  ...Array.from({ length: 8 }, (_, i) => walk(500 + i * 1200, true)),
]

export default function Network() {
  return (
    <div className="net" aria-hidden="true">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <style>{`.net .train{stroke-dasharray:${TRAIN} ${PERIOD - TRAIN};animation-duration:${T}s;animation-timing-function:steps(${T * TICK})}.net .fill{animation-duration:${T}s}@keyframes train{to{stroke-dashoffset:-${PERIOD}}}@keyframes lit{0%{opacity:1}${pct(LIT)},100%{opacity:0}}`}</style>
        {LINES.map((l, i) => (
          <path key={i} d={l.d} />
        ))}
        {LINES.map((l, i) => (
          <path key={i} className="train" d={l.d} style={{ animationDelay: delay(l.phase) }} />
        ))}
        {LINES.flatMap((l) => l.stops).map(({ p }, k) => (
          <circle key={k} cx={p[0]} cy={p[1]} r="13" />
        ))}
        {LINES.flatMap((l, i) =>
          // the fill starts when a train's head reaches the stop: TRAIN behind its tail
          l.stops.map(({ p, at }, j) => (
            <circle key={`${i}.${j}`} className="fill" cx={p[0]} cy={p[1]} r="8" style={{ animationDelay: delay(l.phase - (at - TRAIN) / SPEED) }} />
          )),
        )}
      </svg>
    </div>
  )
}
