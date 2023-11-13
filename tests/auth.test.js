const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const bcrypt = require('bcrypt');
const { signup, login, logout, user, profile } = require('../controllers/auth');
const UserModel = require('../models/userModel');

chai.use(chaiAsPromised);

chai.use(chaiAsPromised);
const { expect } = chai;

beforeEach(async () => {
  await UserModel.create({
    fullName: 'John Doe',
    email: 'john_doe@example.com',
    password: '123456',
  });
  await UserModel.create({
    fullName: 'Foo Bar',
    email: 'foo_bar@example.com',
    password: '123456',
  });
});

afterEach(async () => {
  await UserModel.deleteMany({});
});

describe('Auth Controller Functions', () => {
  describe('login', () => {
    it('should log in successfully', async () => {
      const loginData = {
        email: 'john_doe@example.com',
        password: '123456',
      };

      const result = await login(loginData);
      expect(result.status).to.equal(200);
      expect(result.data)
        .to.have.property('message')
        .equal('User logged in successfully');
      expect(result.data).to.have.property('full_name').equal('John Doe');
      expect(result.data)
        .to.have.property('email')
        .equal('john_doe@example.com');
      expect(result.data).to.have.property('token');
    });
  });
});
