module.exports = function(apiRouter, nev) {

    var User = require('../models/user');
    var VerificationToken = require('../models/verificationToken');

    var customError = require('../helpers/customError');
    var config = require('../../config');
    var jwt = require('jsonwebtoken');

    var supersecret = config.supersecret;
    var emailService = require('../helpers/emailService');

    apiRouter.post('/account/authenticate', function(req, res) {
        // find the user
        User.findOne({
                email: req.body.email
            }).select('emailConfirmed email password role name disabled accessFailedCount lockoutEnabled lastActivityDate lockoutEndDateUtc')
            .exec(function(err, user) {

                if (err) return customError(err, res);

                if (!user) {
                    res.status(500).send({
                        success: false,
                        message: 'La autenticacion ha fallado.El usuario no existe'
                    });
                } else {

                    if (user.disabled == 1) {

                      return  res.status(500).send({
                            success: false,
                            message: 'La cuenta se encuentra deshabilitada, comunicarse con el administrador'
                        });
                    }

                    if (user.lockoutEnabled == 1) {
                      return  res.status(500).send({
                            success: false,
                            message: 'La cuenta se encuentra bloqueada, comunicarse con el administrador'
                        });
                    }

                    var validaPassword = user.comparePassword(req.body.password);
                    // check if password matches
                    if (!validaPassword) {

                        if (user.accessFailedCount > config.limitNumberLoginAttemps && user.lockoutEnabled == 0) {
                            user.lockoutEnabled = 1;
                            user.lockoutEndDateUtc = Date.now();

                            user.save(function(err) {
                              if (err) return customError(err, res);

                              return  res.status(500).send({
                                    success: false,
                                    message: 'La cuenta ha sido bloqueado debido a varios intentos fallidos.'
                                });
                            });

                        } else {

                            user.accessFailedCount = user.accessFailedCount + 1;

                            user.save(function(err) {
                              if (err) return customError(err, res);

                              return  res.status(500).send({
                                    success: false,
                                    message: 'La autenticacion ha fallado.Contraseña no es la correcta.'
                                });

                            });
                        }

                    } else {

                        // if user is found and password is right
                        user.accessFailedCount = 0;
                        user.lastActivityDate = Date.now();

                        user.save(function(err) {
                            if (err) return customError(err, res);

                            // create a token
                            var token = jwt.sign({
                                name: user.name,
                                email: user.email,
                                role: user.role
                            }, supersecret, {
                                expiresIn: '24h'
                            });

                            // return the information including token as JSON
                            res.json({
                                success: true,
                                message: "Accesso autorizado",
                                name: user.name,
                                email: user.email,
                                emailConfirmed: user.emailConfirmed,
                                token: token
                            });
                        });
                    }
                }
            });
    });

    apiRouter.post('/account/verificationToken/', function(req, res) {

        var token = req.body.token;

        VerificationToken.findOne({
            token: token
        }, function(err, doc) {

            if (err) return customError(err, res);

            if (doc == null) return res.status(500).send({
                success: false,
                message: 'Error vuelva a intentarlo luego'
            });

            User.findOne({
                _id: doc._userId
            }, function(err, user) {

                if (err) return customError(err, res);

                user["emailConfirmed"] = true;

                user.save(function(err) {

                    if (err) return customError(err, res);

                    res.json({
                        success: true,
                        message: 'La verificación se realizó con éxito'
                    });
                })
            })
        })
    });

    apiRouter.post('/account/forgotPassword', function(req, res) {

        var email = req.body.email;
        var resetUrl = req.body.resetUrl;

        User.findOne({
            email: email
        }, function(err, user) {

            if (err) return customError(err, res);

            if (!user) {

                return res.status(500).send({
                    message: "No existe alguna cuenta asociada a ese email"
                });

            } else {

                var verificationToken = new VerificationToken({
                    _userId: user._id
                });

                verificationToken.createVerificationToken(function(err, token) {

                    if (err) return customError(err, res);

                    emailService.sendResetPasswordEmail(email, token, resetUrl, function(error, success) {

                        if (err) return customError(err, res);

                        res.json({
                            success: true,
                            message: 'Un email ha sido enviado. Por favor revise su cuenta.'
                        });
                    });
                });
            }
        });
    });

    apiRouter.post('/account/resetPassword/', function(req, res) {

        var token = req.body.token;
        var email = req.body.email
        var password = req.body.password;

        VerificationToken.findOne({
            token: token
        }, function(err, doc) {

            if (err) return customError(err, res);

            if (doc == null) return res.status(500).send({
                success: false,
                message: 'error'
            });

            User.findOne({
                _id: doc._userId,
                email: email
            }, function(err, user) {

                if (err) return customError(err, res);

                if (!user) {

                    return res.status(500).send({
                        success: false,
                        message: "No existe alguna cuenta asociada a ese email"
                    });

                } else {
                    user["password"] = password;

                    user.save(function(err) {

                        if (err) return customError(err, res);
                        res.json({
                            success: true,
                            message: 'El password ha sido restablecido correctamente'
                        });
                    })
                }
            })
        })
    });
}
