/** Desktop agent artifacts in `public/downloadables/` (real folder — required for Vercel; symlinks break static export). */
export const AGENT_VERSION = '0.1.0' as const

export const downloadUrls = {
  windowsExe: `/downloadables/FlowSight.Agent_${AGENT_VERSION}_x64-setup.exe`,
  macDmgAarch64: `/downloadables/FlowSight.Agent_${AGENT_VERSION}_aarch64.dmg`,
  linuxDeb: `/downloadables/FlowSight.Agent_${AGENT_VERSION}_amd64.deb`,
  linuxAppImage: `/downloadables/FlowSight.Agent_${AGENT_VERSION}_amd64.AppImage`,
} as const
