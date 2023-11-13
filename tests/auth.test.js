const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { login, profile } = require('../controllers/auth');
const UserModel = require('../models/userModel');

chai.use(chaiAsPromised);

const { expect } = chai;

beforeEach(async () => {
  await UserModel.create({
    uuid: 'd5584db5-4d08-41fa-9826-47dcdfe07645',
    fullName: 'John Doe',
    email: 'john_doe@example.com',
    password: '123456',
  });
  await UserModel.create({
    uuid: 'b0ca1c4e-a49d-464d-bb9f-91173476e684',
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
        .to.have.property('uuid')
        .equal('d5584db5-4d08-41fa-9826-47dcdfe07645');
      expect(result.data).to.have.property('fullName').equal('John Doe');
      expect(result.data)
        .to.have.property('email')
        .equal('john_doe@example.com');
      expect(result.data).to.have.property('token');
    });

    it('should not log in, should return validation error', async () => {
      const loginData = {
        email: 'john_doe@example.com',
      };

      const result = await login(loginData);
      expect(result.status).to.equal(400);
    });

    it('should not log in, should return wrong credentials (wrong password)', async () => {
      const loginData = {
        email: 'john_doe@example.com',
        password: '865413521',
      };

      const result = await login(loginData);
      expect(result.status).to.equal(400);
      expect(result.data.error).to.equal('Invalid credentials');
    });

    it('should not log in, should return wrong credentials (wrong email and password)', async () => {
      const loginData = {
        email: 'john_doe23@example.com',
        password: '865413521',
      };

      const result = await login(loginData);
      expect(result.status).to.equal(400);
      expect(result.data.error).to.equal('Invalid credentials');
    });
  });
  describe('user profile', () => {
    it('should get the user information', async () => {
      const result = await profile({
        uuid: 'd5584db5-4d08-41fa-9826-47dcdfe07645',
      });
      expect(result.status).to.equal(200);
      expect(result.data)
        .to.have.property('uuid')
        .equal('d5584db5-4d08-41fa-9826-47dcdfe07645');
      expect(result.data).to.have.property('fullName').equal('John Doe');
      expect(result.data)
        .to.have.property('email')
        .equal('john_doe@example.com');
      expect(result.data).to.have.property('createdAt');
    });
  });
});
