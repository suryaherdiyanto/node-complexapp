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
const postController = require('./controllers/postController');
const apiController = require('../app/controllers/apiController');
const followController = require('../app/controllers/followConftroller');
const middleware = require('../app/middleware');
const validateRequest = require('./validateRequest');

router.get('/', homeController.homePage);
router.get('/test', homeController.test);
router.post('/register-user', validateRequest.register, homeController.register);
router.post('/login', homeController.login);

router.get('/dashboard', dashboardController.dashboard);
router.post('/logout', dashboardController.logout);

router.get('/user/:id', dashboardController.userPosts);
router.get('/user/:id/followers', middleware.auth, followController.followersScreen);
router.get('/user/:id/following', middleware.auth, followController.followingScreen);

router.get('/profile', function(req, res) {
    res.send('This is a profile page!');
});

router.post('/save-avatar', upload.single('avatar'), dashboardController.saveAvatar);

router.get('/create-post', middleware.auth, postController.create);
router.post('/create-post', middleware.auth, validateRequest.createPost, postController.store);
router.get('/post/:id', middleware.auth, postController.show);
router.get('/post/:id/edit', middleware.auth, postController.edit);
router.post('/post/:id/update', middleware.auth, postController.update);
router.post('/post/:id/delete', middleware.auth, postController.delete);

router.post('/follow/:userId', middleware.auth, followController.follow);
router.post('/unfollow/:userId', middleware.auth, followController.unfollow);

router.get('/api/search', apiController.search);

module.exports = router;