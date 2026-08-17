'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AgentRelease } from '@/lib/downloads'
import {
  detectPlatform,
  downloadLabelForPlatform,
  type DetectedPlatform,
} from '@/lib/detectPlatform'
import { trackDownloadClick } from '@/lib/trackDownloadClick'
import { triggerDownload } from '@/lib/triggerDownload'
import {
  DownloadUpdatesModal,
  type DownloadUpdateSource,
} from '@/components/DownloadUpdatesModal'

type DownloadActionsContextValue = {
  platform: DetectedPlatform
  downloadLabel: string
  linuxHasAssets: boolean
  macHasAssets: boolean
  downloadForPlatform: () => void
  downloadFile: (url: string | undefined, trackKey: DownloadUpdateSource) => void
}

const DownloadActionsContext = createContext<DownloadActionsContextValue | null>(null)

function scrollToDownloadSection() {
  document.getElementById('download')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

type Props = {
  release: AgentRelease
  children: ReactNode
}

export function DownloadActionsProvider({ release, children }: Props) {
  const { downloadUrls, linuxReleaseUrl, macReleaseUrl } = release
  const linuxHasAssets = Boolean(downloadUrls.linuxDeb || downloadUrls.linuxAppImage)
  const macHasAssets = Boolean(downloadUrls.macDmgAarch64 || downloadUrls.macDmgX64)

  const [platform, setPlatform] = useState<DetectedPlatform>('unknown')
  const [updatesModal, setUpdatesModal] = useState<{
    open: boolean
    source: DownloadUpdateSource
  }>({
    open: false,
    source: 'download-windows',
  })

  useEffect(() => {
    setPlatform(detectPlatform())
  }, [])

  const downloadFile = useCallback((url: string | undefined, trackKey: DownloadUpdateSource) => {
    if (!url) return
    trackDownloadClick(trackKey)
    triggerDownload(url)
    setUpdatesModal({ open: true, source: trackKey })
  }, [])

  const openLinuxRelease = useCallback(() => {
    trackDownloadClick('download-linux-deb')
    window.open(linuxReleaseUrl, '_blank', 'noopener,noreferrer')
  }, [linuxReleaseUrl])

  const openMacRelease = useCallback(() => {
    trackDownloadClick('download-macos')
    window.open(macReleaseUrl, '_blank', 'noopener,noreferrer')
  }, [macReleaseUrl])

  const downloadLinux = useCallback(() => {
    if (linuxHasAssets) {
      const url = downloadUrls.linuxDeb ?? downloadUrls.linuxAppImage
      const trackKey: DownloadUpdateSource = downloadUrls.linuxDeb
        ? 'download-linux-deb'
        : 'download-linux-appimage'
      downloadFile(url, trackKey)
      return
    }
    openLinuxRelease()
  }, [downloadFile, downloadUrls.linuxAppImage, downloadUrls.linuxDeb, linuxHasAssets, openLinuxRelease])

  const downloadMac = useCallback(() => {
    if (macHasAssets) {
      const url = downloadUrls.macDmgAarch64 ?? downloadUrls.macDmgX64
      const trackKey: DownloadUpdateSource = downloadUrls.macDmgAarch64
        ? 'download-macos'
        : 'download-macos-intel'
      downloadFile(url, trackKey)
      return
    }
    openMacRelease()
  }, [downloadFile, downloadUrls.macDmgAarch64, downloadUrls.macDmgX64, macHasAssets, openMacRelease])

  const downloadForPlatform = useCallback(() => {
    switch (platform) {
      case 'windows':
        downloadFile(downloadUrls.windowsExe, 'download-windows')
        break
      case 'macos':
        downloadMac()
        break
      case 'linux':
        downloadLinux()
        break
      default:
        scrollToDownloadSection()
        break
    }
  }, [downloadFile, downloadLinux, downloadMac, downloadUrls.windowsExe, platform])

  const value = useMemo<DownloadActionsContextValue>(
    () => ({
      platform,
      downloadLabel: downloadLabelForPlatform(platform),
      linuxHasAssets,
      macHasAssets,
      downloadForPlatform,
      downloadFile,
    }),
    [downloadFile, downloadForPlatform, linuxHasAssets, macHasAssets, platform]
  )

  return (
    <DownloadActionsContext.Provider value={value}>
      {children}
      <DownloadUpdatesModal
        isOpen={updatesModal.open}
        source={updatesModal.source}
        onClose={() => setUpdatesModal((prev) => ({ ...prev, open: false }))}
      />
    </DownloadActionsContext.Provider>
  )
}

export function useDownloadActions(): DownloadActionsContextValue {
  const ctx = useContext(DownloadActionsContext)
  if (!ctx) {
    throw new Error('useDownloadActions must be used within DownloadActionsProvider')
  }
  return ctx
}
