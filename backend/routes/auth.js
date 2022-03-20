const express = require('express');
const router = express.Router();

const userController = require('../controllers/User');
const auth = require('../helper/auth-helper');

router.post('/signup', userController.addUser);
router.post('/login', userController.getUser, auth);

module.exports = router;