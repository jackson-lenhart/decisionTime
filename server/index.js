import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';

import Applicant from './models/applicant';
import Job from './models/job';

import api from './api';

import { jwt } from './utils';
const secret = process.env.SECRET;

const mongoUrl = process.env.MONGO_URL;

const app = express();

function readFile(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

const host = process.env.NODE_ENV === 'production'
  ? 'http://www.decisiontyme.com'
  : 'http://localhost:3000';

// To get rid of deprecation warning
mongoose.set('useFindAndModify', false);

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

  // TODO: Pull all of this SSR stuff into it's own file.
  app.get('/job-posting/:companyId/:jobId', function(req, res) {
    const { companyId, jobId } = req.params;
    fs.readFile(path.resolve(__dirname, './job-posting/index.html'), 'utf8', function(err, template) {
      if (err) {
        res.sendStatus(500);
      } else {
        Job.findOne({ companyId, _id: jobId }, function(err, job) {
          if (err) {
            res.sendStatus(500);
          } else {
            if (job) {
              const { title, description, companyName } = job;
              const page = template
                .replace('<h3 id="company-name"></h3>', `<h3>${companyName}</h3>`)
                .replace('<strong id="job-title"></strong>', `<strong>${title}</strong>`)
                .replace('<p id="job-description"></p>', `<p>${description}</p>`)
                .replace('<a id="link-to-apply">', `<a href="/apply/${companyId}/${jobId}">`);
              res.send(page);
            } else {
              // Send an html page instead of this saying something like:
              // "Job posting was not found. Please make sure the url is correct"
              res.sendStatus(404);
            }
          }
        });
      }
    });
  });

  app.get('/apply/:companyId/:jobId', function(req, res) {
    res.sendFile(path.resolve(__dirname, './application/index.html'));
  });

  app.use(express.static(path.join(__dirname, './pending-verification')));

  app.get('/pending-verification', function(req, res) {
    // Option to resend email if they did not receive
    res.sendFile(path.resolve(__dirname, './pending-verification/index.html'));
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
