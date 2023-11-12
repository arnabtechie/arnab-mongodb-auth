const express = require('express');
const { check } = require('express-validator');
const auth = require('../controllers/auth.js');
const jwt = require('jsonwebtoken');
const config = require('../config');
const UserModel = require('../models/userModel');

const router = express.Router();

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers && req.headers.authorization) {
    token = req.headers.authorization;
  }

  if (!token) {
    return res.status(401).send({
      error: 'You are not logged in! please log in to get access',
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    if (!decoded) {
      return res.status(401).send({
        error: 'Unauthorized',
      });
    }

    const user = await UserModel.findOne(
      { _id: decoded.id },
      { _id: 1, fullName: 1, email: 1 }
    );

    if (!user) {
      return res.status(401).send({
        error: 'User belonging to this token does no longer exist',
      });
    }

    req.user = user;
    res.locals.user = user;
    next();
  } catch (err) {
    return res.status(401).send({ error: err.toString() });
  }
};

// ------------------------------Unauthenticated---------------------------//
router.post(
  '/users/signup',
  [
    check('fullName', 'Please enter name.').not().isEmpty(),
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Please enter valid password').isLength({ min: 4 }),
    check('confirmPassword', 'Please enter valid confirmPassword').isLength({
      min: 4,
    }),
  ],
  auth.signup
);
router.post(
  '/users/login',
  [
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Please enter valid password').isLength({ min: 4 }),
  ],
  auth.login
);

// ----------------------------------------------------------------------//

router.use(protect);

// ------------------------------Authenticated---------------------------//
router.get('/users/logout', auth.logout);
router.get('/users/me', auth.user);
router.get('/users/user', auth.profile);

// ---------------------------------------------------------------------//

module.exports = router;
