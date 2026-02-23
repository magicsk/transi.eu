export interface ReleaseInfo {
  version: string
  downloadUrl: string
  assetName: string
}

export interface ScreenshotEntry {
  label: string
  description: string
  dark: string
  light: string
}

export async function fetchLatestRelease(
  repo: string,
  ext: string,
): Promise<ReleaseInfo> {
  const fallback: ReleaseInfo = { version: '-', downloadUrl: '', assetName: '' }
  try {
    const res = await fetch(
      `https://api.github.com/repos/magicsk/${repo}/releases/latest`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return fallback
    const data = await res.json()
    const asset = (
      data.assets as Array<{ name: string; browser_download_url: string }>
    )?.find((a) => a.name.endsWith(ext))
    return {
      version: (data.tag_name as string)?.replace(/^v/, '') ?? '-',
      downloadUrl: asset?.browser_download_url ?? '',
      assetName: asset?.name ?? '',
    }
  } catch {
    return fallback
  }
}
