import React, { Component } from "react";

import Spinner from "../../../../components/UI/Spinner/Spinner";
import TextAreaFieldGroup from "../../../../components/UI/Form/TextAreaFieldGroup";
import "./Profile/Profile.css";

class ApplicationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resume: null,
      errorMsg: "",
      success: false,
      isLoading: false
    };
  }

  uploadResume = () => {
    if (this.state.resume === null) {
      return this.setState({
        errorMsg: "Error: please select your resume"
      });
    }

    this.setState({
      isLoading: true
    }, () => {
      const options = {
        headers: {
          "Content-Type": "application/pdf"
        },
        method: "POST",
        body: this.state.resume
      };

      const {
        companyId,
        applicantId,
        jobId,
        toggleResumeUploaded
      } = this.props;

      fetch(
        `/api/resume/${companyId}/${applicantId}/${jobId}`
      , options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (!data.success) {
          return this.setState({
            isLoading: false,
            errorMsg: "Could not upload resume"
          });
        }
        this.setState({
          isLoading: false,
          success: true,
          successMsg: "Uploaded resume!"
        });
        toggleResumeUploaded();
      })
      .catch(err => {
        console.error(err);
      });
    });
  };

  selectFile = e =>
    this.setState({
      resume: e.target.files[0]
    });

  render() {
    const { isLoading, success, errorMsg } = this.state;

    return (
      <div className="profileinfo">
        <div className="subheader">
          <label>Application Details</label>
        </div>
        <div className="profileinput">
          {
            isLoading ?
              <Spinner /> :
              success ?
                <p style={{ color: 'green' }}>Uploaded resume!</p> :
                <div>
                  <label htmlFor="resume">Resume:</label>
                  <input type="file" accept=".pdf" name="resume" onChange={this.selectFile} />
                  <button type="button" onClick={this.uploadResume}>Upload</button>
                  <p style={{ color: 'red' }}>{errorMsg}</p>
                </div>
          }
          <TextAreaFieldGroup
            name="coverLetter"
            placeholder="Cover Letter"
            onChange={this.props.handleChange}
            info="Please put together a cover letter describing why you would be a fit at this company"
          />
          <TextAreaFieldGroup
            name="salaryRequirements"
            placeholder="Salary Requirements"
            onChange={this.props.handleChange}
            info="Please specify any salary requirents you may have"
          />
        </div>
      </div>
    );
  }
}

export default ApplicationDetails;
