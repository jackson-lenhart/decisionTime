import { Router } from 'express';
import 'dotenv/config';

import Job from '../../../models/job';

import { jwt } from '../../../utils';

const secret = process.env.SECRET;

const router = Router();

// get all jobs for a given company
router.get('/', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  try {
    const { companyId, companyName } = await jwt.verify(token, secret);
    const jobs = await Job.find({ companyId });
    res.json({ jobs, companyId, companyName });
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

// get a single job
router.get('/:companyId/:jobId', async function(req, res) {
  const { companyId, jobId } = req.params;
  try {
    const { title, description, companyName } = await Job.findOne({ companyId, _id: jobId });
    res.json({
      title,
      description,
      companyName
    });
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

// create new job
router.post('/', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  const { title, description } = req.body;
  try {
    const { companyId, companyName } = await jwt.verify(token, secret);
    const job = new Job({
      companyId,
      companyName,
      title,
      description,
      visits: 0
    });
    const _job = await job.save();
    res.json({ _id: _job._id });
  }
  catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

// edit job
router.post('/edit', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  const { _id, title, description } = req.body;
  try {
    const { companyId } = await jwt.verify(token, secret);
    await Job.updateOne(
      { _id, companyId },
      {
        $set: {
          title,
          description
        }
      }
    );
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

// delete job (no new applicants, current applicants remain unaffected)
router.post('/remove', async function(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  const { id } = req.body;
  try {
    const { companyId } = await jwt.verify(token, secret);
    await Job.findOneAndDelete({ _id: id });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

export default router;
