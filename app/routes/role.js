module.exports = function(apiRouter) {

    var Role = require('../models/role');

    var CustomError = require('../helpers/customError');

    apiRouter.route('/roles')

    .post(function(req, res) {

            var role = new Role();

            role.name = req.body.name;

            role.save(function(err) {

                if (err) return CustomError(err, res);

                res.json({
                    success: true,
                    message: 'role creado exitosamente'
                });

            });
        })
        .get(function(req, res) {

            Role.find(function(err, roles) {
                if (err) return CustomError(err, res);

                res.json(roles);
            });

        });

    apiRouter.route('/roles/:role_id')
        .get(function(req, res) {

            Role.findOne({
                _id: req.params.role_id
            }, function(err, role) {
                if (err) return CustomError(err, res);
                res.json(role);

            });
        })
        .put(function(req, res) {
            Role.findById(req.params.role_id, function(err, role) {
                if (err) return CustomError(err, res);

                if (req.body.name) role.name = req.body.name;

                role.save(function(err) {
                  
                      if (err) return CustomError(err, res);

                    res.json({
                        success: true,
                        message: 'role actualizado exitosamente'
                    });
                });
            });
        });
}
