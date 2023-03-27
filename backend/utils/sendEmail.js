const nodemailer = require('nodemailer')


const sendEmail = async options=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "786409d625ccc9",
          pass: "91d224ce4684b7"
        }
      });
      const message ={
        from:process.env.SMTP_FROM,
        to: options.email,
        subject: options.subject,
        text: options.message
      }

      await transporter.sendMail(message)
}



module.exports = sendEmail;