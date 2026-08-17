"use client";

import { motion } from "framer-motion";
import { Apple, Download, Monitor, Terminal } from "lucide-react";
import type { AgentRelease } from "@/lib/downloads";
import { trackDownloadClick } from "@/lib/trackDownloadClick";
import { useDownloadActions } from "@/context/DownloadActionsContext";

type Props = {
    release: AgentRelease;
};

export function DownloadSectionContent({ release }: Props) {
    const {
        desktopTag,
        macTag,
        linuxTag,
        macReleaseUrl,
        linuxReleaseUrl,
        version,
        macVersion,
        linuxVersion,
        downloadUrls,
    } = release;
    const macDisplayVersion = macVersion ?? version;
    const linuxDisplayVersion = linuxVersion ?? version;
    const macHasAssets = Boolean(downloadUrls.macDmgAarch64 || downloadUrls.macDmgX64);
    const linuxHasAssets = Boolean(downloadUrls.linuxDeb || downloadUrls.linuxAppImage);
    const { downloadFile } = useDownloadActions();

    return (
        <section id="download" className="py-24 overflow-hidden relative">
            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-3xl md:text-5xl font-bold mb-6 text-secondary-navy"
                    >
                        Download FlowSight.{" "}
                        <span className="bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent">Start protecting your focus in 2 minutes.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 text-lg max-w-2xl mx-auto"
                    >
                        Lightweight desktop agent. Works on Windows, macOS, and Linux.
                        <span className="mt-1 block">No account required for Free.</span>
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Windows */}
                    <motion.div
                        id="download-windows"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center hover:border-slate-300 hover:shadow-xl shadow-lg transition-all"
                    >
                        <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-6">
                            <Monitor className="text-blue-500 w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary-navy mb-2">Windows</h3>
                        <p className="text-slate-500 mb-8">Requires Windows 10 or 11 (64-bit)</p>
                        <button
                            type="button"
                            onClick={() => downloadFile(downloadUrls.windowsExe, "download-windows")}
                            className="w-full py-4 bg-gradient-to-r from-primary-cyan to-primary-teal hover:from-primary-teal hover:to-primary-cyan text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all group shadow-md hover:shadow-lg"
                        >
                            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                            Download for Windows
                        </button>
                        <p className="mt-4 text-xs text-slate-400">v{version} • .exe installer • release {desktopTag}</p>
                    </motion.div>

                    {/* macOS */}
                    <motion.div
                        id="download-mac"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center hover:border-slate-300 hover:shadow-xl shadow-lg transition-all"
                    >
                        <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mb-6">
                            <Apple className="text-slate-700 w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary-navy mb-2">macOS</h3>
                        <p className="text-slate-500 mb-6">
                            {downloadUrls.macDmgAarch64 && downloadUrls.macDmgX64
                                ? 'macOS 13+ · Apple Silicon and Intel'
                                : downloadUrls.macDmgX64
                                  ? 'macOS 13+ · Intel'
                                  : 'macOS 13+ · Apple Silicon (M1 / M2 / M3 / M4)'}
                        </p>
                        {macHasAssets ? (
                            <>
                                {downloadUrls.macDmgAarch64 ? (
                                    <button
                                        type="button"
                                        onClick={() => downloadFile(downloadUrls.macDmgAarch64, "download-macos")}
                                        className={`w-full py-4 bg-gradient-to-r from-primary-cyan to-primary-teal hover:from-primary-teal hover:to-primary-cyan text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all group shadow-md hover:shadow-lg${downloadUrls.macDmgX64 ? ' mb-3' : ''}`}
                                    >
                                        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                        Download Apple Silicon
                                    </button>
                                ) : null}
                                {downloadUrls.macDmgX64 ? (
                                    <button
                                        type="button"
                                        onClick={() => downloadFile(downloadUrls.macDmgX64, "download-macos-intel")}
                                        className={
                                            downloadUrls.macDmgAarch64
                                                ? 'w-full py-3 text-sm text-secondary-navy rounded-xl font-medium flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 transition-colors'
                                                : 'w-full py-4 bg-gradient-to-r from-primary-cyan to-primary-teal hover:from-primary-teal hover:to-primary-cyan text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all group shadow-md hover:shadow-lg'
                                        }
                                    >
                                        <Download className={downloadUrls.macDmgAarch64 ? 'w-4 h-4' : 'w-5 h-5 group-hover:translate-y-0.5 transition-transform'} />
                                        {downloadUrls.macDmgAarch64 ? 'Intel Mac (.dmg)' : 'Download for Intel Mac'}
                                    </button>
                                ) : null}
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                                    macOS binaries for {macTag} are not attached to the GitHub release yet. Open the release page to download when CI finishes.
                                </p>
                                <a
                                    href={macReleaseUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackDownloadClick("download-macos")}
                                    className="w-full py-4 bg-gradient-to-r from-primary-cyan to-primary-teal hover:from-primary-teal hover:to-primary-cyan text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all group shadow-md hover:shadow-lg"
                                >
                                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                    View release on GitHub
                                </a>
                            </>
                        )}
                        <p className="mt-4 text-xs text-slate-400">v{macDisplayVersion} • .dmg installer • release {macTag}</p>
                    </motion.div>

                    {/* Linux */}
                    <motion.div
                        id="download-linux"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center hover:border-slate-300 hover:shadow-xl shadow-lg transition-all"
                    >
                        <div className="w-16 h-16 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mb-6">
                            <Terminal className="text-orange-600 w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary-navy mb-2">Linux</h3>
                        <p className="text-slate-500 mb-6">Ubuntu 22.04+, Fedora 40+, or Debian 12 (amd64)</p>
                        {linuxHasAssets ? (
                            <>
                                {downloadUrls.linuxDeb ? (
                                    <button
                                        type="button"
                                        onClick={() => downloadFile(downloadUrls.linuxDeb, "download-linux-deb")}
                                        className={`w-full py-4 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all group shadow-md hover:shadow-lg${downloadUrls.linuxAppImage ? ' mb-3' : ''}`}
                                    >
                                        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                        Download .deb
                                    </button>
                                ) : null}
                                {downloadUrls.linuxAppImage ? (
                                    <button
                                        type="button"
                                        onClick={() => downloadFile(downloadUrls.linuxAppImage, "download-linux-appimage")}
                                        className={
                                            downloadUrls.linuxDeb
                                                ? 'w-full py-3 text-sm text-secondary-navy rounded-xl font-medium flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 transition-colors'
                                                : 'w-full py-4 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all group shadow-md hover:shadow-lg'
                                        }
                                    >
                                        <Download className={downloadUrls.linuxDeb ? 'w-4 h-4' : 'w-5 h-5 group-hover:translate-y-0.5 transition-transform'} />
                                        {downloadUrls.linuxDeb ? 'AppImage (portable)' : 'Download AppImage'}
                                    </button>
                                ) : null}
                            </>
                        ) : (
                            <a
                                href={linuxReleaseUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackDownloadClick("download-linux-deb")}
                                className="w-full py-4 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all group shadow-md hover:shadow-lg"
                            >
                                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                Download for Linux
                            </a>
                        )}
                        <p className="mt-4 text-xs text-slate-400">v{linuxDisplayVersion} • .deb or AppImage • release {linuxTag}</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
