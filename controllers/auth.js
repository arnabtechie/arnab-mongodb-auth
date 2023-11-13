const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const { validate } = require('../utils/validator');
const { isEmptyArray } = require('../utils/common');
const { v4: uuidv4 } = require('uuid');

const signup = async (reqBody) => {
  try {
    const validationArray = validate(reqBody, [
      'fullName',
      'email',
      'password',
      'confirmPassword',
    ]);

    if (!isEmptyArray(validationArray)) {
      return {
        status: 400,
        data: {
          error: `'${validationArray.toString()}' field(s) required`,
        },
      };
    }
    const { email, password, fullName, confirmPassword } = reqBody;

    if (confirmPassword !== password) {
      return {
        status: 400,
        data: { error: 'Password and Confirm Password are different' },
      };
    }

    const user = await UserModel.findOne({ email }, { uuid: 1, _id: 1 }).lean();
    if (user) {
      return {
        status: 400,
        data: { error: 'User exists, try logging in' },
      };
    }

    const result = await UserModel.create({
      uuid: uuidv4(),
      fullName,
      email,
      password,
    });
    if (result) {
      const token = jwt.sign(
        { id: result.uuid, createdAt: Date.now() },
        config.JWT_SECRET
      );

      return {
        status: 201,
        data: {
          message: 'User registered successfully',
          uuid: result.uuid,
          token,
          email,
        },
      };
    }

    return { status: 400, data: { error: 'Something went wrong' } };
  } catch (err) {
    console.log(err.stack);
    return { status: 500, data: { error: err.toString() } };
  }
};

const login = async (reqBody) => {
  const validationArray = validate(reqBody, ['email', 'password']);

  if (!isEmptyArray(validationArray)) {
    return {
      status: 400,
      data: { error: `'${validationArray.toString()}' field(s) required` },
    };
  }
  const { email, password } = reqBody;

  try {
    const user = await UserModel.findOne(
      { email },
      { uuid: 1, email: 1, fullName: 1, password: 1, _id: 0 }
    ).lean();

    if (!user) {
      return { status: 400, data: { error: 'Invalid credentials' } };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { status: 400, data: { error: 'Invalid credentials' } };
    }

    const token = jwt.sign(
      { uuid: user.uuid, createdAt: Date.now() },
      config.JWT_SECRET
    );

    return {
      status: 200,
      data: {
        message: 'User logged in successfully',
        uuid: user.uuid,
        fullName: user.fullName,
        email: user.email,
        token,
      },
    };
  } catch (err) {
    console.log(err.stack);
    return { status: 500, data: { error: err.toString() } };
  }
};

const logout = async () => {
  return { status: 200, data: { message: 'User logged out successfully' } };
};

const user = async (reqUser) => {
  try {
    const fetchedUser = await UserModel.findOne(
      { uuid: reqUser.uuid },
      { uuid: 1, email: 1, fullName: 1, createdAt: 1, _id: 0 }
    ).lean();
    if (!fetchedUser) {
      return { status: 400, data: { error: 'Invalid user' } };
    }
    return { status: 200, data: { ...fetchedUser } };
  } catch (err) {
    console.log(err.stack);
    return { status: 500, data: { error: err.toString() } };
  }
};

const profile = async (reqQuery) => {
  try {
    const fetchedUser = await UserModel.findOne(
      { uuid: reqQuery.uuid },
      { uuid: 1, email: 1, fullName: 1, createdAt: 1, _id: 0 }
    ).lean();
    if (!fetchedUser) {
      return { status: 400, data: { error: 'Invalid user' } };
    }
    return { status: 200, data: { ...fetchedUser } };
  } catch (err) {
    console.log(err.stack);
    return { status: 500, data: { error: err.toString() } };
  }
};

module.exports = { signup, login, logout, user, profile };
