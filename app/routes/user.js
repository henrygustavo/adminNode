module.exports = function(apiRouter, nev) {

    var User = require('../models/user');
    var VerificationToken = require('../models/verificationToken');

    var customError = require('../helpers/customError');
    var requireRole = require('../helpers/requireRole');
    var pagination = require('../helpers/pagination');
    var emailService = require('../helpers/emailService');

    apiRouter.route('/users')
        .get(requireRole("admin"), function(req, res) {
            User.paginate({
                    $and: [{
                        name: new RegExp(req.param('filterName'), "i")
                    }, {
                        email: new RegExp(req.param('filterEmail'), "i")
                    }]
                },
                pagination.input(req),
                function(err, results) {

                    if (err) return customError(err, res);

                    res.json(pagination.output(results));
                });
        })
        .post(requireRole("admin"), function(req, res) {

            var user = mapModel(new User(), req);

            user.save(function(err) {

                if (err) return customError(err, res);

                var verificationToken = new VerificationToken({
                    _userId: user._id
                });

                verificationToken.createVerificationToken(function(err, token) {

                    if (err) return customError(err, res);

                    emailService.sendVerificationEmail(user.email, token, user.confirmUrl, function(error, success) {

                        if (err) return customError(err, res);

                        res.json({
                            success: true,
                            message: 'Un email ha sido enviado. Por favor revise su cuenta.'
                        });
                    });
                });
            });
        });

    apiRouter.route('/users/name/:name')
        .get(requireRole("admin"), function(req, res) {

            User.findOne({
                name: req.params.name
            }, function(err, user) {
                if (err) return customError(err, res);

                res.json({
                    exist: user != null
                });

            });
        });

    apiRouter.route('/users/email/:email')
        .get(requireRole("admin"), function(req, res) {

            User.findOne({
                email: req.params.email
            }, function(err, user) {
                if (err) return customError(err, res);

                res.json({
                    exist: user != null
                });
            });
        });

    apiRouter.route('/users/:user_id')
        .get(requireRole("admin"), function(req, res) {

            User.findOne({
                _id: req.params.user_id
            }, function(err, user) {
                if (err) return customError(err, res);

                res.json(user);

            });
        })
        .put(requireRole("admin"), function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) return customError(err, res);

                user = mapModel(user, req);

                user.save(function(err) {
                    if (err) return customError(err, res);

                    res.json({
                        success: true,
                        message: 'usuario actualizado exitosamente.'
                    });
                });
            });
        });

    apiRouter.post('/account/changePassword', function(req, res) {

        var email = req.email;

        User.findOne({
                email: email
            }).select('password')
            .exec(function(err, user) {

                if (err) return customError(err, res);

                if (!user) {

                    return res.status(500).send({
                        success: false,
                        message: "No existe alguna cuenta asociada a ese email"
                    });
                }

                var validaPassword = user.comparePassword(req.body.oldpassword);

                // check if password matches

                if (!validaPassword) {
                    res.status(500).send({
                        success: false,
                        message: 'Contraseña incorrecta.'
                    });
                } else {

                    user.password = req.body.newpassword;

                    user.save(function(err) {
                        if (err) return customError(err, res);
                        console.log()
                        emailService.sendChangePasswordEmail(email, function(error, success) {

                            if (err) return customError(err, res);

                            res.json({
                                success: true,
                                message: 'Contraseña actualizada exitosamente.'
                            });
                        });
                    });
                }
            });
    });

    var mapModel = function(user, req) {

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.emailConfirmed) user.emailConfirmed = req.body.emailConfirmed;
        if (req.body.password) user.password = req.body.password;
        if (req.body.lockoutEndDateUtc) user.lockoutEndDateUtc = req.body.lockoutEndDateUtc;
        if (req.body.lockoutEnabled) user.lockoutEnabled = req.body.lockoutEnabled;
        if (req.body.accessFailedCount) user.accessFailedCount = req.body.accessFailedCount;
        if (req.body.creationDate) user.creationDate = req.body.creationDate;
        if (req.body.lastActivityDate) user.lastActivityDate = req.body.lastActivityDate;
        if (req.body.disabled) user.disabled = req.body.disabled;
        if (req.body.role) user.role = req.body.role;
        if (req.body.confirmUrl) user.confirmUrl = req.body.confirmUrl;

        return user;
    };
}
