const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const apiRoutes = require('./routes/apiRoutes');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();

app.get('/', (req, res) => res.status(200).send({ message: 'success' }));

const server = http.createServer(app);

mongoose.connect(config.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);
mongoose.connection.once('open', () => {
  console.log('Database connected');
});

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', apiRoutes);

app.use((_, res) =>
  res.status(404).send({
    error: '404 route not found',
  })
);

module.exports = server;
