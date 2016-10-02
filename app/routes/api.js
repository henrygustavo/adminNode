module.exports = function(express) {
    //Express router instance
    var apiRouter = express.Router();

    var config = require('../../config');
    var jwt = require('jsonwebtoken');

    var supersecret = config.supersecret;

    var accountRoute = require('./account')(apiRouter);
    //Middleware to verify a token

    apiRouter.use(function(req, res, next) {
        console.log('alguien entrando al sistema');
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        console.log('token-'+token);
        if (token) {
            //verify token
            jwt.verify(token, supersecret, function(err, decoded) {

                if (err) {
                    return res.json({
                        success: false,
                        message: "Fallo autenticacion del token"
                    })
                } else {
                    req.role = jwt.decode(token).role;
                    next();
                }

            });

        } else {
            return res.status(403).send({
                success: false,
                message: 'No se envio el token'
            });
        }
    });

    //Accesed at get
    apiRouter.get('/', function(req, res) {
        res.json({
            message: 'Bienvenido al sistema'
        });
    });

    var roleRoute = require('./role')(apiRouter);
    var userRoute = require('./user')(apiRouter);

    return apiRouter;
}
