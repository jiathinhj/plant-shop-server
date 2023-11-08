const nodemailer = require('nodemailer');

const sendMail = async (receiver, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.SENDER,
            pass: process.env.SENDER_PASSWORD
        }
    })
    await transporter.sendMail({
        from: process.env.SENDER,
        to: receiver,
        subject: subject,
        text: message
    })
}

module.exports = { sendMail }