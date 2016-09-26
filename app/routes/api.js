
module.exports = function(express) {
    //Express router instance
    var apiRouter = express.Router();

    //Accesed at get
    apiRouter.get('/', function(req, res) {
        res.json({
            message: 'Welcome to admin Menu'
        });
    });

    var accountRoute = require('./account')(apiRouter);
    var roleRoute = require('./role')(apiRouter);
    var userRoute = require('./user')(apiRouter);

    return apiRouter;

}
