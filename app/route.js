const express = require('express');
const router = express.Router();

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

module.exports = router;