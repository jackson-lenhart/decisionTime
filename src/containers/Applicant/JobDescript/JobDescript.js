import React, { Component } from "react";

import Spinner from "../../../components/UI/Spinner/Spinner";
import "./JobDescript.css";

class JobDescript extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      companyName: "",
      title: "",
      description: ""
    };

    this.companyId = props.match.params.companyId;
    this.jobId = props.match.params.jobId;

    this.routeToApplication = this.routeToApplication.bind(this);
  }

  componentDidMount() {
    if (!this.companyId || !this.jobId) {
      return this.setState({
        isLoading: false,
        isError: true
      });
    }

    const options = {
      headers: {
        'Authorization': `Bearer: `
      }
    };
    fetch(`/api/job/${this.companyId}/${this.jobId}`, options)
      .then(res => res.json())
      .then(data => {
        this.setState({
          isLoading: false,
          title: data.title,
          description: data.description,
          companyName: data.companyName
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          isLoading: false,
          isError: true
        });
      });
  }

  routeToApplication() {
    this.props.history.push(
      `/application/${this.state.companyName}/${this.state.title}/${
        this.companyId
      }/${this.jobId}`
    );
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return (
        <p>Error: could not fetch Job Description. URL may be malformed</p>
      );
    }

    return (
      <div className="jobdescript">
        <div className="descriptionTop">
          <h3>{this.state.companyName}</h3>
          <p>
            Position being applied for - <strong>{this.state.title}</strong>
          </p>
        </div>
        <h5>DESCRIPTION</h5>
        <pre
          style={{
            textAlign: "left",
            width: "100%",
            whiteSpace: "pre-wrap"
          }}
        >
          <p>{this.state.description}</p>
        </pre>
        <div style={{ padding: "10px" }}>
          <button
            type="button"
            className="jobdescriptbtn"
            onClick={this.routeToApplication}
          >
            Apply for this job
          </button>
        </div>
      </div>
    );
  }
}

export default JobDescript;
