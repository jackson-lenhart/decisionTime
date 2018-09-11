import React from "react";
import "./SubmittedApplication.css";

const SubmittedApplication = props => {
  let { applicant } = props;

  let host = window.location.hostname;
  if (host.includes("localhost")) {
    host = "localhost:4567";
  }

  const resumeUrl =
    'http://' +
    host +
    '/api/resume/' +
    applicant.companyId +
    '/' +
    applicant.jobId +
    '/' +
    applicant.id;

  let isOver18 = applicant.hasOwnProperty("over18")
    ? applicant.over18
      ? "Yes"
      : "No"
    : "Unknown";

  let isLegal = applicant.hasOwnProperty("legal")
    ? applicant.legal
      ? "Yes"
      : "No"
    : "Unknown";

  let isFelon = applicant.hasOwnProperty("felon")
    ? applicant.felon
      ? "Yes"
      : "No"
    : "Unknown";

  let felonyForm = applicant.hasOwnProperty("felonyForm") ? (
    applicant.felon ? (
      <p>{applicant.felonyForm}</p>
    ) : null
  ) : null;

  let education = applicant.hasOwnProperty("education")
    ? applicant.education.length > 0
      ? applicant.education.map(edu => (
          <div key={edu.id} style={{ borderTop: "solid gray 2px" }}>
            <p>
              <strong>School:</strong> {edu.school}
            </p>
            <p>
              <strong>Study:</strong> {edu.study}
            </p>
            <p>
              <strong>Degree:</strong> {edu.degree}
            </p>
            <p>
              <strong>Start Date:</strong> {edu.startTime}
            </p>
            <p>
              <strong>End Date:</strong> {edu.endTime}
            </p>
          </div>
        ))
      : "None"
    : "Unknown";

  let workExperience = applicant.hasOwnProperty("workExperience")
    ? applicant.workExperience.length > 0
      ? applicant.workExperience.map(exp => (
          <div key={exp.id} style={{ borderTop: "solid gray 2px" }}>
            <p>
              <strong>Company Name:</strong> {exp.company}
            </p>
            <p>
              <strong>Company Industry:</strong> {exp.industry}
            </p>
            <p>
              <strong>Position Title:</strong> {exp.title}
            </p>
            <p>
              <strong>Position Summary:</strong> {exp.summary}
            </p>
            <p>
              <strong>Reason For Leaving:</strong> {exp.leaving}
            </p>
            <p>
              <strong>Start Date:</strong> {exp.startTime}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {exp.current ? <span>Now</span> : <span>{exp.endTime}</span>}
            </p>
          </div>
        ))
      : "None"
    : "Unknown";

  return (
    <div>
      <div className="resultsheaderapp">
        <center>
          <h1 style={{ color: "purple" }}>
            {applicant.firstName + "'s Submitted Application"}
          </h1>
        </center>
        <div className="card card-body bg-light mb-3">
          <h3 className="text-center" style={{ color: "purple" }}>
            Personal Information
          </h3>
          <p>
            <strong>First Name:</strong> {applicant.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {applicant.lastName}
          </p>
          <p>
            <strong>Address:</strong> {applicant.address || "Unknown"}
          </p>
          <p>
            <strong>City:</strong> {applicant.city || "Unknown"}
          </p>
          <p>
            <strong>State:</strong> {applicant.state || "Unknown"}
          </p>
          <p>
            <strong>ZIP Code:</strong> {applicant.zipCode || "Unknown"}
          </p>
          <p>
            <strong>Primary Contact:</strong> {applicant.phone || "Unknown"}
          </p>
          <p>
            <strong>Email:</strong> {applicant.email}
          </p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card card-body bg-light mb-3">
              <h3 className="text-center" style={{ color: "purple" }}>
                Experience
              </h3>
              {workExperience.length > 0 ? (
                <ul className="list-group">{workExperience}</ul>
              ) : (
                <p className="text-center">No Experience Listed</p>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="card card-body bg-light mb-3">
              <h3 className="text-center" style={{ color: "purple" }}>
                Education
              </h3>
              {education.length > 0 ? (
                <ul className="list-group">{education}</ul>
              ) : (
                <p className="text-center">No Education Listed</p>
              )}
            </div>
          </div>
        </div>
        <div className="card card-body bg-light mb-3">
          <h3 className="text-center" style={{ color: "purple" }}>
            Applicant Details
          </h3>
          {
            applicant.resumeUploaded ? (
              <div style={{ paddingBottom: '20px' }}>
                <a
                  href={resumeUrl}
                  target="_blank"
                  style={{
                    cursor: "pointer"
                  }}
                >
                  <i className="fas fa-file">View Resume</i>
                </a>
              </div>
            ) : ''
          }

          <p>
            <strong>Cover Letter:</strong> {applicant.coverLetter || "None"}
          </p>
          <p>
            <strong>Salary Requirements:</strong>{" "}
            {applicant.salaryRequirements || "None"}
          </p>
          <p>
            <strong>Is The Candidate Over The Age of 18:</strong> {isOver18}
          </p>
          <p>
            <strong>
              Is The Candidate Legally Allowed to Work in This State:
            </strong>{" "}
            {isLegal}
          </p>
          <p>
            <strong>Does the applicant have any felony charges:</strong>{" "}
            {isFelon}
          </p>
          {applicant.hasOwnProperty("felonyForm") ? (
            applicant.felon ? (
              <p>
                <strong>Description of felony charges:</strong>
                {felonyForm}
              </p>
            ) : null
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SubmittedApplication;
