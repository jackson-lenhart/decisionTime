import { Router } from 'express';

import ScreeningResult from '../../../models/screening-result';

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
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

export default router;
