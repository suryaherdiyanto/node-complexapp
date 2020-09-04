exports.auth = function(req, res, next) {
    if (!req.session) {
        return res.end('Woow install the session package first');
    }

    if (!req.session.user) {
        return res.redirect('/')
    }

    next();
}