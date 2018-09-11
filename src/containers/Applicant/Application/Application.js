import React, { Component } from "react";
import { omit } from "ramda";
import Toggle from "react-toggle";
import hat from "hat";

import ApplicationDetails from "./Input/ApplicationDetails";
import EducationProfile from "./Input/Profile/EducationProfile";
import PersonalInformation from "./Input/PersonalInformation";
import ExperienceProfile from "./Input/Profile/ExperienceProfile";
import Spinner from "../../../components/UI/Spinner/Spinner";

import "./Application.css";
import "./Input/PersonalInformation.css";
import TextAreaFieldGroup from "../../../components/UI/Form/TextAreaFieldGroup";

class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errorMsg: "",
      invalidFields: [],
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
      workExperience: [],
      education: [],
      coverLetter: "",
      salaryRequirements: "",
      felonyForm: "",
      over18: false,
      legal: false,
      felon: false,
      resumeUploaded: false
    };

    this.toggleResumeUploaded = this.toggleResumeUploaded.bind(this);

    this.companyName = decodeURIComponent(props.match.params.companyName);
    this.jobTitle = decodeURIComponent(props.match.params.jobTitle);
    this.companyId = props.match.params.companyId;
    this.jobId = props.match.params.jobId;
    this.applicantId = hat();
  }

  handleSubmit = () => {
    const invalidFields = [
      "firstName",
      "lastName",
      "address",
      "city",
      "state",
      "zipCode",
      "phone",
      "email"
    ].filter(x => this.state[x].length === 0);

    if (invalidFields.length > 0) {
      return this.setState(
        {
          invalidFields,
          errorMsg: "Please fill out all the required fields"
        },
        window.scrollTo(0, 0)
      );
    }

    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        applicantId: this.applicantId,
        companyId: this.companyId,
        companyName: this.companyName,
        jobId: this.jobId,
        jobTitle: this.jobTitle,
        ...omit(["isLoading", "errorMsg", "invalidFields"], this.state)
      })
    };

    this.setState(
      {
        isLoading: true
      },
      () => {
        fetch("/api/applicant/application", options)
          .then(res => res.json())
          .then(data => {
            console.log(data);
            console.log(this.state);
            if (!data.success) {
              return this.setState(
                {
                  errorMsg: data.msg,
                  isLoading: false
                },
                () => window.scrollTo(0, 0)
              );
            }

            this.props.history.push(
              `/applicant/${this.companyName}/${this.jobTitle}/${
                this.applicantId
              }`
            );
          })
          .catch(err => console.log(err));
      }
    );
  };

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  over18Handler = () =>
    this.setState(prevState => ({
      over18: !prevState.over18
    }));

  legalHandler = () =>
    this.setState(prevState => ({
      legal: !prevState.legal
    }));

  isFelonHandler = () => {
    this.setState(prevState => ({
      felon: !prevState.felon
    }));
  };

  addEducation = educationObj =>
    this.setState(prevState => ({
      education: prevState.education.concat(educationObj)
    }));

  removeEducation = id =>
    this.setState(prevState => ({
      education: prevState.education.filter(x => x.id !== id)
    }));

  addExperience = experienceObj =>
    this.setState(prevState => ({
      workExperience: prevState.workExperience.concat(experienceObj)
    }));

  removeExperience = id =>
    this.setState(prevState => ({
      workExperience: prevState.workExperience.filter(x => x.id !== id)
    }));

  toggleResumeUploaded() {
    this.setState(prevState => ({
      resumeUploaded: !prevState.resumeUploaded
    }));
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }

    let felonyForm = null;

    if (this.state.felon) {
      felonyForm = (
        <TextAreaFieldGroup
          name="felonyForm"
          type="text"
          onChange={this.handleChange}
          info="If yes, explain the number of convictions as well as the nature of each one."
        />
      );
    }

    return (
      <div className="Form">
        <h3 className="applicationheader">Application Form</h3>
        <form>
          {this.state.errorMsg.length > 0 ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "red" }}>{this.state.errorMsg}</p>
            </div>
          ) : (
            ""
          )}
          <PersonalInformation
            invalidFields={this.state.invalidFields}
            handleChange={this.handleChange}
          />
          <EducationProfile
            addEducation={this.addEducation}
            removeEducation={this.removeEducation}
            education={this.state.education}
          />
          <ExperienceProfile
            handleChange={this.handleChange}
            workExperience={this.state.workExperience}
            addExperience={this.addExperience}
            removeExperience={this.removeExperience}
          />
          <ApplicationDetails
            applicantId={this.applicantId}
            companyId={this.companyId}
            jobId={this.jobId}
            handleChange={this.handleChange}
            toggleResumeUploaded={this.toggleResumeUploaded}
          />
          <div className="personalinfo">
            <div className="bottomform">
              <label className="react-toggle" style={{ padding: "20px 0px" }}>
                <span style={{ padding: "10px" }}>
                  Are you 18 years or older?
                </span>
                <Toggle
                  defaultChecked={this.state.over18}
                  onChange={this.over18Handler}
                />
              </label>
            </div>
            <div className="bottomform">
              <label className="react-toggle" style={{ padding: "20px 0px" }}>
                <span style={{ padding: "10px" }}>
                  Are you a citizen of the U.S. or do you have a legal right to
                  work in the U.S.?
                </span>
                <Toggle
                  defaultChecked={this.state.legal}
                  onChange={this.legalHandler}
                />
              </label>
            </div>
            <div className="bottomform">
              <label className="react-toggle" style={{ padding: "20px 0px" }}>
                <span style={{ padding: "10px" }}>
                  Have you ever been convicted of a felony?
                </span>
                <Toggle
                  defaultChecked={this.state.felon}
                  onChange={this.isFelonHandler}
                />
              </label>
              {felonyForm}
            </div>
            <div className="bottomform">
              <div style={{ color: "red" }}>
                <label>
                  <strong>
                    Once you have finished filling out the application and hit
                    submit below, you will be prompted to take a timed
                    assessment. Please answer all the questions to the best of
                    your ability. Thank you!
                  </strong>
                </label>
              </div>
            </div>
            <div className="bottomform">
              <button
                type="button"
                style={{ padding: "10px 30px", color: "purple" }}
                onClick={this.handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Application;
