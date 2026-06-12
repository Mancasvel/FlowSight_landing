/** Header required on coach API calls from the FlowSight dashboard (not a secret — paired with session + origin checks). */
export const COACH_CLIENT_HEADER = 'X-FlowSight-Client'
export const COACH_CLIENT_VALUE = 'flowsight-dashboard'

export function coachApiHeaders(extra?: HeadersInit): HeadersInit {
  return {
    [COACH_CLIENT_HEADER]: COACH_CLIENT_VALUE,
    ...extra,
  }
}

export function coachJsonHeaders(): HeadersInit {
  return coachApiHeaders({ 'Content-Type': 'application/json' })
}
