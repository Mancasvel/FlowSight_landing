import { getLatestAgentRelease } from "@/lib/downloads.server";
import { DownloadSectionContent } from "./DownloadSectionContent";

/**
 * Server Component wrapper. Resolves the current desktop-agent release at
 * request time (cached for 1h via Next's Data Cache) and hands the URLs off
 * to the client-rendered UI. New GitHub releases propagate automatically
 * after the 1h cache window — no redeploy required.
 */
export async function DownloadSection() {
    const release = await getLatestAgentRelease();
    return <DownloadSectionContent release={release} />;
}
