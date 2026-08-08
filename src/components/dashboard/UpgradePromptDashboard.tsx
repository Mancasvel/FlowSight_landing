'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Paperclip, SendHorizonal, Sparkles } from 'lucide-react'
import CoachProseContent from '@/components/dashboard/CoachProseContent'

type Props = {
  displayName: string
}

export default function UpgradePromptDashboard({ displayName }: Props) {
  const greeting = displayName && displayName !== 'there' ? displayName.split(' ')[0] : 'there'

  return (
    <div className="relative -mx-4 min-h-[calc(100vh-3.5rem)] sm:-mx-6 lg:-mx-10 2xl:-mx-14">
      <div
        className="pointer-events-none absolute inset-0 bg-dashboard-grid [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,#000_20%,transparent_100%)]"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[calc(100vh-3.5rem)] flex-col px-4 pb-2 pt-1 sm:px-6 lg:px-10 2xl:px-14">
        <div className="mx-auto flex h-[calc(100vh-3.5rem-0.5rem)] w-full max-w-[42rem] min-h-0 flex-col">
          <div className="flex h-full min-h-0 w-full flex-col font-sans">
            <div className="mb-4 min-h-0 flex-1 space-y-8 overflow-y-auto dark-scrollbar">
              <div className="flex min-h-[12rem] flex-col items-center justify-center text-center">
                <Image
                  src="/flowsight_sinfondo.png"
                  alt="FlowSight"
                  width={160}
                  height={160}
                  className="mb-6"
                />
              </div>

              <article className="coach-prose w-full">
                <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 px-6 py-5">
                  <CoachProseContent
                    content={`Hi ${greeting}! Welcome to FlowSight.

You're on the **Free** plan. Upgrade to **Pro** to unlock the AI coach, personalized dashboards, proactive team insights, and weekly reports.

Choose a plan that fits your team — setup takes just a few minutes after checkout.`}
                  />
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/dashboard/pricing"
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-[14px] font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                    >
                      <Sparkles className="h-4 w-4" strokeWidth={1.75} />
                      Upgrade to Pro
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="inline-flex items-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-[14px] font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      Have a license code?
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-auto shrink-0 pb-5">
              <div
                className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/80 opacity-60 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
                aria-hidden
              >
                <div className="min-h-0 flex-1 px-5 py-4">
                  <p className="text-[14px] leading-relaxed text-zinc-400">
                    Upgrade to Pro to start chatting with the AI coach…
                  </p>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/60 px-3 py-2">
                  <span className="flex h-8 w-8 items-center justify-center text-zinc-300">
                    <Paperclip className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center text-zinc-300">
                    <SendHorizonal className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
