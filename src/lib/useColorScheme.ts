'use client'

import { useSyncExternalStore } from 'react'

function subscribe(cb: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function getSnapshot(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useColorScheme(): 'dark' | 'light' {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => 'dark',  // server snapshot
  )
}
