const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const { validate } = require('../utils/validator');
const { isEmptyArray } = require('../utils/common');

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

    const user = await UserModel.findOne({ email }, { _id: 1 }).lean();
    if (user) {
      return {
        status: 400,
        data: { error: 'User exists, try logging in' },
      };
    }

    const result = await UserModel.create({ fullName, email, password });
    if (result) {
      const token = jwt.sign({ id: result._id }, config.JWT_SECRET, {
        expiresIn: 86400 * 30,
      });

      return {
        status: 201,
        data: {
          message: 'User registered successfully',
          id: result._id,
          token,
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
      { email: 1, fullName: 1, password: 1 }
    ).lean();

    if (!user) {
      return { status: 400, data: { error: 'Invalid credentials' } };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { status: 400, data: { error: 'Invalid credentials' } };
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET);

    return {
      status: 200,
      data: {
        message: 'User logged in successfully',
        id: user.id,
        full_name: user.fullName,
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
      { _id: abc._id },
      { email: 1, fullName: 1, createdAt: 1 }
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
      { _id: reqQuery._id },
      { email: 1, fullName: 1, createdAt: 1 }
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
