'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, Check } from 'lucide-react'
import { getQuestionsForMode } from '@/lib/onboarding/questions'
import { buildDashboardFromAnswers, getWidgetLabel } from '@/lib/onboarding/buildDashboard'
import type { DashboardMode, OnboardingAnswers, OnboardingVariant } from '@/lib/onboarding/types'
import { completeOnboarding } from '@/app/dashboard/onboarding/actions'
import { saveDashboardPreferences } from '@/app/account/onboarding/actions'

type Step = 'workspace' | 'mode' | 'questions' | 'preview'

type Props = {
  variant?: OnboardingVariant
  workspaceName?: string
  teamId?: string
  planName: string
  planId: string
  maxMembers: number
  defaultMode: DashboardMode
  showSuccess: boolean
}

export default function OnboardingWizard({
  variant = 'full',
  workspaceName: initialWorkspaceName = '',
  teamId,
  planName,
  planId,
  maxMembers,
  defaultMode,
  showSuccess,
}: Props) {
  const isPreferencesOnly = variant === 'preferences-only'
  const initialStep: Step = isPreferencesOnly ? 'mode' : 'workspace'

  const [step, setStep] = useState<Step>(initialStep)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [workspaceName, setWorkspaceName] = useState(initialWorkspaceName)
  const [jiraProjectKey, setJiraProjectKey] = useState('')
  const [mode, setMode] = useState<DashboardMode>(defaultMode)
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({ mode: defaultMode })

  const questions = useMemo(() => getQuestionsForMode(mode), [mode])
  const currentQuestion = questions[questionIndex]

  const previewConfig = useMemo(() => {
    return buildDashboardFromAnswers({ mode, ...answers } as OnboardingAnswers)
  }, [mode, answers])

  const canUseTeamMode = maxMembers > 1 && planId !== 'individual_pro'

  const steps: Step[] = isPreferencesOnly
    ? ['mode', 'questions', 'preview']
    : ['workspace', 'mode', 'questions', 'preview']

  const stepNumber = steps.indexOf(step) + 1
  const progress = (stepNumber / steps.length) * 100

  function setSingleAnswer(id: keyof OnboardingAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function toggleMultiAnswer(id: keyof OnboardingAnswers, value: string) {
    setAnswers((prev) => {
      const current = (prev[id] as string[] | undefined) ?? []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [id]: next }
    })
  }

  function isQuestionAnswered(q: (typeof questions)[number]): boolean {
    const val = answers[q.id]
    if (q.type === 'multi') return Array.isArray(val) && val.length > 0
    return typeof val === 'string' && val.length > 0
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.set('preferences', JSON.stringify(previewConfig))

      if (isPreferencesOnly) {
        if (teamId) formData.set('teamId', teamId)
        await saveDashboardPreferences(formData)
      } else {
        formData.set('name', workspaceName.trim())
        formData.set('jiraProjectKey', jiraProjectKey.trim())
        await completeOnboarding(formData)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to complete onboarding')
      setSubmitting(false)
    }
  }

  function goBack() {
    if (step === 'questions' && questionIndex > 0) {
      setQuestionIndex((i) => i - 1)
      return
    }
    if (step === 'questions') {
      setStep('mode')
      return
    }
    if (step === 'preview') {
      setStep('questions')
      setQuestionIndex(questions.length - 1)
      return
    }
    if (step === 'mode' && !isPreferencesOnly) {
      setStep('workspace')
    }
  }

  function goNext() {
    if (step === 'workspace') {
      if (!workspaceName.trim()) {
        setError('Workspace name is required')
        return
      }
      setError(null)
      setStep('mode')
      return
    }
    if (step === 'mode') {
      setQuestionIndex(0)
      setStep('questions')
      return
    }
    if (step === 'questions') {
      if (!isQuestionAnswered(currentQuestion)) {
        setError('Select at least one option to continue')
        return
      }
      setError(null)
      if (questionIndex < questions.length - 1) {
        setQuestionIndex((i) => i + 1)
      } else {
        setStep('preview')
      }
      return
    }
    handleSubmit()
  }

  const stepHeadline: Record<Step, string> = {
    workspace: 'Create your workspace',
    mode: 'Who is this dashboard for?',
    questions: currentQuestion?.title ?? 'Tell us how you work',
    preview: 'Review your layout',
  }

  const stepDescription: Record<Step, string> = {
    workspace: 'Name your space and optionally link a Jira project.',
    mode: 'We will tailor metrics and sections to match your context.',
    questions: currentQuestion?.subtitle ?? 'Choose everything that applies.',
    preview: 'This is how your dashboard will be organized. You can change it later.',
  }

  const title = isPreferencesOnly ? 'Personalize your dashboard' : 'Get started'

  return (
    <div className="relative min-h-screen text-zinc-900 font-sans antialiased">
      <div
        className="pointer-events-none absolute inset-0 bg-dashboard-grid [mask-image:radial-gradient(ellipse_80%_75%_at_50%_40%,#000_25%,transparent_100%)]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10 sm:px-10 sm:py-14">
        {/* Top bar */}
        <header className="mb-10">
          <p className="text-[13px] font-medium tracking-tight text-zinc-400">FlowSight</p>
          {!isPreferencesOnly && (
            <p className="mt-8 text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              {title}
            </p>
          )}
        </header>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-[12px] text-zinc-400">
            <span>
              {stepNumber} of {steps.length}
            </span>
            {isPreferencesOnly && workspaceName && step === 'mode' && (
              <span className="truncate max-w-[50%] text-right">{workspaceName}</span>
            )}
          </div>
          <div className="mt-2 h-px w-full bg-zinc-200">
            <div
              className="h-px bg-zinc-900 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold leading-snug tracking-tight text-zinc-900">
            {stepHeadline[step]}
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-zinc-500">{stepDescription[step]}</p>
          {showSuccess && step === 'workspace' && (
            <p className="mt-3 text-[13px] text-emerald-600">Payment confirmed.</p>
          )}
        </div>

        {/* Body */}
        <div className="flex-1">
          {step === 'workspace' && (
            <div className="w-full space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-[13px] font-medium text-zinc-700">
                  Workspace name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Acme Engineering"
                  className="w-full border-0 border-b border-zinc-200 bg-transparent py-2.5 text-[15px] text-zinc-900 placeholder:text-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="jira" className="text-[13px] font-medium text-zinc-700">
                  Jira project key
                  <span className="ml-1 font-normal text-zinc-400">(optional)</span>
                </label>
                <input
                  id="jira"
                  type="text"
                  value={jiraProjectKey}
                  onChange={(e) => setJiraProjectKey(e.target.value.toUpperCase())}
                  placeholder="PROJ"
                  className="w-full border-0 border-b border-zinc-200 bg-transparent py-2.5 text-[15px] uppercase text-zinc-900 placeholder:normal-case placeholder:text-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
            </div>
          )}

          {step === 'mode' && (
            <div className="w-full space-y-2">
              <OptionCard
                selected={mode === 'individual'}
                title="Just me"
                description="Focus, meetings, and personal delivery patterns."
                onClick={() => {
                  setMode('individual')
                  setAnswers((prev) => ({ ...prev, mode: 'individual' }))
                }}
              />
              <OptionCard
                selected={mode === 'team'}
                disabled={!canUseTeamMode}
                title="My team"
                description="Workload, ceremonies, blockers, and team health."
                hint={
                  !canUseTeamMode
                    ? 'Available on team plans. Upgrade to enable.'
                    : undefined
                }
                onClick={() => {
                  setMode('team')
                  setAnswers((prev) => ({ ...prev, mode: 'team' }))
                }}
              />
            </div>
          )}

          {step === 'questions' && currentQuestion && (
            <div className="w-full space-y-2">
              {currentQuestion.options.map((opt) => {
                const isSelected =
                  currentQuestion.type === 'multi'
                    ? ((answers[currentQuestion.id] as string[] | undefined) ?? []).includes(
                        opt.value
                      )
                    : answers[currentQuestion.id] === opt.value

                return (
                  <OptionCard
                    key={opt.value}
                    selected={isSelected}
                    title={opt.label}
                    description={opt.description}
                    onClick={() =>
                      currentQuestion.type === 'multi'
                        ? toggleMultiAnswer(currentQuestion.id, opt.value)
                        : setSingleAnswer(currentQuestion.id, opt.value)
                    }
                  />
                )
              })}
            </div>
          )}

          {step === 'preview' && (
            <div className="w-full space-y-3">
              <div className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 sm:px-5 sm:py-4">
                <p className="text-[15px] font-medium text-zinc-900">{previewConfig.title}</p>
                <p className="mt-0.5 text-[13px] text-zinc-400">
                  {previewConfig.mode === 'individual' ? 'Personal' : 'Team'} ·{' '}
                  {previewConfig.sections.length} sections
                </p>
              </div>
              <div className="w-full space-y-2">
                {previewConfig.sections.map((section) => (
                  <div
                    key={section.id}
                    className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 sm:px-5 sm:py-4"
                  >
                    <p className="text-[12px] font-medium uppercase tracking-wide text-zinc-500">
                      {section.title}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {section.widgets.map((w) => (
                        <li
                          key={w}
                          className="flex w-full items-center gap-2 text-[13px] text-zinc-700"
                        >
                          <span className="h-1 w-1 shrink-0 rounded-full bg-zinc-300" />
                          {getWidgetLabel(w)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="w-full pt-1 text-[12px] leading-relaxed text-zinc-400">
                AI Coach stays your default home screen. This dashboard is always available from
                the sidebar.
              </p>
            </div>
          )}

          {error && (
            <p className="mt-4 text-[13px] text-red-600">{error}</p>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-10 space-y-4 border-t border-zinc-100 pt-6">
          <p className="text-[12px] text-zinc-400">
            {planName} · {maxMembers} {maxMembers === 1 ? 'seat' : 'seats'}
          </p>

          <div className="flex items-center gap-3">
            {stepNumber > 1 && (
              <button
                type="button"
                disabled={submitting}
                onClick={goBack}
                className="inline-flex items-center gap-1 px-1 py-2 text-[14px] font-medium text-zinc-500 transition-colors hover:text-zinc-900 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button
              type="button"
              disabled={submitting}
              onClick={goNext}
              className="ml-auto inline-flex min-w-[120px] items-center justify-center rounded-md bg-zinc-900 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              {step === 'preview'
                ? submitting
                  ? 'Saving…'
                  : isPreferencesOnly
                    ? 'Open dashboard'
                    : 'Continue'
                : 'Continue'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

function OptionCard({
  selected,
  disabled,
  title,
  description,
  hint,
  onClick,
}: {
  selected: boolean
  disabled?: boolean
  title: string
  description?: string
  hint?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`group w-full rounded-md border px-4 py-3.5 text-left transition-all ${
        selected
          ? 'border-zinc-900 bg-zinc-50'
          : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50'
      } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
            selected
              ? 'border-zinc-900 bg-zinc-900'
              : 'border-zinc-300 bg-white group-hover:border-zinc-400'
          }`}
        >
          {selected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-medium text-zinc-900">{title}</span>
          {description && (
            <span className="mt-0.5 block text-[13px] leading-snug text-zinc-500">
              {description}
            </span>
          )}
          {hint && (
            <span className="mt-1.5 block text-[12px] text-zinc-400">{hint}</span>
          )}
        </span>
      </div>
    </button>
  )
}
