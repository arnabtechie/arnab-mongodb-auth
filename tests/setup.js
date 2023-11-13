const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
let mongoServer;

before(async function () {
  this.timeout(120000);

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

after(async function () {
  await mongoose.disconnect();
  await mongoServer.stop();
});
