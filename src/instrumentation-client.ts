import * as Bugsink from '@sentry/browser'

// Bugsink (errors) and Plausible (visits), production only. Both go through same-origin paths that Caddy
// forwards to bs.magicsk.eu and pl.magicsk.eu (nixos repo, homelab/services/websites/observability.nix), so
// uBlock Origin's default lists don't drop them: they block Bugsink's own ?sentry_key= URL.
if (process.env.NODE_ENV === 'production') {
  Bugsink.init({ dsn: 'https://fe3d59be36eb4aae8f0b6ce22d6c29c1@bs.magicsk.eu/3', tunnel: '/a/r/3' })

  const plausible = document.createElement('script')
  plausible.defer = true
  plausible.src = '/j/ps.js'
  plausible.dataset.domain = 'transi.eu'
  plausible.dataset.api = '/a/e'
  document.head.append(plausible)
}
