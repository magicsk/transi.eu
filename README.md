# Transi.eu

Landing page for [Transi](https://github.com/magicsk/Transi)/[Transi-Swift](https://github.com/magicsk/Transi-swift) — a native public transport app for Bratislava Region, available on iOS and Android.

Built with Next.js App Router and deployed as a static-ish site with hourly ISR revalidation for live release data fetched from GitHub.

## Features

- Platform-aware UI — detects iOS/Android via user-agent and reorders content accordingly
- Live release badges — latest version numbers fetched from GitHub Releases API (revalidated hourly)
- Data-driven screenshots — pulled from `screenshots.json` in each app repo, no website changes needed when screenshots update
- Dark/light mode — follows system preference via `prefers-color-scheme`, with matching favicon and logo
- Animated feature cards — 3D tilt + zoom on hover using framer-motion spring physics
- Screenshot carousel — animated transitions, platform/theme switching, thumbnail navigation

## Tech stack

|                 |                                                    |
| --------------- | -------------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org) (App Router)      |
| Language        | TypeScript 5                                       |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com)         |
| Animation       | [Framer Motion 12](https://www.framer.com/motion/) |
| Icons           | [Lucide React](https://lucide.dev)                 |
| Package manager | [pnpm](https://pnpm.io)                            |

## Development

```bash
pnpm install
pnpm dev
```

```bash
pnpm build
pnpm start
```

## Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, favicon
│   └── page.tsx            # Server component — fetches releases + screenshots
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Screenshots.tsx
│   ├── Download.tsx
│   ├── Stats.tsx
│   ├── Footer.tsx
│   └── ThemeLogo.tsx
└── lib/
    ├── github.ts           # fetchLatestRelease, fetchScreenshots
    ├── useDevicePlatform.ts
    └── useColorScheme.ts
```
