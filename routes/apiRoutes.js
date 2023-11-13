const express = require('express');
const authController = require('../controllers/auth.js');
const protect = require('../middleware/protect');

const router = express.Router();

// ------------------------------Unauthenticated---------------------------//
router.post('/users/signup', async (req, res) => {
  const { status, data } = await authController.signup(req.body);
  res.status(status).json(data);
});

router.post('/users/login', async (req, res) => {
  const { status, data } = await authController.login(req.body);
  res.status(status).json(data);
});

// ----------------------------------------------------------------------//

router.use(protect);

// ------------------------------Authenticated---------------------------//
router.get('/users/logout', async (req, res) => {
  const { status, data } = await authController.logout();
  res.status(status).json(data);
});

router.get('/users/me', async (req, res) => {
  const { status, data } = await authController.user(req.user);
  res.status(status).json(data);
});

router.get('/users/user', async (req, res) => {
  const { status, data } = await authController.profile(req.query);
  res.status(status).json(data);
});

// ---------------------------------------------------------------------//

module.exports = router;
