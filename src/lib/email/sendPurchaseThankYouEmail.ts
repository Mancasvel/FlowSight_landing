import { appUrl } from '@/lib/appUrl'
import { sendEmail } from './resend'
import {
  purchaseThankYouHtml,
  purchaseThankYouSubject,
  purchaseThankYouText,
} from './purchaseThankYouTemplate'

export type SendPurchaseThankYouEmailParams = {
  to: string
  planName: string
}

/** Send the branded "thank you for going Pro" email after a successful Stripe checkout. */
export async function sendPurchaseThankYouEmail(
  params: SendPurchaseThankYouEmailParams
): Promise<void> {
  const templateParams = {
    planName: params.planName,
    dashboardUrl: appUrl('/dashboard'),
  }

  await sendEmail({
    to: [params.to],
    subject: purchaseThankYouSubject(templateParams),
    html: purchaseThankYouHtml(templateParams),
    text: purchaseThankYouText(templateParams),
  })
}
