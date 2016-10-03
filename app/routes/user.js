module.exports = function(apiRouter) {

    var User = require('../models/user');
    var customError = require('../helpers/customError');
    var requireRole = require('../helpers/requireRole');
    var pagination = require('../helpers/pagination');

    apiRouter.route('/users')
    .get(requireRole("admin"), function(req, res) {
        User.paginate({ $and: [ { name: new RegExp(req.param('filterName'), "i")},
                                { email: new RegExp(req.param('filterEmail'), "i")}
                              ]
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

            res.json({
                success: true,
                message: 'usuario creado exitosamente'
            });
        });
    });

    apiRouter.route('/users/:user_id')
        .get(requireRole("admin"), function(req, res) {

            User.findOne({
                _id: req.params.user_id
            }, function(err, user) {
                if (err) return res.send(err);

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
    };
}
