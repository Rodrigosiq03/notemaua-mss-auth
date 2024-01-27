import { createTransport } from 'nodemailer'
import envs from '../../..'
import { mailHtml } from './mail_html'

export async function sendFirstAccessMail() {
  const transporter = createTransport({
    auth: {
      user: envs.MAIL_USER,
      pass: envs.MAIL_PASSWORD
    }
  })
  const mailOptions = {
    from: envs.MAIL_USER,
    to: 'rodrigo.dsiqueira1@gmail.com',
    subject: 'Primeiro acesso ao Notemaua',
    html: mailHtml
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    }
    console.log('Email sent: ' + info.response)
  })
}