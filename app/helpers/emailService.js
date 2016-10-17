var nodemailer = require('nodemailer');
var config = require('../../config');

var transportOptions = {
    service: config.emailservise,
    auth: {
        user: config.emailaccount,
        pass: config.emailpassword
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
var sendVerificationEmail = function(email,token, url, callback) {
    var r = /\$\{TOKEN\}/g;

    // inject newly-created URL into the email's body and FIRE
    // stringify --> parse is used to deep copy
    var URL = url+'/${TOKEN}'.replace(r, token);

    var verifyMailOptions = {
        from: 'Do Not Reply <henrygustavof@gmail.com>',
        subject: 'Confirm your account',
        html: '<p>Please verify your account by clicking <a href="${TOKEN}">this link</a>. If you are unable to do so, copy and ' +
                'paste the following link into your browser:</p><p>${TOKEN}</p>',
        text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${TOKEN}'
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
