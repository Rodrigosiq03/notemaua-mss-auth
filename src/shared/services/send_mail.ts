import { createTransport } from 'nodemailer'
import envs from '../../..'
import { mailHtml } from './mail_html'

export async function sendFirstAccessMail(ra: string, newPassword: string) {
  const transporter = createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: envs.MAIL_USER,
      pass: envs.MAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: `"Contato Notemaua" <${envs.MAIL_USER}>`,
    to: `${ra}@maua.br`,
    subject: 'Primeiro acesso ao Notemaua!',
    html: mailHtml(newPassword)
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    }
    console.log('Email sent: ' + info.response)
  })
}