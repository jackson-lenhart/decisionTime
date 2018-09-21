import { Router } from 'express';
import randtoken from 'rand-token';
import 'dotenv/config';

import Company from '../../../models/company';
import CompanyUser from '../../../models/company/user';

import applicants from './applicants';
import user from './user';

const secret = process.env.SECRET;

const router = Router();

// company creation
router.post('/', async function(req, res) {
  const { name } = req.body;
  const accessToken = randtoken.generate(16);
  try {
    const company = new Company({
      name,
      accessToken
    });
    await company.save();
    res.json({ accessToken });
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

// generate new access token (will want to do this often for security purposes)
router.get('/gentoken/:prevtoken', async function(req, res) {
  const { prevtoken } = req.params;
  try {
    const accessToken = randtoken.generate(16);
    await Company.updateOne(
      { accessToken: prevtoken },
      { accessToken }
    );
    res.json({ accessToken });
  } catch(err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.use('/user', user);
router.use('/applicants', applicants);

export default router;
