const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD
    }
})



const sendWelcomeEmail = (email, name) => {
    const options = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let us know if there is a problem.`
    }

    transporter.sendMail(options, (err, info) => {
        if(err) {
            console.log(error.message)
        } 
        console.log('Sent : ' + info.response)
    })


  
}

const sendCancelationEmail = (email, name) => {
    const options = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    }

    transporter.sendMail(options, (err, info) => {
        if(err) {
            console.log(error.message)
        } 
        console.log('Sent : ' + info.response)
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}