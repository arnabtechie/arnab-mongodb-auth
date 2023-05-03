const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      error: errors,
    });
  }

  const { email, password, fullName, confirmPassword } = req.body;

  if (confirmPassword !== password) {
    return res.status(400).send({
      error: "Password and Confirm Password are different",
    });
  }

  try {
    const user = await UserModel.findOne({ email }, { _id: 1 });
    if (user) {
      return res.status(400).send({
        error: "User exists, try logging in",
      });
    }

    const result = await UserModel.create({ fullName, email, password });
    if (result) {
      const token = jwt.sign({ id: result._id }, config.JWT_SECRET, {
        expiresIn: 86400 * 30,
      });

      return res.status(201).send({
        message: "User registered successfully",
        id: result._id,
        token,
      });
    }

    return res.status(400).send({ error: "Something went wrong" });
  } catch (err) {
    return res.status(500).send({ error: err.toString() });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      error: errors,
    });
  }
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne(
      { email },
      { email: 1, fullName: 1, password: 1 }
    );

    if (!user) {
      return res.status(400).send({
        error: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET);

    return res.status(200).send({
      message: "User logged in successfully",
      id: user.id,
      full_name: user.fullName,
      email: user.email,
      token,
    });
  } catch (err) {
    return res.status(500).send({ error: err.toString() });
  }
};

exports.logout = async (req, res) => {
  return res.send(200).send({ message: "User logged out successfully" });
};

exports.user = async (req, res) => {
  const user = await UserModel.findOne(
    { _id: req.user._id },
    { email: 1, fullName: 1, createdAt: 1 }
  );
  if (!user) {
    return res.status(400).send({
      error: "Invalid user",
    });
  }
  return res.status(200).json({ ...user });
};

exports.profile = async (req, res) => {
  const user = await UserModel.findOne(
    { _id: req.user._id },
    { email: 1, fullName: 1, createdAt: 1 }
  );
  if (!user) {
    return res.status(400).send({
      error: "Invalid user",
    });
  }
  return res.status(200).json({ ...user });
};
