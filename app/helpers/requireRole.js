module.exports = function requireRole(role) {

    return function(req, res, next) {

        if (req.role && req.role === role)
            next();
        else
            res.send(403);
    }
};
