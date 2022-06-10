const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'peter.sedhom11@gmail.com',
        subject: 'Welcome to my SPECTACULAR app',
        text: `Thanks for joining the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'peter.sedhom11@gmail.com',
        subject: 'Good Bye :(',
        text: `We are sad to see you leave, ${name}. Let me know how to make my app better for you.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendByeEmail
}