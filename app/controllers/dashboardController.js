const session = require('express-session');

const { User } = require('../models').db;

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

exports.saveAvatar = async function(req, res) {
    
    User.update(
        { avatar: req.file.filename },
        { 
            where: { 
                id: req.session.user.id 
            }
        }
    ).then(() => {
        req.flash('success', 'Avatar successfully updated!');
        return res.redirect('/');
    }).catch((error) => {
        return res.end('Update error ' + error);
    });
    
}