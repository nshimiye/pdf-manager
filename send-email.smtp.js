// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');
const {readFileSync} = require('fs');

const pdfUint8Array = readFileSync('bill-enhanced-3.pdf');

const account = {
    name: process.env.MAILER_ACCOUNT_NAME || 'Example',
    smtp: {
        host: process.env.MAILER_SMTP_HOST || 'mail.example.com',
        port: process.env.MAILER_SMTP_PORT || 465,
        user: process.env.MAILER_SMTP_USER,
        pass: process.env.MAILER_SMTP_PASS,
    }
};

const messagePayload = {
    from: process.env.MAILER_MESSAGE_FROM,
    to: process.env.MAILER_MESSAGE_TO,
    subject: 'Nodemailer is unicode friendly ✔',
    text: 'Hello to myself!',
    html: '<p><b>Hello</b> to myself!</p>',
};

// Generate SMTP service account from ethereal.email
// nodemailer.createTestAccount((err, account) => {
//     if (err) {
//         console.error('Failed to create a testing account. ' + err.message);
//         return process.exit(1);
//     }

    console.log('Credentials obtained, sending message...', account.smtp);

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        name: account.name,
        host: account.smtp.host,
        port: 465,
        // secure: account.smtp.secure,
        secure: true,
        auth: {
            user: account.smtp.user,
            pass: account.smtp.pass,
        } 
    });

    // Message object
    let message = {
        from: messagePayload.from,
        to: messagePayload.to,
        subject: messagePayload.subject,
        text: messagePayload.text,
        html: messagePayload.html,
        attachments: [
            {   // utf-8 string as an attachment
                filename: 'test-file.pdf',
                content: pdfUint8Array
            },
        ]
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            console.log(err);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
