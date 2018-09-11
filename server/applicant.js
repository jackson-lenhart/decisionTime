"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const hat = require("hat");
const { omit } = require("ramda");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}


const secret = process.env.SECRET;

const router = express.Router();

router.get("/applicant/:id", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { id } = req.params;

  Applicants.findOne({ id })
    .then(applicant => {
      if (!applicant) {
        throw new Error(`Could not find applicant with id ${id}`);
      }

      res.json({
        success: true,
        ...applicant
      });
    })
    .catch(err => {
      res.json({
        success: false,
        msg: err.message
      });
      console.error(err);
    });
});

router.post("/application", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const Jobs = db.collection("jobs");

  const {
    applicantId,
    companyId,
    companyName,
    jobTitle,
    jobId,
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    phone,
    email,
    workExperience,
    education,
    resumeUploaded,
    coverLetter,
    salaryRequirements,
    over18,
    legal,
    felon,
    felonyForm
  } = req.body;

  let test;
  Jobs.findOne({ companyId, id: jobId })
    .then(job => {
      if (!job) {
        throw new Error(
          `Could not find Job under jobId ${jobId} and companyId ${companyId}`
        );
      }

      test = job.test;

      return Applicants.insertOne({
        companyId,
        companyName,
        jobTitle,
        jobId,
        firstName,
        lastName,
        address,
        city,
        state,
        zipCode,
        phone,
        email,
        workExperience,
        education,
        resumeUploaded,
        coverLetter,
        salaryRequirements,
        over18,
        legal,
        test,
        felon,
        felonyForm,
        id: applicantId,
        completed: false,
        timestamp: new Date(),
        testTimestamp: null,
        secondsElapsed: 0,
        answerData: null
      });
    })
    .then(result => {
      if (result.insertedCount === 0) {
        throw new Error("Could not insert applicant");
      }

      res.json({
        applicantId,
        test,
        success: true
      });
    })
    .catch(err => {
      res.json({
        success: false,
        msg: err.message
      });
    });

  const url =
    "http://decisiontyme.com/applicant/" +
    encodeURIComponent(companyName) +
    "/" +
    encodeURIComponent(jobTitle) +
    "/" +
    applicantId;

  sgMail.send({
    to: email,
    from: "itsdecisiontyme@gmail.com",
    subject: "blehbleh",
    html: `<div>
        <p>You will be prompted to begin the test:</p>
        <a href=${url}>Click here</a>
      </div>`
  })
  .then(() => {
    console.log('Email sent!!');
  })
  .catch(err => {
    console.error(err);
  });
});

router.get("/auth/:id", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { id } = req.params;

  Applicants.findOne({ id })
    .then(applicant => {
      if (!applicant) {
        throw new Error(`Could not find applicant with id ${id}`);
      }

      if (applicant.completed) {
        return res.json({
          success: true,
          completed: true
        });
      }

      res.json({
        success: true,
        ...omit(["_id"], applicant)
      });
    })
    .catch(err => {
      res.json({
        success: false,
        msg: err.message
      });
      console.error(err);
    });
});

router.get("/test-timestamp/:id", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const { id } = req.params;

  Applicants.updateOne(
    { id },
    {
      $set: {
        testTimestamp: new Date()
      }
    }
  )
    .then(result => {
      if (result.matchedCount === 0 || result.modifiedCount === 0) {
        throw new Error(`Could not update applicant with id ${id}`);
      }

      return res.json({ success: true });
    })
    .catch(err => {
      res.json({
        success: false,
        msg: err.message
      });
      console.error(err);
    });
});

router.post("/test-results/:id", (req, res) => {
  const db = req.app.locals.db;
  const Applicants = db.collection("applicants");
  const CompanyUsers = db.collection("companyUsers");

  const { id } = req.params;
  const { applicantId, secondsElapsed, answerData } = req.body;

  Applicants.updateOne(
    { id },
    {
      $set: {
        secondsElapsed,
        answerData,
        completed: true
      }
    }
  )
    .then(success => {
      if (!success) {
        throw new Error(`Could not update applicant with id ${id}`);
      }

      res.json({ success: true });

      return Applicants.findOne({ id });
    })
    .catch(err => {
      res.json({
        success: false,
        msg: err.message
      });
      console.error(err);
    });

  let applicant;
  let user_id;
  Applicants.findOne({ id })
    .then(result => {
      user_id = result.id;
      if (!result) {
        throw new Error(`Could not find applicant with id ${id}`);
      }

      applicant = result;
      return CompanyUsers.find({
        companyId: applicant.companyId
      }).toArray();
    })
    .then(companyUsers => {
      if (companyUsers.length === 0) {
        throw new Error(
          `Could not find any companyUsers with companyId ${
            applicant.companyId
          }`
        );
      }

      return Promise.all(
        companyUsers.map(x =>
          sgMail.send({
            to: x.email,
            from: "itsdecisiontyme@gmail.com",
            subject: `A New Applicant Has Applied!!`,
            html: `<h1>You have received a new applicant!</h1><div><a href='http://www.decisiontime.com/company/applicant/${user_id}'>Click here</a> to check them out!</div>`
          })
        )
      );
    })
    .then(() => {
      console.log("Email has been sent!!");
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = router;
