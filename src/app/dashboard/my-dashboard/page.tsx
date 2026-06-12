import { redirect } from 'next/navigation'

export default function LegacyMyDashboardRedirect() {
  redirect('/account/my-dashboard')
}
