'use client'

import { Fragment, useState } from 'react'
import type { DashboardPreferences, DashboardWidgetId } from '@/lib/onboarding/types'
import {
  getWidgetGridClass,
  WIDGET_DESCRIPTIONS,
  type PanelSize,
} from '@/lib/onboarding/dashboardLayout'
import { getWidgetLabel } from '@/lib/onboarding/buildDashboard'
import DashboardPanel from './DashboardPanel'
import WidgetRenderer, { type WidgetData } from './WidgetRenderer'

type Props = WidgetData & {
  preferences: DashboardPreferences
  memberCount: number
}

export default function PersonalizedDashboardGrid({
  preferences,
  memberCount,
  ...data
}: Props) {
  const [panelSizes, setPanelSizes] = useState<Partial<Record<DashboardWidgetId, PanelSize>>>({})

  function getSize(widget: DashboardWidgetId): PanelSize {
    return panelSizes[widget] ?? 'default'
  }

  function setSize(widget: DashboardWidgetId, size: PanelSize) {
    setPanelSizes((prev) => ({ ...prev, [widget]: size }))
  }

  return (
    <div className="relative -mx-4 min-h-[calc(100vh-3.5rem)] sm:-mx-6 lg:-mx-10 2xl:-mx-14">
      <div
        className="pointer-events-none absolute inset-0 bg-dashboard-grid [mask-image:radial-gradient(ellipse_90%_80%_at_50%_35%,#000_30%,transparent_100%)]"
        aria-hidden
      />

      <div className="relative z-10 px-4 pb-8 pt-1 sm:px-6 lg:px-10 2xl:px-14">
        <header className="mb-8">
          <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900">
            {preferences.title}
          </h1>
          <p className="mt-1 text-[13px] text-zinc-400">
            {preferences.mode === 'individual'
              ? 'Built from your workflow and visibility preferences'
              : `Team view · ${memberCount} members`}
          </p>
        </header>

        <div className="grid grid-cols-12 gap-4">
          {preferences.sections.map((section) => {
            if (section.widgets.length === 0) return null

            return (
              <Fragment key={section.id}>
                <div className="col-span-12 pt-2 first:pt-0">
                  <h2 className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
                    {section.title}
                  </h2>
                  <p className="mt-0.5 text-[12px] text-zinc-400">{section.description}</p>
                </div>
                {section.widgets.map((widget) => {
                  const size = getSize(widget)
                  return (
                    <DashboardPanel
                      key={widget}
                      title={getWidgetLabel(widget)}
                      description={WIDGET_DESCRIPTIONS[widget]}
                      size={size}
                      gridClass={getWidgetGridClass(widget)}
                      onSizeChange={(next) => setSize(widget, next)}
                    >
                      <WidgetRenderer widget={widget} {...data} />
                    </DashboardPanel>
                  )
                })}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
