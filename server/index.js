"use strict";

const express = require("express");
const jsonParser = require("body-parser").json();
const MongoClient = require("mongodb").MongoClient;
const path = require("path");

const { jwt } = require("./promisified-utils");
const company = require("./company");
const job = require("./job");
const applicant = require("./applicant");
const resume = require("./resume");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoUrl = process.env.MONGO_URL;

const app = express();

MongoClient.connect(
  mongoUrl,
  { useNewUrlParser: true }
)
  .then(db => {
    if (process.env.NODE_ENV === 'production') {
      app.locals.db = db.db('prod');
    } else {
      app.locals.db = db.db('test');
    }
  })
  .catch(err => console.error(err));

app.listen(process.env.PORT || 4567, () =>
  console.log("Listening on port 4567...")
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(jsonParser);

app.use("/api/company", company);
app.use("/api/job", job);
app.use("/api/applicant", applicant);
app.use("/api/resume", resume);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "../build", "index.html"));
  });
}

/*app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});*/
