export interface JiraTicket {
  id: string
  key: string
  summary: string
  status: string
  assignee: {
    accountId: string
    displayName: string
  } | null
  issueType: string
  storyPoints: number | null
  projectKey: string
  sprintId: string | null
  created: string
  updated: string
  resolutionDate: string | null
}

export interface JiraChangelogEntry {
  field: string
  from: string | null
  to: string | null
  timestamp: string
}

export interface JiraChangelog {
  id: string
  entries: JiraChangelogEntry[]
}

// TODO: Wire to real Jira API via stored OAuth tokens in profiles.jira_tokens
export async function getTicket(_ticketId: string): Promise<JiraTicket> {
  throw new Error('FlowSight [getTicket]: Jira API integration not yet wired')
}

export async function getSprintTickets(_sprintId: string): Promise<JiraTicket[]> {
  throw new Error('FlowSight [getSprintTickets]: Jira API integration not yet wired')
}

export async function getTicketChangelog(_ticketId: string): Promise<JiraChangelog[]> {
  throw new Error('FlowSight [getTicketChangelog]: Jira API integration not yet wired')
}
