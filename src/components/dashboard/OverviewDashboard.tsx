'use client'

import Link from 'next/link'
import {
  Card, CardBody, CardHeader, CircularProgress, Chip, Avatar, Progress, Tooltip, Alert,
} from '@/components/ui'
import {
  LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Area,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Minus, ArrowRight, Timer, Flame, AlertTriangle,
  Clock, Zap, DollarSign,
} from 'lucide-react'
import { getMetaCategory, META_CATEGORY_CONFIG } from '@/lib/categories'
import type { FlowStateData, ContextLoadData, PlanningData, MeetingsData, WorkflowData } from '@/lib/types/dashboard'
import { TeamFlowScoreTooltipBody } from '@/components/dashboard/flow-state/TeamFlowScoreTooltipBody'

type Props = {
  flow: FlowStateData
  context: ContextLoadData
  planning: PlanningData
  meetings: MeetingsData
  workflow: WorkflowData
}

function scoreColor(s: number): 'success' | 'warning' | 'danger' {
  if (s >= 70) return 'success'
  if (s >= 45) return 'warning'
  return 'danger'
}

function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
    >
      {label}
      <ArrowRight size={12} />
    </Link>
  )
}

export default function OverviewDashboard({ flow, context, planning, meetings, workflow }: Props) {
  const { teamFlowScore, trend30d, members: flowMembers, teamFlowScoreBreakdown } = flow
  const { members: contextMembers } = context
  const { sprints, costBreakdown } = planning
  const { impact } = meetings

  const workflowByUser = new Map(workflow.members.map((m) => [m.userId, m]))

  const last7 = trend30d.slice(-7)
  const trendDiff = (last7[last7.length - 1]?.score ?? 0) - (last7[0]?.score ?? 0)
  const trendLabel = trendDiff > 5 ? 'Improving' : trendDiff < -5 ? 'Declining' : 'Stable'
  const trendColor = trendDiff > 5 ? 'success' : trendDiff < -5 ? 'danger' : 'warning'
  const TrendIcon = trendDiff > 5 ? TrendingUp : trendDiff < -5 ? TrendingDown : Minus

  const atRisk = contextMembers.filter((m) => m.burnoutLevel === 'danger').length
  const warningCount = contextMembers.filter((m) => m.burnoutLevel === 'warning').length

  const avgRecovery = flowMembers.length > 0
    ? Math.round(flowMembers.reduce((s, m) => s + m.recoveryTimeAvg, 0) / flowMembers.length)
    : 0
  const avgStreak = flowMembers.length > 0
    ? Math.round(flowMembers.reduce((s, m) => s + m.longestStreakMin, 0) / flowMembers.length * 10) / 10
    : 0

  const latestSprint = sprints[sprints.length - 1] ?? null

  return (
    <div className="space-y-6 2xl:space-y-8">
      <div>
        <h1 className="text-xl 2xl:text-2xl font-semibold text-zinc-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Team health at a glance · {flowMembers.length} members
        </p>
      </div>

      {/* Row 1: Flow Score + Trend Chart + Quick KPIs */}
      <div className="grid grid-cols-1 gap-5 2xl:gap-6 xl:grid-cols-12">
        {/* Flow Score */}
        <Card className="xl:col-span-3">
          <CardBody className="flex flex-col items-center justify-center py-6 gap-3">
            <Tooltip
              wide
              content={<TeamFlowScoreTooltipBody breakdown={teamFlowScoreBreakdown} />}
            >
              <button
                type="button"
                className="cursor-help bg-transparent border-0 p-0 focus:outline-none"
                aria-label="How Team Flow Score is calculated — hover for details"
              >
                <CircularProgress value={teamFlowScore} maxValue={100} color={scoreColor(teamFlowScore)} size="lg">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-zinc-800">{teamFlowScore}</span>
                    <span className="text-lg font-semibold text-zinc-500">%</span>
                  </div>
                </CircularProgress>
              </button>
            </Tooltip>
            <Tooltip content="Same as the large ring on Flow State: team average of each person’s deep-work % today. Hover the percentage for formula and per-person deep/total seconds.">
              <p className="text-sm text-zinc-500 cursor-help border-b border-dotted border-zinc-300 inline-block">Team Flow Score</p>
            </Tooltip>
            <Chip color={trendColor}>
              <span className="flex items-center gap-1">
                <TrendIcon size={12} />
                {trendLabel}
              </span>
            </Chip>
            <SectionLink href="/dashboard/flow-state" label="Flow details" />
          </CardBody>
        </Card>

        {/* 30-Day Trend */}
        <Card className="xl:col-span-5">
          <CardHeader>
            <Tooltip
              wide
              content={
                <div className="space-y-2 text-left leading-snug">
                  <p className="font-semibold text-white text-[11px] uppercase tracking-wide">Each day on this chart</p>
                  <p className="text-[11px] text-zinc-200">
                    Average of per-session scores: every <code className="rounded bg-zinc-700/80 px-1 text-indigo-200">work_session</code> that day gets (deep ÷ total from <code className="text-indigo-200">category_breakdown</code>) × 100; we average all those session scores. Slightly different from the team ring, which averages people after pooling each person’s sessions for today.
                  </p>
                </div>
              }
            >
              <h3 className="text-sm font-medium text-zinc-800 cursor-help border-b border-dotted border-zinc-300 inline-block">
                30-Day Flow Trend
              </h3>
            </Tooltip>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trend30d} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                <defs>
                  <linearGradient id="overviewTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4361ee" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#4361ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis hide dataKey="date" />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Area type="monotone" dataKey="score" stroke="none" fill="url(#overviewTrend)" isAnimationActive={false} />
                <Line type="monotone" dataKey="score" stroke="#4361ee" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Quick KPIs */}
        <div className="xl:col-span-4 grid grid-cols-2 gap-4">
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-5 gap-1">
              <div className="rounded-xl bg-zinc-100 p-2 text-indigo-500 mb-1">
                <Timer size={18} />
              </div>
              <p className="text-xs text-zinc-500">Avg Recovery</p>
              <p className="text-xl font-bold text-zinc-800 tabular-nums">{avgRecovery}<span className="text-sm font-medium text-zinc-400">min</span></p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-5 gap-1">
              <div className="rounded-xl bg-zinc-100 p-2 text-indigo-500 mb-1">
                <Flame size={18} />
              </div>
              <p className="text-xs text-zinc-500">Best Streak</p>
              <p className="text-xl font-bold text-zinc-800 tabular-nums">{avgStreak}<span className="text-sm font-medium text-zinc-400">min</span></p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-5 gap-1">
              <div className="rounded-xl bg-zinc-100 p-2 text-indigo-500 mb-1">
                <Clock size={18} />
              </div>
              <p className="text-xs text-zinc-500">Meeting Load</p>
              <p className="text-xl font-bold text-zinc-800 tabular-nums">{impact.meetingPct}<span className="text-sm font-medium text-zinc-400">%</span></p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-5 gap-1">
              <div className="rounded-xl bg-zinc-100 p-2 text-indigo-500 mb-1">
                <DollarSign size={18} />
              </div>
              <p className="text-xs text-zinc-500">Inefficiency Cost</p>
              <p className="text-xl font-bold text-zinc-800 tabular-nums">€{costBreakdown.total.toLocaleString()}</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Row 2: Members Status + Burnout + Sprint */}
      <div className="grid grid-cols-1 gap-5 2xl:gap-6 xl:grid-cols-12">
        {/* Team Members Quick View */}
        <Card className="xl:col-span-5">
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-800">Team Today</h3>
            <SectionLink href="/dashboard/flow-state" label="Timeline" />
          </CardHeader>
          <CardBody className="space-y-3">
            {flowMembers.length === 0 ? (
              <p className="text-sm text-zinc-500">No team members found.</p>
            ) : (
              flowMembers.map((m) => {
                const color = scoreColor(m.flowScoreToday)
                const wf = workflowByUser.get(m.userId)
                const current = wf?.currentActivity ?? null
                const currentMeta = current ? getMetaCategory(current.category) : null
                const currentMetaConfig = currentMeta ? META_CATEGORY_CONFIG[currentMeta] : null
                return (
                  <div key={m.userId} className="flex items-start gap-3">
                    <Avatar src={m.avatarUrl || undefined} name={m.displayName} size="sm" className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-700 truncate">{m.displayName}</p>
                        <Chip color={color} className="shrink-0">
                          {m.flowScoreToday >= 70 ? 'Focused' : m.flowScoreToday >= 45 ? 'Mixed' : 'Low'}
                        </Chip>
                      </div>
                      {current ? (
                        <p className="text-[11px] text-zinc-500 mt-1 truncate">
                          <span
                            className="inline-block w-1.5 h-1.5 rounded-full mr-1 relative -top-px"
                            style={{ backgroundColor: currentMetaConfig?.color ?? '#94a3b8' }}
                          />
                          {current.description}
                          {current.jiraTicketId && (
                            <span className="text-zinc-400 ml-1">{current.jiraTicketId}</span>
                          )}
                        </p>
                      ) : (
                        <p className="text-[11px] text-zinc-400 mt-1">No activity today</p>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </CardBody>
        </Card>

        {/* Burnout Overview */}
        <Card className="xl:col-span-3">
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-800">Burnout Risk</h3>
            <SectionLink href="/dashboard/context-load" label="Details" />
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-center gap-6 py-2">
              <div className="text-center">
                <p className="text-3xl font-bold text-zinc-800">{atRisk}</p>
                <p className="text-xs text-red-500 font-medium">Danger</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-zinc-800">{warningCount}</p>
                <p className="text-xs text-amber-500 font-medium">Warning</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-zinc-800">{contextMembers.length - atRisk - warningCount}</p>
                <p className="text-xs text-emerald-500 font-medium">Healthy</p>
              </div>
            </div>

            {[...contextMembers]
              .sort((a, b) => b.burnoutIndex - a.burnoutIndex)
              .slice(0, 4)
              .map((m) => {
                const barColor = m.burnoutLevel === 'danger' ? 'danger' : m.burnoutLevel === 'warning' ? 'warning' : 'success'
                return (
                  <div key={m.userId} className="flex items-center gap-2">
                    <Avatar src={m.avatarUrl || undefined} name={m.displayName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-700 truncate">{m.displayName}</p>
                      <Progress value={m.burnoutIndex} maxValue={100} color={barColor} size="sm" />
                    </div>
                    <span className="text-xs text-zinc-400 tabular-nums">{m.burnoutIndex}</span>
                  </div>
                )
              })}

            {(atRisk > 0 || warningCount > 0) && (
              <Alert color={atRisk > 0 ? 'primary' : 'warning'} dismissible={false}>
                {atRisk > 0
                  ? `${atRisk} member${atRisk > 1 ? 's' : ''} showing elevated burnout signals. Review workloads.`
                  : `${warningCount} member${warningCount > 1 ? 's' : ''} approaching burnout threshold. Monitor closely.`}
              </Alert>
            )}
          </CardBody>
        </Card>

        {/* Sprint Status */}
        <Card className="xl:col-span-4">
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-800">Sprint Status</h3>
            <SectionLink href="/dashboard/planning" label="Planning" />
          </CardHeader>
          <CardBody className="space-y-4">
            {latestSprint ? (
              <>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs text-zinc-500">{latestSprint.label}</p>
                  <Chip color={latestSprint.efficiencyRatio >= 0.75 ? 'success' : latestSprint.efficiencyRatio >= 0.5 ? 'warning' : 'danger'}>
                    {Math.round(latestSprint.efficiencyRatio * 100)}% efficient
                  </Chip>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-zinc-500 mb-1">
                    <span>Delivery</span>
                    <span className="tabular-nums">{latestSprint.expectedDelivery}h / {latestSprint.committedHours}h</span>
                  </div>
                  <Progress
                    value={latestSprint.expectedDelivery}
                    maxValue={Math.max(latestSprint.committedHours, 1)}
                    color={latestSprint.efficiencyRatio >= 0.75 ? 'success' : latestSprint.efficiencyRatio >= 0.5 ? 'warning' : 'danger'}
                  />
                </div>

                {sprints.length > 1 && (
                  <div className="pt-1">
                    <p className="text-xs text-zinc-500 mb-2">Sprint history</p>
                    <ResponsiveContainer width="100%" height={80}>
                      <BarChart data={sprints.map((s) => ({ name: s.label, hours: s.actualHours, committed: s.committedHours }))} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Bar dataKey="committed" fill="transparent" stroke="#4361ee" strokeWidth={1.5} radius={[3, 3, 0, 0]} />
                        <Bar dataKey="hours" fill="#4361ee" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-zinc-500 py-4">No sprint commitment data yet.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Row 3: Meeting Impact Summary */}
      <div className="grid grid-cols-1 gap-5 2xl:gap-6 sm:grid-cols-3">
        <Card>
          <CardBody className="flex items-center gap-4 py-4">
            <div className="rounded-xl bg-zinc-100 p-2.5 text-indigo-500 shrink-0">
              <Clock size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <Tooltip content="Total hours spent in meetings this week">
                <p className="text-xs text-zinc-500 cursor-help">Meeting Time</p>
              </Tooltip>
              <p className="text-xl font-bold text-zinc-800 mt-0.5">
                {impact.totalMeetingHours}h
                <span className="text-sm font-normal text-zinc-400 ml-1.5">{impact.meetingPct}%</span>
              </p>
            </div>
            <Chip color={impact.meetingPct < 20 ? 'success' : impact.meetingPct < 35 ? 'warning' : 'danger'}>
              {impact.meetingPct < 20 ? 'Healthy' : impact.meetingPct < 35 ? 'Elevated' : 'High'}
            </Chip>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4 py-4">
            <div className="rounded-xl bg-zinc-100 p-2.5 text-indigo-500 shrink-0">
              <Zap size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <Tooltip content="Average minutes to return to deep work after a meeting">
                <p className="text-xs text-zinc-500 cursor-help">Post-Meeting Recovery</p>
              </Tooltip>
              <p className="text-xl font-bold text-zinc-800 mt-0.5">{impact.avgRecoveryMin} min</p>
            </div>
            <Chip color={impact.avgRecoveryMin < 15 ? 'success' : impact.avgRecoveryMin < 25 ? 'warning' : 'danger'}>
              {impact.avgRecoveryMin < 15 ? 'Fast' : impact.avgRecoveryMin < 25 ? 'Moderate' : 'Slow'}
            </Chip>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4 py-4">
            <div className="rounded-xl bg-zinc-100 p-2.5 text-indigo-500 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <Tooltip content="Time between meetings too short to start deep work">
                <p className="text-xs text-zinc-500 cursor-help">Wasted Fragments</p>
              </Tooltip>
              <p className="text-xl font-bold text-zinc-800 mt-0.5">{impact.wastedFragmentsHours}h</p>
            </div>
            <SectionLink href="/dashboard/meetings" label="Meetings" />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
