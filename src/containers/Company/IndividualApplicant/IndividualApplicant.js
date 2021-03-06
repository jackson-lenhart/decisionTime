import React, { Component } from "react";
import dateFormat from "dateformat";

import "./IndividualApplicant.css";
import { Link } from "react-router-dom";

class IndividualApplicant extends Component {
  constructor(props) {
    super(props);

    // might not even need this constructor...
    // thinking it could be just a function and pass token as prop
    // leaving it for now
    this.token = localStorage.getItem("token");
  }

  completionHandler() {
    const { status } = this.props.applicant;
    switch (status) {
      case 'COMPLETE':
        return <p style={{ color: "green" }}>Complete!</p>;
        break;
      case 'BEGUN_EXAM':
        return <p style={{ color: "orange" }}>In Progress</p>;
        break;
      case 'VERIFIED':
        return <p style={{ color: "blue" }}>Verified</p>;
        break;
      case 'NOT_VERIFIED':
        return <p style={{ color: "red" }}>Not Verified</p>;
        break;
      default:
        console.error('Status value ' + status + 'not in status enum');
        return '';
    }
  }

  render() {
    const { applicant } = this.props;

    return (
      <div className="Applicant">
        <div className="padding" style={{ color: "green" }}>
          <strong>{this.completionHandler()}</strong>
        </div>
        <div className="name">
          <span>{this.props.applicant.lastName}</span>
          <div style={{ paddingBottom: "12px" }}>
            {" "}
            {this.props.applicant.firstName}
          </div>
        </div>
        <div className="align">
          <div className="email">
            <p>{this.props.applicant.jobTitle}</p>
          </div>
          <div className="padding">
          </div>
          <div className="padding">
            <div>
              <strong>
                <Link
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline"
                  }}
                  to={`/company/applicant/${this.props.applicant._id}`}
                >
                  <div style={{ paddingBottom: "25px" }}>VIEW</div>
                </Link>
              </strong>
            </div>
          </div>
          <div style={{
            paddingTop: '15px'
          }}>
            <p style={{fontSize:"10px"}}>
              Created: <strong>{dateFormat(applicant.createdAt, "mmmm dS, yyyy")}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default IndividualApplicant;
