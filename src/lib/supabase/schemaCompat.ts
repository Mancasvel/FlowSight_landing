/**
 * Detect Supabase/Postgres errors when Pro-plan tables or columns
 * are not present yet (migration not applied on production).
 */
export function isSchemaMismatchError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const { code, message } = error as { code?: string; message?: string }
  if (!code && !message) return false

  const schemaCodes = new Set([
    '42P01', // undefined_table
    '42703', // undefined_column
    'PGRST204', // PostgREST: column not found
    'PGRST205', // PostgREST: table not found in schema cache
  ])

  if (code && schemaCodes.has(code)) return true

  const msg = (message ?? '').toLowerCase()
  return (
    msg.includes('schema cache') ||
    msg.includes('does not exist') ||
    msg.includes('could not find')
  )
}
