import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { getMetaCategory, META_CATEGORY_CONFIG, type MetaCategory } from '@/lib/categories'

export type MemberReportEntry = {
  category: string
  description: string
  jiraTicketId: string | null
  capturedAt: string
  durationSeconds: number
}

export type MemberReportInput = {
  displayName: string
  role: string
  avatarInitials: string
  isOnline: boolean
  selectedDate: string
  totalHoursToday: number
  focusPercent: number
  weeklyHoursByDay: { date: string; hours: number }[]
  categoryBreakdown: { name: string; hours: number; color: string }[]
  entries: MemberReportEntry[]
}

const BRAND_INDIGO: [number, number, number] = [79, 70, 229]
const ZINC_900: [number, number, number] = [24, 24, 27]
const ZINC_700: [number, number, number] = [63, 63, 70]
const ZINC_500: [number, number, number] = [113, 113, 122]
const ZINC_300: [number, number, number] = [212, 212, 216]
const ZINC_100: [number, number, number] = [244, 244, 245]
const EMERALD: [number, number, number] = [16, 185, 129]

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full.slice(0, 6), 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

/** Blend an rgb color with white to create a soft tint. Alpha = opacity of color over white. */
function tint(rgb: [number, number, number], alpha = 0.18): [number, number, number] {
  return [
    Math.round(rgb[0] * alpha + 255 * (1 - alpha)),
    Math.round(rgb[1] * alpha + 255 * (1 - alpha)),
    Math.round(rgb[2] * alpha + 255 * (1 - alpha)),
  ]
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—'
  const total = Math.round(seconds)
  if (total < 60) return `${total}s`
  const mins = Math.floor(total / 60)
  const secs = total % 60
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function setFill(doc: jsPDF, rgb: [number, number, number]) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2])
}

function setText(doc: jsPDF, rgb: [number, number, number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2])
}

function setDraw(doc: jsPDF, rgb: [number, number, number]) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2])
}

