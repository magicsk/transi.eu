'use client'

import { useSyncExternalStore } from 'react'

export type DevicePlatform = 'ios' | 'android'

const detect = (): DevicePlatform =>
  /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent) ? 'ios' : 'android'

/**
 * Returns "ios" for Apple devices (iPhone, iPad, Mac),
 * "android" for everything else.
 * SSR snapshot defaults to "ios" to match initial server render.
 */
export function useDevicePlatform(): DevicePlatform {
  return useSyncExternalStore(
    () => () => {},  // UA never changes — subscribe is a no-op
    detect,          // client snapshot
    () => 'ios',     // server snapshot
  )
}
