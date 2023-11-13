const app = require('./app');
const config = require('./config');

// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err);
//   throw err;
// });

const server = app.listen(config.PORT, () => {
  console.log(`server running on port ${config.PORT}...`);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
