import { DownloadSectionContent } from "./DownloadSectionContent";
import type { AgentRelease } from "@/lib/downloads";
import { getLatestAgentRelease } from "@/lib/downloads.server";

type Props = {
    release?: AgentRelease;
};

/**
 * Server Component wrapper. Resolves the current desktop-agent release at
 * request time (cached for 1h via Next's Data Cache) unless `release` is
 * passed from a parent that already fetched it.
 */
export async function DownloadSection({ release }: Props = {}) {
    const resolvedRelease = release ?? (await getLatestAgentRelease());
    return <DownloadSectionContent release={resolvedRelease} />;
}
