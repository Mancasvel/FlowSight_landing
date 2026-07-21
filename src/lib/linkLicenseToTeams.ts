import type { SupabaseClient } from '@supabase/supabase-js'

/** Attach all teams owned by a user to the license activated by Stripe checkout. */
export async function linkOwnerTeamsToLicense(
  supabase: SupabaseClient,
  ownerId: string,
  licenseId: string
): Promise<void> {
  const { error } = await supabase
    .from('teams')
    .update({ license_id: licenseId })
    .eq('owner_id', ownerId)

  if (error) throw error
}
