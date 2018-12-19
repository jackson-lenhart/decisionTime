import { Router } from 'express';
import 'dotenv/config';

import results from './results';

import Screening from '../../../models/screening';

import { jwt } from '../../../utils';

const secret = process.env.SECRET;

const router = Router();

// gets screening exam(s) with a jobId
router.get('/:jobId', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  const { jobId } = req.params;
  try {
    const { companyId } = await jwt.verify(token, secret);
    const exams = await Screening.find({ jobId, companyId });
    res.json(exams);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

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
    // should we really be giving back this id? Yet to be determined
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
    const screening = await Screening.findOneAndUpdate(
      { companyId, _id: screeningId },
      {
        $set: { questions }
      },
      { new: true }
    );
    res.json(screening);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.post('/remove', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  const { screeningId } = req.body;
  try {
    const { companyId } = await jwt.verify(token, secret);
    await Screening.findOneAndDelete({ companyId, _id: screeningId });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.use('/results', results);

export default router;
