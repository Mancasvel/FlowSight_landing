/** Desktop agent artifacts in `public/downloadables/` (real folder — required for Vercel; symlinks break static export). */
export const AGENT_VERSION = '0.1.0' as const

const asset = (filename: string) =>
  `/downloadables/${encodeURIComponent(filename)}`

export const downloadUrls = {
  windowsExe: asset(`FlowSight.Agent_${AGENT_VERSION}_x64-setup (1).exe`),
  macDmgAarch64: asset(`FlowSight.Agent_${AGENT_VERSION}_aarch64 (1).dmg`),
  linuxDeb: asset(`FlowSight.Agent_${AGENT_VERSION}_amd64 (1).deb`),
  linuxAppImage: asset(`FlowSight.Agent_${AGENT_VERSION}_amd64 (1).AppImage`),
} as const
