import React, { Component } from "react";
import dateFormat from "dateformat";

import "./IndividualApplicant.css";
import { Link } from "react-router-dom";
import Spinner from "../../../components/UI/Spinner/Spinner";

class IndividualApplicant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      errorMsg: "",
    };

    this.token = localStorage.getItem("token");
  }

  onDelete = e => {
    e.preventDefault();

    const options = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        email: this.props.applicant.email,
        id: this.props.applicant._id
      })
    };

    this.setState(
      {
        isLoading: true
      },
      () => {
        // TODO
        fetch("/api/applicant/remove", options)
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

            this.props.deleteApplicant(this.props.applicant);
          })
          .catch(err => {
            this.setState({
              isLoading: false,
              isError: true,
              errorMsg: err.message
            });
            console.error(err);
          });
      }
    );
  };

  completionHandler = () => {
    if (this.props.applicant.status === 'COMPLETE') {
      return <p style={{ color: "green" }}>COMPLETE</p>;
    } else {
      return <p style={{ color: "red" }}>{this.props.applicant.status}</p>;
    }
  };

  render() {
    const { applicant } = this.props;

    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return <p>{this.state.errorMsg}</p>;
    }

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
              Created: <strong>{dateFormat(applicant.timestamp, "mmmm dS, yyyy")}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default IndividualApplicant;
