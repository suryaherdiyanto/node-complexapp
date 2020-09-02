const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, req.app.locals.rootPath.concat('/public/uploads'));
    },
    filename: function(req, file, cb) {
        let mime = file.mimetype.split('/')[1];

        cb(null, Math.floor(new Date().getTime() / 1000).toString() + '.' + mime);
    }
})
const upload = multer({ storage: storage });

const homeController = require('./controllers/homeController');
const dashboardController = require('./controllers/dashboardController');

router.get('/', homeController.homePage);
router.get('/test', homeController.test);
router.post('/register-user', homeController.register);
router.post('/login', homeController.login);

router.get('/dashboard', dashboardController.dashboard);
router.post('/logout', dashboardController.logout);

router.get('/profile', function(req, res) {
    res.send('This is a profile page!');
});

router.post('/save-avatar', upload.single('avatar'), dashboardController.saveAvatar);

module.exports = router;