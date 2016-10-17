module.exports = function(apiRouter, nev) {

    var User = require('../models/user');
    var VerificationToken = require('../models/verificationToken');

    var customError = require('../helpers/customError');
    var config = require('../../config');
    var jwt = require('jsonwebtoken');

    var supersecret = config.supersecret;

    apiRouter.post('/account/authenticate', function(req, res) {
        // find the user
        User.findOne({
                email: req.body.email
            }).select('emailConfirmed email password role name')
            .exec(function(err, user) {

                if (err) return customError(err, res);

                if (!user) {
                    res.json({
                        success: false,
                        message: 'La autenticacion ha fallado.El usuario no existe'
                    });
                } else if (user) {

                    var validaPassword = user.comparePassword(req.body.password);
                    // check if password matches
                    if (!validaPassword) {
                        res.json({
                            success: false,
                            message: 'La autenticacion ha fallado.Contrasena no existe.'
                        });
                    } else {

                        // if user is found and password is right
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
                            emailConfirmed: user.emailConfirmed,
                            token: token
                        });
                    }
                }
            });
    });

    apiRouter.get('/account/verificationToken/:token', function(req, res) {

        var token = req.params.token;

        VerificationToken.findOne({
            token: token
        }, function(err, doc) {

            if (err) return customError(err, res);

            if (doc==null) return res.json({
                success: false,
                message: 'error'
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
                        message: 'success'
                    });

                })
            })
        })

    });

}
