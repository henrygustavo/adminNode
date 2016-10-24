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
var sendVerificationEmail = function(email, token, url, callback) {
    var r = /\$\{TOKEN\}/g;

    // inject newly-created URL into the email's body and FIRE
    // stringify --> parse is used to deep copy
    var URL = url + '/${TOKEN}'.replace(r, token);

    var verifyMailOptions = {
        from: 'Do Not Reply <henrygustavof@gmail.com>',
        subject: 'Confirma tu cuenta',
        html: '<p>Por favor verifica tu cuenta haciendo click <a href="${TOKEN}">en este link</a>.Si tu no puedes hacer esto ,copia y ' +
            'pega el siguiente link en tu navegador:</p><p>${TOKEN}</p>',
        text: 'Por favor verifica tu cuenta haciendo click en el siguiente link,o copaindo y pegando en tu navegador: ${TOKEN}'
    };
    mailOptions = JSON.parse(JSON.stringify(verifyMailOptions));

    mailOptions.to = email;
    mailOptions.html = mailOptions.html.replace(r, URL);
    mailOptions.text = mailOptions.text.replace(r, URL);

    transporter.sendMail(mailOptions, callback);
};

var sendResetPasswordEmail = function(email, token, url, callback) {
    var r = /\$\{TOKEN\}/g;

    // inject newly-created URL into the email's body and FIRE
    // stringify --> parse is used to deep copy
    var URL = url + '/${TOKEN}'.replace(r, token);

    var resetMailOptions = {

        from: 'Do Not Reply <henrygustavof@gmail.com>',
        subject: 'Reinicio de contraseña',
        html: 'Tu estas reciviendo este email porque tu o alguien más ha solicitado reiniciar la contraseña de su cuenta.\n\n' +
            'Por favor haz click en el siguiente link, o pega este en tu navegador para completar el proceso:\n\n' +
            '${TOKEN}' + '\n\n' +
            'Si tú no lo solicitaste,por favor ignora este email y tu password no será cambiado.\n',
        text: 'Por favor reinicie su contraseña haciendo click en el siguiente link,o copaindo y pegando en tu navegador: ${TOKEN}'
    };

    mailOptions = JSON.parse(JSON.stringify(resetMailOptions));

    mailOptions.to = email;
    mailOptions.html = mailOptions.html.replace(r, URL);
    mailOptions.text = mailOptions.text.replace(r, URL);

    transporter.sendMail(mailOptions, callback);
};

var sendChangePasswordEmail = function(email, callback) {

    var changeMailOptions = {

        from: 'Do Not Reply <henrygustavof@gmail.com>',
        subject: 'Actulización de Contraseña',
        html: 'Tu contraseña ha sido actualizada'
    };

    mailOptions = JSON.parse(JSON.stringify(changeMailOptions));

    mailOptions.to = email;
    mailOptions.text =   mailOptions.html;

    transporter.sendMail(mailOptions, callback);
};


module.exports = {

    sendVerificationEmail: sendVerificationEmail,
    sendResetPasswordEmail:sendResetPasswordEmail,
    sendChangePasswordEmail:sendChangePasswordEmail
};
