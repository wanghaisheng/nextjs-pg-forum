import { ReactElement } from "react"

import { render } from "@react-email/components"
import nodemailer from "nodemailer"
import { CreateEmailOptions } from "resend"

import { resend } from "@/libs/resend"

// Send email using SMTP (Recommended for local development)
const sendEmailViaSMTP = async ({
  email,
  subject,
  text,
  react,
}: Pick<CreateEmailOptions, "subject" | "text" | "react"> & {
  email: string
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  })

  const info = await transporter.sendMail({
    from: "noreply@example.com",
    to: email,
    subject,
    text,
    html: render(react as ReactElement),
  })

  console.info("Email sent: %s", info.messageId)
}

export const sendEmailViaResend = async ({
  email,
  subject,
  from,
  bcc,
  replyToFromEmail,
  text,
  react,
  scheduledAt,
  marketing,
}: Omit<CreateEmailOptions, "to" | "from"> & {
  email: string
  from?: string
  replyToFromEmail?: boolean
  marketing?: boolean
}) => {
  if (!resend) {
    console.info("RESEND_API_KEY is not set in the .env. Skipping sending email.")
    return
  }

  return await resend.emails.send({
    to: email,
    from:
      from ||
      (marketing
        ? "Luan Nguyen from codeforstartup.com <support@codeforstartup.com>"
        : "codeforstartup.com <support@codeforstartup.com>"),
    bcc: bcc,
    ...(!replyToFromEmail && {
      replyTo: "support@codeforstartup.com",
    }),
    subject: subject,
    text: text,
    react: react,
    scheduledAt,
    ...(marketing && {
      headers: {
        "List-Unsubscribe": process.env.NEXT_PUBLIC_FRONTEND_URL,
      },
    }),
  })
}

export const sendEmail = async ({
  email,
  subject,
  from,
  bcc,
  replyToFromEmail,
  text,
  react,
  scheduledAt,
  marketing,
}: Omit<CreateEmailOptions, "to" | "from"> & {
  email: string
  from?: string
  replyToFromEmail?: boolean
  marketing?: boolean
}) => {
  if (resend) {
    console.info("sendmail...", email)

    return await sendEmailViaResend({
      email,
      subject,
      from,
      bcc,
      replyToFromEmail,
      text,
      react,
      scheduledAt,
      marketing,
    })
  }

  // Fallback to SMTP if Resend is not configured
  const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT)

  if (smtpConfigured) {
    return await sendEmailViaSMTP({
      email,
      subject,
      text,
      react,
    })
  }

  console.info(
    "Email sending failed: Neither SMTP nor Resend is configured. Please set up at least one email service to send emails."
  )
}
