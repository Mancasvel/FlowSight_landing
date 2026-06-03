import { Resend } from 'resend'

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error('RESEND_API_KEY is not configured')
    _resend = new Resend(key)
  }
  return _resend
}

export type SendEmailParams = {
  to: string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail(params: SendEmailParams): Promise<{ id: string }> {
  const from = process.env.RESEND_FROM_EMAIL ?? 'FlowSight Reports <reports@flowsight.site>'
  const uniqueTo = Array.from(new Set(params.to.map((e) => e.trim().toLowerCase()).filter(Boolean)))
  if (uniqueTo.length === 0) throw new Error('No recipients')

  const { data, error } = await getResend().emails.send({
    from,
    to: uniqueTo,
    subject: params.subject,
    html: params.html,
    text: params.text,
  })

  if (error) throw new Error(error.message)
  if (!data?.id) throw new Error('Resend did not return a message id')
  return { id: data.id }
}
