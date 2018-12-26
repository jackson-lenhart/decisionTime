import { Router } from 'express';

import View from '../../../models/view';

import { jwt } from '../../../utils';
const secret = process.env.SECRET;

const router = Router();

// posts a new view to a specific company and job (not protected)
router.post('/', async function(req, res) {
  const { companyId, jobId, jobTitle } = req.body;
  try {
    const view = new View({ companyId, jobId, jobTitle });
    await view.save();
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
    const { companyId, companyName } = await jwt.verify(token, secret);
    const views = await View.find({ companyId });
    res.json({ companyName, views });
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

export default router;
