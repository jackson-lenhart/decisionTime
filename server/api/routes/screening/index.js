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

    // get company id from jwt authData
    const { companyId } = await jwt.verify(token, secret);

    // save exam in the database
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

export default router;
