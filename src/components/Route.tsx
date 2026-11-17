'use client'

import { useEffect, useRef } from 'react'
import { useDevicePlatform } from '@/lib/useDevicePlatform'
import { MARK_PATH, MARK_VIEWBOX } from '@/components/Mark'

type Pt = [number, number]

const R = 30 // one radius for every bend
const pt = (p: Pt) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)

/**
 * A polyline with a circular arc of radius R at every vertex, as SVG path data. `flat`, if given, receives
 * the tram's version of the same route: straight runs only, each corner pulled halfway in towards its arc,
 * so it is never more than about 1px off the drawn line.
 */
function rounded(P: Pt[], flat?: Pt[]) {
  let d = 'M' + pt(P[0])
  flat?.push(P[0])
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[i - 1], b = P[i], c = P[i + 1]
    let ax = b[0] - a[0], ay = b[1] - a[1], bx = c[0] - b[0], by = c[1] - b[1]
    const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by)
    if (la < 0.01 || lb < 0.01) continue
    ax /= la; ay /= la; bx /= lb; by /= lb
    const ang = Math.acos(Math.max(-1, Math.min(1, ax * bx + ay * by)))
    if (ang < 0.02) continue
    const t = Math.min(R * Math.tan(ang / 2), la / 2, lb / 2)
    const r = t / Math.tan(ang / 2)
    const sgn = ax * by - ay * bx > 0 ? 1 : -1
    const s: Pt = [b[0] - ax * t, b[1] - ay * t]
    const e: Pt = [b[0] + bx * t, b[1] + by * t]
    d += 'L' + pt(s) + 'A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 ' + (sgn > 0 ? 1 : 0) + ' ' + pt(e)
    if (flat) {
      const cx = s[0] - ay * sgn * r, cy = s[1] + ax * sgn * r // the arc's centre
      const k = (1 + r / Math.hypot(b[0] - cx, b[1] - cy)) / 2 // halfway between the corner and the arc
      flat.push([cx + (b[0] - cx) * k, cy + (b[1] - cy) * k])
    }
  }
  flat?.push(P[P.length - 1])
  return d + 'L' + pt(P[P.length - 1])
}

let introPlayed = false // the line draws itself in once per page load

/**
 * The red line and the tram on it. Nothing here is server-rendered content: the line is decoration drawn
 * from where the stops (.dot), the crossings (.swing), the small features (.minor) and the two terminals
 * (.term) end up on the page, and redrawn whenever that changes.
 *
 * The tram runs no script while scrolling, except on the level run of the iOS branch (see onward()). Its
 * height on screen comes from position: sticky, so it cannot bob against the scroll; how it follows the
 * bends sideways depends on the browser:
 *   'timeline': a scroll-driven animation moves it (Chromium, Safari 26+)
 *   'nested':   position: sticky boxes nested along the route (Firefox, which has no scroll timelines yet).
 *               Not used elsewhere: Safari's layout time explodes with nested sticky depth.
 *   '':         neither. The tram then only rides the straight phone layout and is hidden on wide screens.
 */
