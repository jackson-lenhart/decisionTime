import { Router } from 'express';
import 'dotenv/config';

import Company from '../../../models/company';
import CompanyUser from '../../../models/company/user';

import { hashPassword, comparePasswords, jwt } from '../../../utils';

const secret = process.env.SECRET;

const router = Router();

router.post('/signup', async function(req, res) {
  const {
    firstName,
    lastName,
    email,
    companyId,
    companyName,
    accessToken,
    password
  } = req.body;
  try {
    // Verify that a company exists with those credentials first
    const company = await Company.findOne({
      accessToken,
      _id: companyId,
      name: companyName
    });
    if (!company) {
      res.sendStatus(401);
    } else {
      const passwordDigest = await hashPassword(password);
      const user = new CompanyUser({
        firstName,
        lastName,
        email,
        companyId,
        companyName,
        passwordDigest
      });
      await user.save();
      const token = await jwt.sign({
        email,
        companyName,
        companyId
      }, secret);
      res.json({ token });
    }
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.post('/login', async function(req, res) {
  const { email, password } = req.body;
  try {
    const user = await CompanyUser.findOne({ email });
    if (!user) {
      res.sendStatus(401);
    } else {
      const { companyName, companyId, passwordDigest } = user;
      const validPassword = await comparePasswords(password, passwordDigest);
      if (!validPassword) {
        res.sendStatus(401);
      } else {
        // TODO: make this (and probably all other tokens) expire after some period of time
        const token = await jwt.sign({
          email,
          companyName,
          companyId
        }, secret);
        res.json({
          token,
          companyId
        });
      }
    }
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.post('/password-reset', async function(req, res) {
  const { email, password, newPassword } = req.body;
  try {
    const user = await CompanyUser.findOne({ email });
    if (!user) {
      res.sendStatus(401);
    } else {
      const { _id, passwordDigest, email, companyName, companyId } = user;
      const validPassword = comparePasswords(password, passwordDigest);
      if (!validPassword) {
        res.sendStatus(401);
      } else {
        const newPasswordDigest = await hashPassword(newPassword);
        await CompanyUser.updateOne(
          { _id },
          {
            $set: { passwordDigest: newPasswordDigest }
          }
        );
        const token = await jwt.sign({
          email,
          companyName,
          companyId
        }, secret);
        res.json({
          token,
          companyId
        });
      }
    }
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

export default router;
