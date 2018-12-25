import { Router } from 'express';

import Visit from '../../../models/visit';

import { jwt } from '../../../utils';
const secret = process.env.SECRET;

const router = Router();

// posts a new visit to a specific company and job (not protected)
router.post('/', async function(req, res) {
  const { companyId, jobId } = req.body;
  try {
    const visit = new Visit({ companyId, jobId });
    await visit.save();
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

// gets all visits for a company (protected)
router.get('/', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  try {
    const { companyId } = await jwt.verify(token, secret);
    const visits = await Visit.find({ companyId });
    res.json(visits);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

export default router;
