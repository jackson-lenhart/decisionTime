import { Router } from 'express';
import bodyParser from 'body-parser';

import Applicant from '../../../models/applicant';
import Screening from '../../../models/screening';
import Resume from '../../../models/applicant/resume';

const router = Router();

// post application to create applicant
router.post('/', async function(req, res) {
  const {
    applicantId,
    companyId,
    companyName,
    jobTitle,
    jobId,
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    phone,
    email,
    experience,
    education,
    resumeUploaded,
    resumeUrl,
    coverLetter,
    salaryRequirements,
    isOver18,
    isLegal,
    isFelon,
    felonyForm
  } = req.body;
  try {
    // Eventually, this should select one at random rather than just picking the first one every time
    const screening = await Screening.findOne({ jobId });
    const exam = screening.questions;
    const applicant = new Applicant({
      companyId,
      companyName,
      jobTitle,
      jobId,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      experience,
      education,
      resumeUploaded,
      resumeUrl,
      coverLetter,
      salaryRequirements,
      isOver18,
      isLegal,
      isFelon,
      felonyForm,
      exam,
      status: 'INITIALIZED'
    });
    const _applicant = await applicant.save();
    res.json({ _id: _applicant._id });
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

router.get('/:id', async function(req, res) {
  const { id } = req.params;
  try {
    const applicant = await Applicant.findOne({ _id: id });
    res.json(applicant);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

export default router;
