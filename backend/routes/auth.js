const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const userController = require('../controllers/User');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

router.post('/signup', userController.addUser);
router.post('/login', userController.getUser, auth);

module.exports = router;