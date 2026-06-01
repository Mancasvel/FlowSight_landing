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
import { MacWaitlistModal } from '@/components/MacWaitlistModal'
import {
  DownloadUpdatesModal,
  type DownloadUpdateSource,
} from '@/components/DownloadUpdatesModal'

type DownloadActionsContextValue = {
  platform: DetectedPlatform
  downloadLabel: string
  linuxHasAssets: boolean
  downloadForPlatform: () => void
  downloadFile: (url: string | undefined, trackKey: DownloadUpdateSource) => void
  openMacWaitlist: () => void
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
  const { downloadUrls, linuxReleaseUrl } = release
  const linuxHasAssets = Boolean(downloadUrls.linuxDeb || downloadUrls.linuxAppImage)

  const [platform, setPlatform] = useState<DetectedPlatform>('unknown')
  const [macModalOpen, setMacModalOpen] = useState(false)
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

  useEffect(() => {
    if (window.location.hash === '#download-mac') {
      setMacModalOpen(true)
    }
  }, [])

  const downloadFile = useCallback((url: string | undefined, trackKey: DownloadUpdateSource) => {
    if (!url) return
    trackDownloadClick(trackKey)
    triggerDownload(url)
    setUpdatesModal({ open: true, source: trackKey })
  }, [])

  const openMacWaitlist = useCallback(() => {
    trackDownloadClick('download-macos')
    setMacModalOpen(true)
  }, [])

  const openLinuxRelease = useCallback(() => {
    trackDownloadClick('download-linux-deb')
    window.open(linuxReleaseUrl, '_blank', 'noopener,noreferrer')
  }, [linuxReleaseUrl])

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

  const downloadForPlatform = useCallback(() => {
    switch (platform) {
      case 'windows':
        downloadFile(downloadUrls.windowsExe, 'download-windows')
        break
      case 'macos':
        openMacWaitlist()
        break
      case 'linux':
        downloadLinux()
        break
      default:
        scrollToDownloadSection()
        break
    }
  }, [downloadFile, downloadLinux, downloadUrls.windowsExe, openMacWaitlist, platform])

  const value = useMemo<DownloadActionsContextValue>(
    () => ({
      platform,
      downloadLabel: downloadLabelForPlatform(platform),
      linuxHasAssets,
      downloadForPlatform,
      downloadFile,
      openMacWaitlist,
    }),
    [downloadFile, downloadForPlatform, linuxHasAssets, openMacWaitlist, platform]
  )

  return (
    <DownloadActionsContext.Provider value={value}>
      {children}
      <MacWaitlistModal isOpen={macModalOpen} onClose={() => setMacModalOpen(false)} />
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
