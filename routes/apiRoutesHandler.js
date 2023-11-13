const express = require('express');
const authController = require('../controllers/auth.js');
const protect = require('../middleware/protect.js');

const router = express.Router();

const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
  const { status, data } = await authController.signup(req.body);
  res.status(status).json(data);
});

userRouter.post('/login', async (req, res) => {
  const { status, data } = await authController.login(req.body);
  res.status(status).json(data);
});

userRouter.get('/logout', protect, async (req, res) => {
  const { status, data } = await authController.logout();
  res.status(status).json(data);
});

userRouter.get('/me', protect, async (req, res) => {
  const { status, data } = await authController.user(req.user);
  res.status(status).json(data);
});

userRouter.get('/user', protect, async (req, res) => {
  const { status, data } = await authController.profile(req.query);
  res.status(status).json(data);
});

router.use('/users', userRouter);

module.exports = router;
