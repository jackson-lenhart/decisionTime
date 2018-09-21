import { Router } from 'express';
import bodyParser from 'body-parser';

import Applicant from '../../../models/applicant';
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
    await Applicant.insertOne({
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
      _id: applicantId
    });
    res.sendStatus(200);
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

export default router;
