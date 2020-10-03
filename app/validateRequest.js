exports.register = async function(req, res, next) {
    let { username, email, password } = req.body;
    
    const validator = req.validator.build({ username, email, password }, {
        'username': 'required|string',
        'email': 'required|string|email',
        'password': 'required|min:6'
    });

    const validatorFail = await validator.validate();
    if (validatorFail) {
        req.flash('inputs', { username, email });
        req.session.save(() => {

            return res.redirect('/');
        });
    } else {
        next();
    }
}

exports.createPost = async function(req, res, next) {
    const { title, body } = req.body;

    const validator = req.validator.build({ title, body }, {
        'title': 'required|string',
        'body': 'required|string'
    });
    const validatorFail = await validator.validate();

    if (validatorFail) {
        req.flash('inputs', { title, body });
        req.session.save(() => {
            return res.redirect('/create-post');
        });
    } else {
        next();
    }
}