const app = require('./app');
const config = require('./config');

const server = app.listen(config.PORT, () => {
  console.log(`server running on port ${config.PORT}...`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
