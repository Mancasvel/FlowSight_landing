'use client'

import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  Divider,
  Tooltip,
  Avatar,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
} from '@/components/ui'
import type { CostBreakdown as CostBreakdownType, MemberGap } from '@/lib/types/dashboard'

type Props = {
  costBreakdown: CostBreakdownType
  perPersonGap: MemberGap[]
  costPerHour: number
}

function formatEuro(n: number): string {
  return `€${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export default function CostBreakdown({ costBreakdown, perPersonGap, costPerHour }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="text-sm font-medium text-zinc-800">Cost · This Sprint</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-4">
            <span className="text-sm text-zinc-800">Meetings</span>
            <span className="text-sm text-zinc-500 tabular-nums">{formatEuro(costBreakdown.meetingsCost)}</span>
          </div>
          <Divider />
          <div className="flex justify-between items-center gap-4">
            <span className="text-sm text-zinc-800">Interruptions</span>
            <span className="text-sm text-zinc-500 tabular-nums">
              {formatEuro(costBreakdown.interruptionCost)}
            </span>
          </div>
          <Divider />
          <div className="flex justify-between items-center gap-4">
            <span className="text-sm text-zinc-800">Context sw.</span>
            <span className="text-sm text-zinc-500 tabular-nums">{formatEuro(costBreakdown.contextCost)}</span>
          </div>
          <Divider />
          <Tooltip content="Based on your team's blended hourly rate set in Settings">
            <div className="flex justify-between items-center gap-4 cursor-help pt-1">
              <span className="text-lg font-bold text-zinc-800">Total</span>
              <span className="text-xl font-bold text-zinc-800 tabular-nums">
                {formatEuro(costBreakdown.total)}
              </span>
            </div>
          </Tooltip>
        </div>

        {perPersonGap.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Per-person gap
            </p>
            <Table>
              <TableHeader>
                <tr>
                  <TableColumn>Person</TableColumn>
                  <TableColumn>Gap %</TableColumn>
                  <TableColumn>Likely Cause</TableColumn>
                </tr>
              </TableHeader>
              <TableBody>
                {perPersonGap.map((m) => {
                  const abs = Math.abs(m.gapPercent)
                  const gapColor =
                    abs > 20 ? 'danger' : abs > 10 ? 'warning' : 'success'
                  return (
                    <TableRow key={m.userId}>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar src={m.avatarUrl || undefined} name={m.displayName} size="sm" />
                          <span className="text-sm truncate">{m.displayName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip color={gapColor}>
                          {m.gapPercent > 0 ? '+' : ''}
                          {m.gapPercent}%
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-zinc-500">{m.likelyCause}</span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
