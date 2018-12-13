import React, { Component } from "react";
import hat from "hat";

import Spinner from "../../../components/UI/Spinner/Spinner";
import "./NewApplicant.css";

class NewApplicant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      errorMsg: "",
      firstName: "",
      lastName: "",
      email: "",
      job: {
        id: "",
        title: ""
      }
    };

    this.token = localStorage.getItem("token");
  }

  componentDidMount() {
    if (this.props.jobs.length > 0) {
      return;
    }

    this.setState(
      {
        isLoading: true
      },
      () => {
        const options = {
          headers: {
            Authorization: `Bearer ${this.props.token}`
          }
        };

        fetch("/api/job/", options)
          .then(res => res.json())
          .then(data => {
            console.log(data);
            this.props.putJobsInState(data.jobs);
            this.setState({ isLoading: false });
          })
          .catch(err => {
            console.error(err);
            this.setState({
              isError: true,
              isLoading: false
            });
          });
      }
    );
  }

  createHandler = e => {
    e.preventDefault();

    if (this.state.job.id.length === 0) {
      return this.setState({
        errorMsg: "Please select a job"
      });
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "email"
    ];

    const isValid = requiredFields.reduce((acc, x) =>
      (this.state[x].length > 0) && acc
    , true);

    if (!isValid) {
      return this.setState({
        errorMsg: "Please fill out all fields"
      });
    }

    const id = hat();

    const applicant = {
      id,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      jobId: this.state.job.id,
      jobTitle: this.state.job.title
    };

    const options = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(applicant)
    };

    this.setState({
      isLoading: true
    }, () => {
      fetch("/api/company/create-applicant", options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (!data.success) {
          return this.setState({
            isLoading: false,
            isError: true,
            errorMsg: data.msg
          });
        }

        this.props.createApplicant(applicant);
      })
      .catch(err => {
        console.error(err);
        this.setState({
          isError: true,
          isLoading: false,
          errorMsg: err.message
        });
      });
    });
  };

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  handleJobChange = e => {
    const [title, id] = e.target.value.split(',');
    this.setState({
      job: {
        title,
        id
      }
    });
  };

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return <p>Error loading jobs</p>;
    }

    if (this.props.jobs.length === 0) {
      return (
        <div>
          <p>No jobs yet created for this company.</p>
          <p>Please create at least one job before creating applicants</p>
        </div>
      );
    }

    let errorMsg = "";
    if (this.state.errorMsg.length > 0) {
      errorMsg = <p style={{ color: "red" }}>{this.state.errorMsg}</p>;
    }

    return (
      <div className="createapplicantform">
        <form>
          <label className="formHeader">
            Fill Out New Applicant Form Below
          </label>
          <div className="input">
            <input
              type="text"
              placeholder="Type first name here..."
              name="firstName"
              onChange={this.handleChange}
            />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Type last name here..."
              name="lastName"
              onChange={this.handleChange}
            />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Type email here..."
              name="email"
              onChange={this.handleChange}
            />
          </div>
          <div className="input">
            <select
              name="job"
              defaultValue=""
              onChange={this.handleJobChange}
            >
              <option value="" disabled hidden>
                Assign Job
              </option>
              {this.props.jobs.map(x => (
                <option key={x._id} value={[x.title, x._id].join(',')}>
                  {x.title}
                </option>
              ))}
            </select>
          </div>
          <div className="btn">
            <a className="individualBtn" onClick={this.createHandler}>
              Create
            </a>
            <a
              className="individualBtn"
              onClick={this.props.toggleCreateApplicant}
            >
              Cancel
            </a>
          </div>
          <br />
          {errorMsg}
        </form>
      </div>
    );
  }
}

export default NewApplicant;