export default function Route() {
  const platform = useDevicePlatform()
  const platformRef = useRef(platform)
  const buildRef = useRef<() => void>(null)
  const netRef = useRef<SVGPathElement>(null)
  const rideRef = useRef<SVGPathElement>(null)
  const railsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const net = netRef.current!, ride = rideRef.current!, rails = railsRef.current!
    const main = rails.parentElement!
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
    const ScrollTimeline = (
      window as unknown as { ScrollTimeline?: new (o: { source: Element; axis: string }) => AnimationTimeline }
    ).ScrollTimeline
    const mode =
      ScrollTimeline && CSS.supports('animation-timeline: scroll()') ? 'timeline'
      : /\bGecko\/\d/.test(navigator.userAgent) ? 'nested' // Firefox and its forks; not the "like Gecko" of other engines
      : ''
    rails.dataset.mode = mode || 'none'

    // The tram is built here rather than rendered by React because lay() moves it around the DOM.
    const rail = document.createElement('div')
    rail.className = 'rail'
    const upright = document.createElement('div')
    upright.className = 'upright'
    upright.innerHTML = `<div class="badge"><svg class="mk" viewBox="${MARK_VIEWBOX}"><path d="${MARK_PATH}"/></svg></div>`
    rail.append(upright)
    rails.append(rail)
    const badge = upright.firstElementChild as HTMLElement
    const levels: { box: HTMLDivElement; pin: HTMLDivElement }[] = []
    let anim: Animation | null = null
    let park: { top: number; speed: number; way: Pt[] } | null = null, parked = ''

    // the tram past where it parked (see build): `translate`, so it adds to the badge's own transforms
    function onward() {
      let s = park ? (scrollY - park.top) * park.speed : 0, dx = 0, dy = 0
      for (let j = 1; park && j < park.way.length && s > 0; j++) {
        const a = park.way[j - 1], b = park.way[j], l = Math.hypot(b[0] - a[0], b[1] - a[1]), u = Math.min(1, s / l)
        dx = a[0] + (b[0] - a[0]) * u - park.way[0][0]
        dy = a[1] + (b[1] - a[1]) * u - park.way[0][1]
        s -= l
      }
      const t = dx || dy ? `${dx.toFixed(2)}px ${dy.toFixed(2)}px` : ''
      if (t !== parked) badge.style.translate = parked = t
    }

    // One box per straight run of V: as tall as the run, slanted with a skew to the run's slope, holding a
    // sticky child pinned at mid-screen. Each box sits inside the previous run's sticky child, so sticky
    // positioning alone carries the tram down the line, bend by bend. With a single vertical run it is
    // just a plain sticky rail.
    function lay(V: Pt[]) {
      let host: HTMLElement = rail, slope = 0
      for (let i = 0; i < V.length - 1; i++) {
        let lv = levels[i]
        if (!lv) {
          lv = levels[i] = { box: document.createElement('div'), pin: document.createElement('div') }
          lv.box.className = 'lv'
          lv.pin.className = 'pin'
          lv.box.append(lv.pin)
        }
        if (lv.box.parentNode !== host) host.append(lv.box)
        const h = V[i + 1][1] - V[i][1], t = (V[i + 1][0] - V[i][0]) / h
        lv.box.style.height = h.toFixed(3) + 'px'
        lv.box.style.transform = `matrix(1,0,${(t - slope).toFixed(5)},1,0,0)` // skews add up down the chain
        slope = t
        host = lv.pin
      }
      while (levels.length > V.length - 1) levels.pop()!.box.remove()
      if (upright.parentNode !== host) host.append(upright)
      upright.style.transform = `matrix(1,0,${(-slope).toFixed(5)},1,0,0)` // stand the badge back up
      rail.style.left = (V[0][0] + 40).toFixed(2) + 'px' // +40: .rails starts 40px left of main
      rail.style.top = V[0][1].toFixed(2) + 'px'
    }

    function build() {
      const m = main.getBoundingClientRect(), wide = innerWidth > 900
      const box = (el: Element) => {
        const r = el.getBoundingClientRect()
        return {
          el: el as HTMLElement,
          l: r.left - m.left, t: r.top - m.top, b: r.bottom - m.top,
          x: r.left - m.left + r.width / 2, y: r.top - m.top + r.height / 2,
          swing: el.className === 'swing',
        }
      }
      const way = [...main.querySelectorAll('.dot, .swing')].map(box)
      const dots = way.filter((w) => !w.swing)
      const phone = main.querySelector('.hero .phone'), route = main.querySelector('.route')
      const androidEl = main.querySelector('.term.android'), iosEl = main.querySelector('.term.ios')
      if (!dots.length || !phone || !route || !androidEl || !iosEl) return
      const P: Pt[] = []
      let x = dots[0].x, extra = '', phoneLeft = 0

      // start: on wide screens the line leaves the hero phone, runs left and turns down into the first lane
      if (wide) {
        const ph = box(phone), sy = ph.b - 56, c = 64
        P.push([ph.l + 40, sy], [x + c, sy], [x, sy + c])
        phoneLeft = ph.l
      } else P.push([x, box(route).t + 5])

      // swings carry the line over to the next stop's lane
      way.forEach((w, i) => {
        if (!w.swing || w.b - w.t < 1) return
        const nx = way.slice(i + 1).find((n) => !n.swing)?.x ?? x
        if (Math.abs(nx - x) < 1) return
        P.push([x, w.t], [nx, w.b])
        x = nx
      })

      // terminus, the same drawing for everyone: the stroke runs into Android, and iOS branches off from
      // inside it. Only the tram's route differs: it ends at the station of the visitor's platform.
      const A = box(androidEl), I = box(iosEl), so = wide ? 33 : 32
      const ax = Math.max(A.l + so, Math.min(x, 2 * A.x - A.l - so)) // Android's station sits in the lane where it can
      const ix = I.l + so
      const dA = Math.abs(ax - x), dI = Math.abs(ix - x), f = 44
      const yA = A.t - 34 - dA, yI = I.t - 34 - dI // where each route leaves the lane
      // over to the iOS station: side by side, along the top of the cards like a metro map branch (the tram
      // rides the level part by script, see park below); stacked, one 45-degree run
      const tail: Pt[] = wide
        ? [[x, I.t - 2 * f - 44], [x + f, I.t - f - 44], [ix - f, I.t - f - 44], [ix, I.t - 44], [ix, I.t]]
        : [[x, yI], [ix, I.t - 34], [ix, I.t]]
      const PA: Pt[] = [...P, ...(dA > 1 ? ([[x, yA], [ax, A.t - 34]] as Pt[]) : []), [ax, A.t]]
      const ios = platformRef.current === 'ios', yStop = ios ? I.t : A.t
      A.el.style.setProperty('--st', ax - A.l + 'px')
      I.el.style.setProperty('--st', so + 'px')
      extra += rounded([[x, Math.min(tail[0][1], dA > 1 ? yA : Infinity) - 44], ...tail])
      // small features: a tick that starts inside the line
      main.querySelectorAll('.minor').forEach((el) => {
        const mb = box(el), lane = box(el.closest('.stop')!.querySelector('.dot')!).x
        extra += 'M' + pt([lane, mb.t + 16]) + 'L' + pt([lane + (wide ? 31 : 20), mb.t + 16])
      })

      const flat: Pt[] = []
      const d = rounded(ios ? [...P, ...tail] : PA, flat) // d and flat: the visitor's own route
      net.setAttribute('d', rounded(PA) + extra)
      ride.setAttribute('d', d) // unpainted copy of the visitor's route, handy for checks

      // the stretch the tram rides: from where the line starts going down to the station
      const V: Pt[] = []
      let level = -1 // where a level run ends the ride, if one does
      for (let k = 0; k < flat.length - 1; k++) {
        const p = flat[k]
        let q = flat[k + 1]
        // level runs: the one in the hero comes before the ride; one after it (the iOS branch) ends it
        if (Math.abs(q[0] - p[0]) > 20 * (q[1] - p[1])) {
          if (!V.length) continue
          level = k
          break
        }
        if (!V.length) V.push([p[0], Math.round(p[1])])
        if (q[1] >= yStop) q = [p[0] + ((q[0] - p[0]) * (yStop - p[1])) / (q[1] - p[1]), yStop]
        // whole-pixel heights: compositors round each sticky offset, and the rounding errors would add up
        if (Math.round(q[1]) > V[V.length - 1][1]) V.push([q[0], Math.round(q[1])])
        if (q[1] >= yStop) break
      }
      if (V.length < 2) return
      const half = innerHeight / 2 - (m.top + scrollY) // + scroll position = the height of mid-screen in main
      // Sticky boxes can't carry the tram along a level run, so it parks where one starts and onward() takes it
      // the rest of the way, a pixel of line per pixel of scroll, or faster if the page would end before the
      // station. That can lag a frame, but never leaves the line: the page doesn't move under a parked tram.
      const max = document.documentElement.scrollHeight - innerHeight
      park = null
      if (level >= 0 && !calm) {
        const way = [V[V.length - 1], ...flat.slice(level)], top = V[V.length - 1][1] - half
        let len = 0
        for (let j = 1; j < way.length; j++) len += Math.hypot(way[j][0] - way[j - 1][0], way[j][1] - way[j - 1][1])
        park = { top, speed: Math.max(1, len / Math.max(1, max - top)), way }
      }
      onward()
      // on load the tram rolls in from the phone (CSS, .intro .badge)
      upright.style.setProperty('--roll', (wide ? phoneLeft - 30 - V[0][0] : 0).toFixed(0) + 'px')
      const bent = V.some((v) => Math.abs(v[0] - V[0][0]) > 1)
      rails.style.display = calm || (bent && !mode) ? 'none' : 'block'
      if (!calm) lay(mode === 'nested' ? V : [V[0], [V[0][0], V[V.length - 1][1]]])
      if (calm || !bent || mode !== 'timeline' || !ScrollTimeline || max <= 0) {
        anim?.cancel()
        anim = null
      } else {
        // sideways travel as keyframes over the page's scroll range: one keyframe per corner, straight lines between
        const xAt = (y: number) => {
          for (let j = 1; j < V.length; j++)
            if (y <= V[j][1])
              return V[j - 1][0] + (V[j][0] - V[j - 1][0]) * Math.max(0, (y - V[j - 1][1]) / (V[j][1] - V[j - 1][1]))
          return V[V.length - 1][0]
        }
        const frames: Keyframe[] = []
        let last = -1
        for (const sc of [0, ...V.map((v) => v[1] - half).filter((s) => s > 0 && s < max), max])
          if (sc / max > last) {
            last = sc / max
            frames.push({ transform: `translateX(${(xAt(sc + half) - V[0][0]).toFixed(2)}px)`, offset: last })
          }
        // on a redraw the running animation gets new keyframes; replacing it would drop the tram to its
        // start position for the frames the new one takes to begin
        if (anim) (anim.effect as KeyframeEffect).setKeyframes(frames)
        else
          anim = upright.animate(frames, {
            timeline: new ScrollTimeline({ source: document.documentElement, axis: 'block' }),
            fill: 'both',
          })
      }

      // once per load: draw the line in from the hero to the first stop, then let the rest follow.
      // The .intro class (set before first paint in layout.tsx) also holds the CSS load animations.
      const root = document.documentElement
      if (!introPlayed && root.classList.contains('intro')) {
        let len = 0
        for (let i = 0; i < flat.length - 1 && flat[i + 1][1] < dots[0].y; i++)
          len += Math.hypot(flat[i + 1][0] - flat[i][0], flat[i + 1][1] - flat[i][1])
        net.style.strokeDasharray = '30000'
        net.animate(
          [{ strokeDashoffset: 30000 }, { strokeDashoffset: 30000 - len, offset: 0.82 }, { strokeDashoffset: 0 }],
          { duration: 1100, delay: 150, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'backwards' },
        ).onfinish = () => (net.style.strokeDasharray = '')
        setTimeout(() => root.classList.remove('intro'), 2000)
      }
      introPlayed = true
    }

    buildRef.current = build
    const resized = new ResizeObserver(build) // fonts and images settling; also fires once right away
    resized.observe(main)
    window.addEventListener('resize', build)
    window.addEventListener('scroll', onward, { passive: true })

    // stops fill in once they are above the middle of the screen
    const passed = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) =>
          e.target.classList.toggle('passed', !calm && (e.isIntersecting || e.boundingClientRect.top < 0)),
        ),
      { rootMargin: '0px 0px -50% 0px' },
    )
    main.querySelectorAll('.dot').forEach((el) => passed.observe(el))

    return () => {
      resized.disconnect()
      passed.disconnect()
      window.removeEventListener('resize', build)
      window.removeEventListener('scroll', onward)
      anim?.cancel()
      rail.remove()
      buildRef.current = null
    }
  }, [])

  // The platform is only known on the client (the server renders as 'ios'), and only the end of the tram's
  // route depends on it: redraw in place rather than tearing the tram down.
  useEffect(() => {
    platformRef.current = platform
    buildRef.current?.()
  }, [platform])

  return (
    <>
      <svg className="line" aria-hidden="true">
        <path ref={netRef} />
        <path ref={rideRef} className="ride" />
      </svg>
      <div className="rails" ref={railsRef} aria-hidden="true" />
    </>
  )
}
