'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Mark from '@/components/Mark'

// The route in miniature: one station per main stop (ids from Features.tsx), Install as the terminus.
const STATIONS = [
  ['departures', 'Departures'],
  ['planner', 'Planner'],
  ['trip', 'Start a trip'],
  ['timetables', 'Timetables'],
  ['map', 'Map'],
  ['install', 'Install'],
]

export default function Navbar() {
  const stripRef = useRef<HTMLElement>(null)

  // The stretch of line up to the hovered, focused or current station thickens and its stations fill in
  // (all CSS, driven by --p and the .on class). "Current" is whichever stop is at mid-screen, the same
  // height the tram rides at.
  useEffect(() => {
    const strip = stripRef.current!
    const links = [...strip.querySelectorAll('a')]
    let current = -1

    const show = (i: number) => {
      const c = links.map((a) => a.offsetLeft + a.offsetWidth / 2)
      const w = c[c.length - 1] - c[0]
      strip.style.setProperty('--x0', c[0] + 'px')
      strip.style.setProperty('--w', w + 'px')
      strip.style.setProperty('--p', String(i > 0 && w > 0 ? (c[i] - c[0]) / w : 0))
      links.forEach((a, j) => {
        a.classList.toggle('on', j <= i)
        a.style.setProperty('--d', (i >= 0 ? j * 45 : 0) + 'ms') // stations fill in one after another
        if (j === current) a.setAttribute('aria-current', 'location')
        else a.removeAttribute('aria-current')
      })
    }
    const rest = () => show(current)
    const enter = links.map((_, i) => () => show(i))
    links.forEach((a, i) => {
      a.addEventListener('mouseenter', enter[i])
      a.addEventListener('focus', enter[i])
      a.addEventListener('mouseleave', rest)
      a.addEventListener('blur', rest)
    })
    window.addEventListener('resize', rest)
    document.fonts.ready.then(rest)
    rest()

    // What is at mid-screen. The hero and the heading count as "before the first stop";
    // between stops the last one stays current.
    const seen: boolean[] = []
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (seen[+(e.target as HTMLElement).dataset.spy!] = e.isIntersecting))
        for (let k = links.length; k >= 0; k--)
          if (seen[k]) {
            current = k - 1
            break
          }
        if (!strip.matches(':hover') && !strip.contains(document.activeElement)) rest()
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    const watch = (selector: string, station: number) => {
      const el = document.querySelector<HTMLElement>(selector)
      if (!el) return
      el.dataset.spy = String(station + 1)
      spy.observe(el)
    }
    watch('.hero', -1)
    watch('.head', -1)
    STATIONS.forEach(([id], i) => watch('#' + id, i))
    watch('.inst', STATIONS.length - 1)

    return () => {
      links.forEach((a, i) => {
        a.removeEventListener('mouseenter', enter[i])
        a.removeEventListener('focus', enter[i])
        a.removeEventListener('mouseleave', rest)
        a.removeEventListener('blur', rest)
      })
      window.removeEventListener('resize', rest)
      spy.disconnect()
    }
  }, [])

  return (
    <>
      {/* On wide screens the nav is sticky with no bar: this fades the page colour out behind it instead */}
      <div className="navfade" aria-hidden="true" />
      <header className="nav">
        <a className="brand" href="#">
          <Mark className="mark" />
          Transi
        </a>
        <nav className="strip" aria-label="Stops on this page" ref={stripRef}>
          <i className="track" />
          <i className="prog" />
          {STATIONS.map(([id, label], i) => (
            <a href={'#' + id} key={id} style={{ '--i': i } as CSSProperties}>
              <span>{label}</span>
            </a>
          ))}
        </nav>
        {/* phones have no strip: this is their way to the install cards, and it stays put */}
        <a className="go" href="#install">
          Install
        </a>
      </header>
    </>
  )
}
