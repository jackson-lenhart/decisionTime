import { Router } from 'express';
import bodyParser from 'body-parser';
import sgMail from '@sendgrid/mail';
import 'dotenv/config';

import Applicant from '../../../models/applicant';
import Screening from '../../../models/screening';
import Resume from '../../../models/applicant/resume';

import { jwt } from '../../../utils';
const secret = process.env.SECRET;

const router = Router();

const formParser = bodyParser.urlencoded({ extended: true });

const host = process.env.NODE_ENV === 'production'
  ? 'http://www.decisiontyme.com'
  : 'http://localhost:3000';

const hostEmail = 'itsdecisiontyme@gmail.com';

// post application to create applicant
router.post('/:companyId/:jobId', formParser, async function(req, res) {
  const { companyId, jobId } = req.params;
  // TODO: Validation
  const { firstName, lastName, email } = req.body;
  try {
    // Find all screenings under the job and select one at random to assign to applicant
    const screenings = await Screening.find({ jobId });
    if (screenings.length === 0) {
      // TODO: Make this a "Could not find any exams for this job" html page
      res.sendStatus(404);
    } else {
      const randIndex = Math.floor(Math.random() * screenings.length);
      const exam = screenings[randIndex].questions;
      const applicant = new Applicant({
        companyId,
        jobId,
        firstName,
        lastName,
        email,
        exam,
        status: 'NOT_VERIFIED'
      });
      const _applicant = await applicant.save();
      res.redirect('../../../../pending-verification');

      // Send email
      // TODO: Clean this up
      try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // TODO: Make this expiring, or maybe one-time use only
        const token = await jwt.sign({ applicantId: _applicant._id }, secret);
        const url = `${host}/applicant/${token}`;
        await sgMail.send({
          to: email,
          from: hostEmail,
          subject: 'Please verify your account',
          html: `<div>
              <p>Click below to verify your account with this email.</p>
              </p>You will be prompted to begin the test:</p>
              <a href=${url}>Click here</a>
            </div>`
        });
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

const pdfParser = bodyParser.raw({
  type: 'application/pdf',
  limit: '50mb'
});

// upload resume
router.post('/resume/:applicantId', pdfParser, async function(req, res) {
  const { applicantId } = req.params;
  try {
    await Resume.updateOne(
      { _id: applicantId },
      {
        $set: {
          file: req.body
        }
      },
      { upsert: true }
    );
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.get('/test-timestamp/:id', async function(req, res) {
  const { id } = req.params;
  const ts = Date.now();
  try {
    await Applicant.updateOne(
      { _id: id },
      {
        $set: {
          testTimestamp: ts,
          status: 'BEGUN_EXAM'
        }
      }
    );
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.get('/gateway', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];

  try {
    const { applicantId } = await jwt.verify(token, secret);
    const applicant = await Applicant.findOne({ _id: applicantId });
    res.json(applicant);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.get('/verify', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];

  try {
    const { applicantId } = await jwt.verify(token, secret);
    const applicant = await Applicant.updateOne(
      { _id: applicantId },
      {
        $set: { status: 'VERIFIED' }
      }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;
