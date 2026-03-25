'use client'

import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  Avatar,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
} from '@/components/ui'
import type { MemberEstimation } from '@/lib/types/dashboard'

type Props = { estimations: MemberEstimation[] }

const confidenceLabel: Record<MemberEstimation['confidence'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export default function EstimationEngine({ estimations }: Props) {
  const totalSampleSize = estimations.reduce((s, e) => s + e.sampleSize, 0)

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-medium text-zinc-800">
          Predicted Duration · Next Ticket Assignment
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Based on {totalSampleSize} historical tickets
        </p>
      </CardHeader>
      <CardBody>
        {estimations.length === 0 ? (
          <p className="text-sm text-zinc-500 py-4">No estimation history for this view.</p>
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableColumn>Person</TableColumn>
                <TableColumn>Base Estimate</TableColumn>
                <TableColumn>Load Factor</TableColumn>
                <TableColumn>Predicted</TableColumn>
                <TableColumn>Confidence</TableColumn>
              </tr>
            </TableHeader>
            <TableBody>
              {estimations.map((e) => {
                const confColor =
                  e.confidence === 'high'
                    ? 'success'
                    : e.confidence === 'medium'
                      ? 'warning'
                      : 'danger'
                return (
                  <TableRow key={e.userId}>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar src={e.avatarUrl || undefined} name={e.displayName} size="sm" />
                        <span className="text-sm truncate">{e.displayName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="tabular-nums text-sm">{e.baseEstimateHours}h</span>
                    </TableCell>
                    <TableCell>
                      <span className="tabular-nums text-sm">×{e.currentLoadFactor}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium tabular-nums text-sm text-zinc-800">
                        {e.predictedHours}h
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip color={confColor}>{confidenceLabel[e.confidence]}</Chip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  )
}
