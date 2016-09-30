module.exports = function(apiRouter) {

    var Role = require('../models/role');

    var customError = require('../helpers/customError');
    var requireRole = require('../helpers/requireRole');

    apiRouter.route('/roles')

    .post(requireRole("admin"),function(req, res) {

            var role = new Role();

            role.name = req.body.name;

            role.save(function(err) {

                if (err) return customError(err, res);

                res.json({
                    success: true,
                    message: 'role creado exitosamente'
                });

            });
        })
        .get(requireRole("admin"),function(req, res) {

            Role.find(function(err, roles) {
                if (err) return customError(err, res);

                res.json(roles);
            });

        });

    apiRouter.route('/roles/:role_id')
        .get(requireRole("admin"),function(req, res) {

            Role.findOne({
                _id: req.params.role_id
            }, function(err, role) {
                if (err) return customError(err, res);
                res.json(role);

            });
        })
        .put(requireRole("admin"),function(req, res) {
            Role.findById(req.params.role_id, function(err, role) {
                if (err) return customError(err, res);

                if (req.body.name) role.name = req.body.name;

                role.save(function(err) {

                      if (err) return customError(err, res);

                    res.json({
                        success: true,
                        message: 'role actualizado exitosamente'
                    });
                });
            });
        });
}
