import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import 'dotenv/config';

import api from './api';

const mongoUrl = process.env.MONGO_URL;

const app = express();

mongoose.connect(mongoUrl, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  app.listen(process.env.PORT || 4567, () =>
    console.log('Listening on port 4567...')
  );

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
  });

  app.use('/api', api);

  // Serve static assets if in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(_dirname, '../build', 'index.html'));
    });
  }
});
