module.exports = function(apiRouter) {

    var Role = require('../models/role');

    var customError = require('../helpers/customError');
    var requireRole = require('../helpers/requireRole');
    var pagination = require('../helpers/pagination');

    apiRouter.route('/roles')
        .get(requireRole("admin"), function(req, res) {

            Role.paginate({
                name: new RegExp(req.param('filterName'), "i")
            }, pagination.input(req), function(err, results) {

                if (err) return customError(err, res);

                res.json(pagination.output(results));
            });
        })
        .post(requireRole("admin"), function(req, res) {

            var role = new Role();

            role.name = req.body.name;

            role.save(function(err) {

                if (err) return customError(err, res);

                res.json({
                    success: true,
                    message: 'role creado exitosamente'
                });

            });
        });

    apiRouter.route('/rolesList')
        .get(requireRole("admin"), function(req, res) {

            Role.find({ }, function(err, results) {

                if (err) return customError(err, res);

                res.json(pagination.CreateDictionaryList(results,"name","name"));
            });
        });

    apiRouter.route('/roles/:role_id')
        .get(requireRole("admin"), function(req, res) {

            Role.findOne({
                _id: req.params.role_id
            }, function(err, role) {
                if (err) return customError(err, res);
                res.json(role);

            });
        })
        .put(requireRole("admin"), function(req, res) {
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
