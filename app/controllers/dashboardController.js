exports.dashboard = function(req, res) {
    if (!req.session.user) {
        res.redirect('/');
    }
    res.render('pages/dashboard')
}

exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');
}