
module.exports = function(apiRouter) {

    apiRouter.route('/account')

        .get(function(req, res) {

          res.json("accounts");

        });
}
