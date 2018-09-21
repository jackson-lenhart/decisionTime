import { Router } from 'express';
import 'dotenv/config';

import Applicant from '../../../models/applicant'

import { jwt } from '../../../utils';

const secret = process.env.SECRET;

const router = Router();

const host = process.env.NODE_ENV === 'production'
  ? 'http://www.decisiontyme.com'
  : 'http://localhost:3000';

const hostEmail = 'itsdecisiontyme@gmail.com';

// get all of a company's applicants (pending and complete)
router.get('/', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  try {
    const { companyId, companyName } = await jwt.verify(token, secret);
    const applicants = await Applicant.find({ companyId });
    res.json({
      companyName,
      applicants
    });
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

// get a single applicant
router.get('/:id', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  try {
    const { companyId } = await jwt.verify(token, secret);
    const applicant = await Applicant.findOne({ companyId, _id: id });
    res.json({ applicant });
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

// get a single applicant's resume
router.get('/resume/:id', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  const { id } = req.params;
  try {
    await jwt.verify(token, secret);
    const resume = Resume.findOne({ _id: id });
    if (resume) {
      res.set('Content-Type', 'application/pdf');
      res.send(new Buffer(resume.file.buffer));
    } else {
      res.sendFile(
        path.join(__dirname, "../public/resume-does-not-exist.html")
      );
    }
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

// send email reminder to applicant
router.post('/email-reminder', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  const {
    applicantId,
    email,
    companyName,
    jobTitle
  } = req.body;
  try {
    await jwt.verify(token, secret);
    const url = host
      + '/screening/'
      + encodeURIComponent(companyName)
      + encodeURIComponent(jobTitle)
      + applicantId;
    await sgMail.send({
      to: email,
      from: hostEmail,
      subject: 'Reminder: your test has not been completed',
      html: `<div>
          <p>You will be prompted to begin the test:</p>
          <a href=${url}>Click here</a>
        </div>`
    });
    // OK
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

export default router;
