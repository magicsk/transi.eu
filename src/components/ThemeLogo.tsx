'use client'

import Image from 'next/image'
import { useColorScheme } from '@/lib/useColorScheme'

const LOGO_DARK = '/logo/transi-iOS-Dark-1024x1024@1x.png'
const LOGO_LIGHT = '/logo/transi-iOS-Default-1024x1024@1x.png'

interface Props {
  className?: string
}

export default function ThemeLogo({ className = 'w-8 h-8' }: Props) {
  const scheme = useColorScheme()

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <Image
        src={scheme === 'dark' ? LOGO_DARK : LOGO_LIGHT}
        alt="Transi logo"
        fill
        className="object-contain"
        sizes="64px"
      />
    </div>
  )
}
