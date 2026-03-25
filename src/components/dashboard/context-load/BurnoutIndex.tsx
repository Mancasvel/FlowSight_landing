'use client'

import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Chip,
  Progress,
  Alert,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
} from '@/components/ui'
import type { BurnoutLevel, MemberContextLoad } from '@/lib/types/dashboard'

type Props = { members: MemberContextLoad[] }

function levelToChipColor(level: BurnoutLevel): 'success' | 'warning' | 'danger' {
  if (level === 'healthy') return 'success'
  if (level === 'warning') return 'warning'
  return 'danger'
}

function levelToProgressColor(level: BurnoutLevel): 'success' | 'warning' | 'danger' {
  return levelToChipColor(level)
}

/** System-first copy for the Reason column */
function burnoutReason(m: MemberContextLoad): string {
  const backlogWord = m.activeBacklogs === 1 ? 'backlog' : 'backlogs'
  const switchStr =
    m.contextSwitchesPerDay % 1 === 0
      ? String(m.contextSwitchesPerDay)
      : m.contextSwitchesPerDay.toFixed(1)
  return `${m.activeBacklogs} concurrent ${backlogWord} + ${switchStr} switches/day contributing to cognitive load`
}

function dangerAlertText(members: MemberContextLoad[]): string | null {
  const danger = members.filter((m) => m.burnoutLevel === 'danger')
  if (danger.length === 0) return null
  const rawSuggestions = danger.map((m) => m.suggestion).filter((s): s is string => s != null && s !== '')
  const suggestions = Array.from(new Set(rawSuggestions))
  if (suggestions.length > 0) return suggestions.join(' ')
  return 'Elevated burnout signals detected. Consider reducing concurrent work, context switching, or meeting load for affected people.'
}

export default function BurnoutIndex({ members }: Props) {
  const alertText = dangerAlertText(members)
  const showDangerAlert = members.some((m) => m.burnoutLevel === 'danger')

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-800">Burnout Index</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Composite signal — higher = more environmental wear
        </p>
      </CardHeader>
      <CardBody className="space-y-4">
        {members.length === 0 ? (
          <p className="text-sm text-zinc-500">No team members to show.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableColumn>Person</TableColumn>
                <TableColumn>Index</TableColumn>
                <TableColumn>Load</TableColumn>
                <TableColumn>Reason</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.userId}>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar src={m.avatarUrl || undefined} name={m.displayName} size="sm" />
                      <span className="truncate">{m.displayName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip color={levelToChipColor(m.burnoutLevel)}>{m.burnoutIndex}</Chip>
                  </TableCell>
                  <TableCell className="min-w-[140px]">
                    <Progress
                      value={m.burnoutIndex}
                      maxValue={100}
                      color={levelToProgressColor(m.burnoutLevel)}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="text-zinc-500 max-w-md">{burnoutReason(m)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {showDangerAlert && alertText && (
          <Alert color="primary" dismissible={false}>
            {alertText}
          </Alert>
        )}
      </CardBody>
    </Card>
  )
}
