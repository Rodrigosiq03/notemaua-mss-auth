import { createTransport } from 'nodemailer'
import envs from '../../..'
import { firstAccessMailHtml, forgotPasswordMailHtml } from './mail_html'

const transporter = createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: envs.MAIL_USER,
    pass: envs.MAIL_PASSWORD
  }
})

export async function sendFirstAccessMail(ra: string, newPassword: string) {
  const mailOptions = {
    from: `"Contato Notemaua" <${envs.MAIL_USER}>`,
    to: `${ra}@maua.br`,
    subject: 'Primeiro acesso ao Notemaua!',
    html: firstAccessMailHtml(newPassword)
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    }
    console.log('Email sent: ' + info.response)
  })
}

export async function sendForgotPasswordMail(email: string, code: string) {
  const mailOptions = {
    from: `"Contato Notemaua" <${envs.MAIL_USER}>`,
    to: email,
    subject: 'Primeiro acesso ao Notemaua!',
    html: forgotPasswordMailHtml(code)
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    }
    console.log('Email sent: ' + info.response)
  })
}