function drawHeader(doc: jsPDF, input: MemberReportInput) {
  const pageWidth = doc.internal.pageSize.getWidth()

  setFill(doc, BRAND_INDIGO)
  doc.rect(0, 0, pageWidth, 28, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  setText(doc, [255, 255, 255])
  doc.text('FlowSight', 14, 13)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Daily report · ${formatDate(input.selectedDate)}`, 14, 19)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  const generatedAt = new Date().toLocaleString()
  doc.text(`Generated ${generatedAt}`, pageWidth - 14, 13, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.text('Confidential · For internal use', pageWidth - 14, 19, { align: 'right' })
}

function drawMemberCard(doc: jsPDF, input: MemberReportInput, startY: number): number {
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 14
  const cardX = marginX
  const cardY = startY
  const cardW = pageWidth - marginX * 2
  const cardH = 24

  setFill(doc, ZINC_100)
  doc.roundedRect(cardX, cardY, cardW, cardH, 3, 3, 'F')

  const avatarRadius = 8
  const avatarX = cardX + 8 + avatarRadius
  const avatarY = cardY + cardH / 2
  setFill(doc, BRAND_INDIGO)
  doc.circle(avatarX, avatarY, avatarRadius, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  setText(doc, [255, 255, 255])
  doc.text(input.avatarInitials.toUpperCase().slice(0, 2), avatarX, avatarY + 1.2, { align: 'center' })

  const textX = avatarX + avatarRadius + 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  setText(doc, ZINC_900)
  doc.text(input.displayName, textX, cardY + cardH / 2 + 1.5)

  // KPI mini chips on the right
  const kpis = [
    { label: 'Tracked', value: `${input.totalHoursToday.toFixed(1)}h` },
    { label: 'Focus', value: `${input.focusPercent}%` },
    { label: 'Entries', value: `${input.entries.length}` },
  ]
  const chipW = 26
  const chipH = 16
  const chipGap = 4
  const chipsTotalW = kpis.length * chipW + (kpis.length - 1) * chipGap
  let chipX = cardX + cardW - chipsTotalW - 8
  const chipY = cardY + (cardH - chipH) / 2

  kpis.forEach((kpi) => {
    setFill(doc, [255, 255, 255])
    setDraw(doc, ZINC_300)
    doc.roundedRect(chipX, chipY, chipW, chipH, 2, 2, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    setText(doc, ZINC_900)
    doc.text(kpi.value, chipX + chipW / 2, chipY + 7, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    setText(doc, ZINC_500)
    doc.text(kpi.label, chipX + chipW / 2, chipY + 12.5, { align: 'center' })

    chipX += chipW + chipGap
  })

  return cardY + cardH
}

function drawSectionTitle(doc: jsPDF, text: string, y: number): number {
  const marginX = 14
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  setText(doc, ZINC_900)
  doc.text(text, marginX, y)

  setDraw(doc, ZINC_300)
  doc.setLineWidth(0.3)
  const pageWidth = doc.internal.pageSize.getWidth()
  doc.line(marginX, y + 1.5, pageWidth - marginX, y + 1.5)
  return y + 6
}

function drawHighlights(doc: jsPDF, input: MemberReportInput, startY: number): number {
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 14
  const contentW = pageWidth - marginX * 2

  const totals: Record<MetaCategory, number> = {
    'Deep Work': 0,
    'Collaboration': 0,
    'Communication': 0,
    'Meetings': 0,
    'Planning': 0,
    'Research': 0,
    'Administrative': 0,
    'Idle': 0,
  }
  let totalSeconds = 0
  for (const e of input.entries) {
    const meta = getMetaCategory(e.category)
    totals[meta] += e.durationSeconds
    totalSeconds += e.durationSeconds
  }

  const topMeta = (Object.entries(totals) as [MetaCategory, number][])
    .sort((a, b) => b[1] - a[1])
    .find(([, v]) => v > 0)
  const topMetaLabel = topMeta ? topMeta[0] : '—'
  const topMetaHours = topMeta ? topMeta[1] / 3600 : 0

  const jiraTickets = new Set(input.entries.map((e) => e.jiraTicketId).filter(Boolean))

  const firstEntry = input.entries[0]
  const lastEntry = input.entries[input.entries.length - 1]
  const timeRange = firstEntry && lastEntry
    ? `${formatTime(firstEntry.capturedAt)} – ${formatTime(lastEntry.capturedAt)}`
    : '—'

  const cards: Array<{ label: string; value: string; hint: string }> = [
    {
      label: 'Focus rate',
      value: `${input.focusPercent}%`,
      hint: 'Deep Work share of tracked time',
    },
    {
      label: 'Top activity',
      value: topMetaLabel,
      hint: `${topMetaHours.toFixed(1)}h in ${topMetaLabel}`,
    },
    {
      label: 'Active window',
      value: timeRange,
      hint: `${input.entries.length} activities captured`,
    },
    {
      label: 'Jira tickets',
      value: `${jiraTickets.size}`,
      hint: `${formatDuration(totalSeconds)} tracked`,
    },
  ]

  const gap = 3
  const cardW = (contentW - gap * (cards.length - 1)) / cards.length
  const cardH = 24

  cards.forEach((card, i) => {
    const x = marginX + i * (cardW + gap)
    setFill(doc, [255, 255, 255])
    setDraw(doc, ZINC_300)
    doc.roundedRect(x, startY, cardW, cardH, 2.5, 2.5, 'FD')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    setText(doc, ZINC_500)
    doc.text(card.label.toUpperCase(), x + 4, startY + 5.5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    setText(doc, ZINC_900)
    doc.text(card.value, x + 4, startY + 13.5)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    setText(doc, ZINC_500)
    const hint = doc.splitTextToSize(card.hint, cardW - 8)
    doc.text(hint[0], x + 4, startY + 19)
  })

  return startY + cardH + 6
}

function drawCategoryBreakdown(doc: jsPDF, input: MemberReportInput, startY: number): number {
  if (input.categoryBreakdown.length === 0) return startY

  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 14
  const contentW = pageWidth - marginX * 2
  const totalHours = input.categoryBreakdown.reduce((acc, c) => acc + c.hours, 0)
  if (totalHours <= 0) return startY

  const y = drawSectionTitle(doc, 'Last 7 days by category', startY)

  const barH = 9
  const gap = 4
  const labelW = 38
  const valueW = 26
  const barX = marginX + labelW
  const barMaxW = contentW - labelW - valueW

  let curY = y + 2

  input.categoryBreakdown.forEach((item) => {
    const pct = item.hours / totalHours
    const w = Math.max(1.5, barMaxW * pct)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    setText(doc, ZINC_700)
    doc.text(item.name, marginX, curY + barH - 2)

    setFill(doc, ZINC_100)
    doc.roundedRect(barX, curY, barMaxW, barH, 1.2, 1.2, 'F')

    setFill(doc, hexToRgb(item.color))
    doc.roundedRect(barX, curY, w, barH, 1.2, 1.2, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    setText(doc, ZINC_900)
    const label = `${item.hours.toFixed(1)}h · ${Math.round(pct * 100)}%`
    doc.text(label, marginX + contentW, curY + barH - 2, { align: 'right' })

    curY += barH + gap
  })

  return curY + 2
}

function drawWeeklyTrend(doc: jsPDF, input: MemberReportInput, startY: number): number {
  if (input.weeklyHoursByDay.length === 0) return startY

  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 14
  const contentW = pageWidth - marginX * 2

  const y = drawSectionTitle(doc, '7-day activity trend', startY)

  const chartH = 30
  const maxHours = Math.max(1, ...input.weeklyHoursByDay.map((d) => d.hours))
  const slot = contentW / input.weeklyHoursByDay.length
  const barW = slot * 0.55

  setDraw(doc, ZINC_300)
  doc.setLineWidth(0.2)
  doc.line(marginX, y + chartH, marginX + contentW, y + chartH)

  input.weeklyHoursByDay.forEach((d, i) => {
    const pct = d.hours / maxHours
    const h = Math.max(0.5, chartH * pct)
    const x = marginX + i * slot + (slot - barW) / 2
    const by = y + chartH - h

    const isToday = d.date === input.selectedDate
    setFill(doc, isToday ? BRAND_INDIGO : [165, 180, 252])
    doc.roundedRect(x, by, barW, h, 1.2, 1.2, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    setText(doc, ZINC_700)
    if (d.hours > 0) {
      doc.text(`${d.hours.toFixed(1)}h`, x + barW / 2, by - 1.5, { align: 'center' })
    }

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    setText(doc, ZINC_500)
    const label = new Date(d.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short' })
    doc.text(label, x + barW / 2, y + chartH + 4, { align: 'center' })
  })

  return y + chartH + 10
}

type CategorySummary = {
  meta: MetaCategory
  totalSeconds: number
  entryCount: number
  jiraTickets: string[]
  firstAt: string
  lastAt: string
  highlight: string
}

function buildCategorySummaries(entries: MemberReportEntry[]): CategorySummary[] {
  const map = new Map<MetaCategory, CategorySummary & { longest: number }>()

  for (const entry of entries) {
    const meta = getMetaCategory(entry.category)
    const current = map.get(meta)
    const description = entry.description?.trim() ?? ''

    if (!current) {
      map.set(meta, {
        meta,
        totalSeconds: entry.durationSeconds,
        entryCount: 1,
        jiraTickets: entry.jiraTicketId ? [entry.jiraTicketId] : [],
        firstAt: entry.capturedAt,
        lastAt: entry.capturedAt,
        highlight: description,
        longest: entry.durationSeconds,
      })
    } else {
      current.totalSeconds += entry.durationSeconds
      current.entryCount += 1
      if (entry.jiraTicketId && !current.jiraTickets.includes(entry.jiraTicketId)) {
        current.jiraTickets.push(entry.jiraTicketId)
      }
      if (new Date(entry.capturedAt) < new Date(current.firstAt)) current.firstAt = entry.capturedAt
      if (new Date(entry.capturedAt) > new Date(current.lastAt)) current.lastAt = entry.capturedAt
      if (entry.durationSeconds > current.longest && description) {
        current.longest = entry.durationSeconds
        current.highlight = description
      }
    }
  }

  return Array.from(map.values())
    .map(({ longest: _longest, ...rest }) => rest)
    .sort((a, b) => b.totalSeconds - a.totalSeconds)
}

function drawActivitySummary(doc: jsPDF, input: MemberReportInput, startY: number) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 14

  const y = drawSectionTitle(doc, 'Daily activity summary', startY)

  if (input.entries.length === 0) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    setText(doc, ZINC_500)
    doc.text('No activity recorded for this day.', marginX, y + 4)
    return
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  setText(doc, ZINC_500)
  doc.text(
    'Activity grouped by meta-category. Highlight is the longest entry of the group.',
    marginX,
    y + 2,
  )

  const summaries = buildCategorySummaries(input.entries)
  const totalSeconds = summaries.reduce((acc, s) => acc + s.totalSeconds, 0)

  const body = summaries.map((s) => {
    const pct = totalSeconds > 0 ? Math.round((s.totalSeconds / totalSeconds) * 100) : 0
    const window = `${formatTime(s.firstAt)}–${formatTime(s.lastAt)}`
    const jira = s.jiraTickets.length === 0
      ? '—'
      : s.jiraTickets.slice(0, 3).join(', ') + (s.jiraTickets.length > 3 ? ` +${s.jiraTickets.length - 3}` : '')
    const rawHighlight = s.highlight ? s.highlight.replace(/\s+/g, ' ') : ''
    const highlight = !rawHighlight
      ? '—'
      : rawHighlight.length > 160
        ? rawHighlight.slice(0, 160).trimEnd() + '…'
        : rawHighlight
    return [
      s.meta,
      formatDuration(s.totalSeconds),
      `${pct}%`,
      `${s.entryCount}`,
      window,
      jira,
      highlight,
    ]
  })

  autoTable(doc, {
    startY: y + 5,
    head: [['Category', 'Time', 'Share', 'Entries', 'Window', 'Jira', 'Highlight']],
    body,
    margin: { left: marginX, right: marginX },
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: ZINC_700,
      cellPadding: 2.5,
      lineColor: ZINC_300,
      lineWidth: 0.1,
      overflow: 'linebreak',
      valign: 'top',
    },
    headStyles: {
      fillColor: ZINC_100,
      textColor: ZINC_900,
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [250, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold' },
      1: { cellWidth: 18 },
      2: { cellWidth: 14 },
      3: { cellWidth: 14, halign: 'center' },
      4: { cellWidth: 24, font: 'courier', fontSize: 8 },
      5: { cellWidth: 26, font: 'courier', fontSize: 8 },
      6: { cellWidth: 'auto' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 0) {
        const meta = data.cell.raw as MetaCategory
        const cfg = META_CATEGORY_CONFIG[meta]
        if (cfg) {
          const rgb = hexToRgb(cfg.color)
          data.cell.styles.fillColor = tint(rgb, 0.18)
          data.cell.styles.textColor = rgb
        }
      }
    },
  })
}

function drawFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    setDraw(doc, ZINC_300)
    doc.setLineWidth(0.2)
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    setText(doc, ZINC_500)
    doc.text('FlowSight · Productivity insights', 14, pageHeight - 7)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 7, { align: 'right' })

    setFill(doc, EMERALD)
    doc.circle(pageWidth / 2 - 14, pageHeight - 8.2, 0.8, 'F')
    doc.text('Live data', pageWidth / 2 - 11, pageHeight - 7)
  }
}

export function generateMemberDayReport(input: MemberReportInput): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  drawHeader(doc, input)
  let y = 34
  y = drawMemberCard(doc, input, y)
  y += 6
  y = drawHighlights(doc, input, y)
  y = drawCategoryBreakdown(doc, input, y)
  y = drawWeeklyTrend(doc, input, y)
  drawActivitySummary(doc, input, y)
  drawFooter(doc)

  return doc
}

export function downloadMemberDayReport(input: MemberReportInput) {
  const doc = generateMemberDayReport(input)
  const safeName = input.displayName.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  doc.save(`flowsight-${safeName}-${input.selectedDate}.pdf`)
}
