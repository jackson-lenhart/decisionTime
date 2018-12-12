import { Router } from 'express';
import 'dotenv/config';

import Screening from '../../../models/screening';

import { jwt } from '../../../utils';

const secret = process.env.SECRET;

const router = Router();

// creates new screening exam
router.post('/', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  const { jobId, questions } = req.body;
  try {
    const { companyId } = await jwt.verify(token, secret);
    const screening = new Screening({
      companyId,
      jobId,
      questions,
      visits: 0
    });
    const { _id } = await screening.save();

    res.json({ _id });
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// updates existing screening exam
router.post('/edit', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  const { screeningId, questions } = req.body;
  try {
    const { companyId } = await jwt.verify(token, secret);
    await Screening.updateOne(
      { companyId, _id: screeningId },
      {
        $set: { questions }
      }
    );
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

export default router;
