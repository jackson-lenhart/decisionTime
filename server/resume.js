"use strict";

const { Router } = require("express");
const bodyParser = require("body-parser");

const { jwt } = require("./promisified-utils");

const secret = process.env.SECRET;

const router = Router();

const pdfParser = bodyParser.raw({
  type: "application/pdf",
  limit: "50mb"
});

router.post("/:companyId/:applicantId/:jobId", pdfParser, (req, res) => {
  const db = req.app.locals.db;
  const Resumes = db.collection("resumes");
  const { companyId, applicantId, jobId } = req.params;

  Resumes.insertOne({
    applicantId,
    companyId,
    jobId,
    resume: req.body
  })
  .then(result => {
    if (result.insertedCount === 0) {
      throw new Error("Could not insert resume");
    }

    res.json({
      success: true
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

router.get("/:jobId/:applicantId/:token", (req, res) => {
  const db = req.app.locals.db;
  const Resumes = db.collection("resumes");
  const { token, applicantId, jobId } = req.params;

  jwt.verify(token, secret)
  .then(({ companyId }) =>
    Resumes.findOne({
      applicantId,
      companyId,
      jobId
    })
  )
  .then(resume => {
    if (!resume) {
      throw new Error(
        "Could not find resume with applicantId " +
        applicantId + " and companyId " + companyId
      );
    }

    res.set("Content-Type", "application/pdf");
    res.send(new Buffer(resume.resume.buffer));
  })
  .catch(err => {
    res.send(err);
    console.error(err);
  });
});

module.exports = router;
