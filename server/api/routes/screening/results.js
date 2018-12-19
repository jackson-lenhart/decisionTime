import { Router } from 'express';

import Applicant from '../../../models/applicant';
import ScreeningResult from '../../../models/screening-result';

import { jwt } from '../../../utils';

const secret = process.env.SECRET;

const router = Router();

// Save results to database
router.post('/', async function(req, res) {
  const {
    applicantId,
    companyId,
    jobId,
    answers,
    questions,
    secondsElapsed
  } = req.body;
  try {
    const screeningResult = new ScreeningResult({
      applicantId,
      companyId,
      jobId,
      answers,
      questions,
      secondsElapsed
    });
    await screeningResult.save();
    res.sendStatus(200);

    // doing this after sending response so that it doesn't slow down experience for applicant
    // testing this out for now, might want to change how this is done later
    await Applicant.updateOne(
      { _id: applicantId },
      {
        $set: { status: 'COMPLETE'}
      }
    );
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

// Get results endpoint
router.get('/:applicantId/:jobId', async function(req, res) {
  const { applicantId, jobId } = req.params;
  const token = req.headers['authorization'].split(' ')[1];
  try {
    await jwt.verify(token, secret);
    // only 1 result should exist with an applicantId and jobId for now
    const results = await ScreeningResult.findOne({ applicantId, jobId });
    res.json(results);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

export default router;
