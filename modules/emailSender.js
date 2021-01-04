/* ******************************************************* SETUP ******************************************************* */
const nodemailer = require('nodemailer');
// creates a delivery box for e-mails
const transporter = nodemailer.createTransport({
    // host: 'mail.coding-school.org',
    // port: 465,
    // auth: {
    //     user: 'info@coding-school.org',
    //     pass: '!234qweR'
    // },
    // tls: {
    //     rejectUnauthorized: false
    // }
    host: "smtps.udag.de",
    port: 465,
    auth: {
        user: "info@felixwurst.de",
        pass: 'kx87aLpGGE3NDEa8'
    },
    tls: {
        rejectUnauthorized: false
    } 
});

/* ******************************************************* SEND EMAIL ******************************************************* */
// sends an email to a client
function sendEmail(email, subject, message) {
    return new Promise((resolve, reject) => {
        const mailOption = {
            from: "info@felixwurst.de",
            to: email,
            subject: subject,
            text: message
        };
        transporter.sendMail(mailOption, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve(info.response);
            }
        });
    });
}

/* ******************************************************* EXPORT ******************************************************* */
module.exports = {sendEmail};