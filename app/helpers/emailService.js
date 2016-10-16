var nodemailer = require('nodemailer');

var transportOptions = {
    service: 'Gmail',
    auth: {
        user: 'henrygustavof@gmail.com',
        pass: 'henry_16'
    }
};

var transporter = nodemailer.createTransport(transportOptions);

/**
 * Send an email to the user requesting confirmation.
 *
 * @func sendVerificationEmail
 * @param {string} email - the user's email address.
 * @param {string} url - the unique url generated for the user.
 * @param {function} callback - the callback to pass to Nodemailer's transporter
 */
var sendVerificationEmail = function(email, url, callback) {
    var r = /\$\{URL\}/g;

    // inject newly-created URL into the email's body and FIRE
    // stringify --> parse is used to deep copy
    var URL = 'http://localhost:5050/api/email-verification/${URL}'.replace(r, url);

    var verifyMailOptions = {
        from: 'Do Not Reply <henrygustavof@gmail.com>',
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    };
    mailOptions = JSON.parse(JSON.stringify(verifyMailOptions));

    mailOptions.to = email;
    mailOptions.html = mailOptions.html.replace(r, URL);
    mailOptions.text = mailOptions.text.replace(r, URL);

    transporter.sendMail(mailOptions, callback);
};

module.exports = {

    sendVerificationEmail: sendVerificationEmail
};
