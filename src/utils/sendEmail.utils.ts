import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const SendEmail = async (to: string, subject: string, htmlContent: string) => {
  const { error } = await resend.emails.send({
    from: process.env.OurEmail as string,
    to,
    subject,
    html: htmlContent,
  })

  if (error) {
    console.error("Failed to send email:", error)
  }
}