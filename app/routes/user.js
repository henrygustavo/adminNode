module.exports = function(apiRouter) {

    var User = require('../models/user');
    var CustomError = require('../helpers/customError');

    apiRouter.route('/users')

        .post(function(req, res) {

            var user = mapModel(new User(), req);

            console.log(req.body.name);

            user.save(function(err) {

                if (err) return CustomError(err, res);

                res.json({
                    success: true,
                    message: 'usuario creado exitosamente'
                });
            });
        })
        .get(function(req, res) {

            User.find(function(err, users) {
                if (err) return CustomError(err, res);

                res.json(users);
            });

        });

    apiRouter.route('/users/:user_id')
        .get(function(req, res) {

            User.findOne({
                _id: req.params.user_id
            }, function(err, user) {
                if (err) return res.send(err);
                res.json(user);

            });
        })
        .put(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) return CustomError(err, res);

                user = mapModel(user, req);

                user.save(function(err) {
                    if (err) return CustomError(err, res);
                    res.json({
                        success: true,
                        message: 'usuario actualizado exitosamente'
                    });
                });
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

        return user;
    }
}
