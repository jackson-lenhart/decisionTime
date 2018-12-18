import React, { Component } from "react";
import shortid from "shortid";
import _ from "lodash";
import "./Profile.css";
import TextFieldGroup from "../../../../../components/UI/Form/TextFieldGroup";
import TextAreaFieldGroup from "../../../../../components/UI/Form/TextAreaFieldGroup";
// import EducationInput from './EducationInput/EducationInput';

const initialState = {
  experienceFormMounted: false,
  company: "",
  industry: "",
  title: "",
  startTime: "",
  endTime: "",
  current: false,
  description: "",
  leaving: "",
  disabled: false
};

class ExperienceProfile extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.handleChange = this.handleChange.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onCheck = event => {
    this.setState({
      disabled: !this.state.disabled,
      current: !this.state.current
    });
  };

  submitExperienceHandler = event => {
    event.preventDefault();
    let experienceObj = {
      id: shortid.generate(),
      ..._.omit(this.state, ["experienceFormMounted", "disabled"])
    };

    this.props.addExperience(experienceObj);
    this.setState(initialState);
  };

  toggleExperienceForm = () => {
    this.setState(prevState => ({
      experienceFormMounted: !prevState.experienceFormMounted
    }));
  };

  deleteExperienceHandler = (exp, event) => {
    event.preventDefault();
    let experience = this.state.workExperience.indexOf(exp);
    let workExperience = this.state.workExperience;
    workExperience.splice(experience, 1);
    this.setState({
      workExperience
    });
  };

  render() {
    let experienceForm = null;
    if (this.state.experienceFormMounted) {
      experienceForm = (
        <div className="profileinput">
          <div className="form-group">
            <div style={{ paddingTop: "10px" }}>
              <TextFieldGroup
                name="company"
                type="text"
                placeholder="Company (required)"
                onChange={this.handleChange}
                info="Please provide the companies name that you worked for"
              />
            </div>
          </div>
          <div className="form-group">
            <TextFieldGroup
              name="industry"
              type="text"
              placeholder="Type of industry"
              onChange={this.handleChange}
              info="What category of industry does this company fall under"
            />
          </div>
          <div className="form-group">
            <TextFieldGroup
              name="title"
              type="text"
              placeholder="Your title"
              onChange={this.handleChange}
              info="What was your job title"
            />
          </div>
          <span>
            <h6>Start Date</h6>
            <div className="form-group">
              <TextFieldGroup
                type="date"
                name="startTime"
                placeholder="Start Date"
                value={this.state.startTime}
                onChange={this.handleChange}
                info="When did you start working for this company"
              />
            </div>
            <div className="form-group">
              <TextFieldGroup
                type="date"
                name="endTime"
                placeholder="End Date"
                value={this.state.endTime}
                onChange={this.handleChange}
                info="When did you stop working for this company"
                disabled={this.state.current ? "disabled" : ""}
              />
            </div>
            <div className="form-check md-4">
              <input
                type="checkbox"
                className="form-check-input"
                value={this.state.current}
                checked={this.state.current}
                onChange={this.onCheck}
                id="current"
              />
              <label htmlFor="current" className="form-check-label">
                Current job
              </label>
            </div>
            <div className="form-group">
              <TextAreaFieldGroup
                name="description"
                type="text"
                placeholder="Description of what you did"
                onChange={this.handleChange}
                info="Please provide a description of what you did in a few sentences"
              />
            </div>
            <div className="form-group">
              <TextAreaFieldGroup
                name="leaving"
                type="text"
                placeholder="What was the reaspon for leaving"
                onChange={this.handleChange}
                info="What was your reason for leaving"
              />
            </div>
            <br />
          </span>
          <span>
            <a
              style={{
                textDecoration: "underline",
                color: "blue",
                paddingRight: "20px"
              }}
              onClick={this.toggleExperienceForm}
            >
              Cancel
            </a>
            <button type="button" onClick={this.submitExperienceHandler}>
              Complete
            </button>
          </span>
        </div>
      );
    }
    return (
      <div className="profileinfo">
        <div className="subheader">
          <label>Employment History</label>
        </div>
        {this.props.experience.map(exp => (
          <div className="completed" key={exp.id}>
            <p>
              <strong>Company: </strong>
              {exp.company}
            </p>
            <p>
              <strong>Industry: </strong>
              {exp.industry}
            </p>
            <p>
              <strong>Title: </strong>
              {exp.title}
            </p>
            <p>
              <strong>From: </strong>
              {exp.startTime} <strong>To: </strong>
              {exp.current ? " Now" : exp.endTime}
            </p>
            <p>
              <strong>Description: </strong>
              {exp.description}
            </p>
            <p>
              <strong>Reason for leaving: </strong>
              {exp.leaving}
            </p>
            <button
              type="button"
              onClick={() => this.props.removeExperience(exp.id)}
            >
              Delete
            </button>
          </div>
        ))}
        {experienceForm}
        <div style={{ padding: "15px" }}>
          {this.state.experienceFormMounted ? null : (
            <button type="button" onClick={this.toggleExperienceForm}>
              Add experience
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default ExperienceProfile;
