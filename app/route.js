const express = require('express');
const router = express.Router();

const homeController = require('./controllers/homeController');

router.get('/', homeController.homePage);
router.get('/test', homeController.test);
router.post('/register-user', homeController.register);

router.get('/profile', function(req, res) {
    res.send('This is a profile page!');
});

module.exports = router;