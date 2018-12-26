import React, { Component } from "react";

// import NewApplicant from "../NewApplicant/NewApplicant";
import ApplicantList from "../ApplicantList";
import Spinner from "../../../components/UI/Spinner/Spinner";
import "./index.css";
import ApplicantHeader from "../ApplicantHeader/ApplicantHeader";

class Applicants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      errorMsg: null,
      applicants: [],
      companyName: "",
      search: ""
    };

    this.updateSearch = this.updateSearch.bind(this);

    this.token = localStorage.getItem("token");
  }

  componentDidMount() {
    const options = {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };
    fetch("/api/company/applicants", options)
    .then(res => res.json())
    .then(data => {
      const { companyName, applicants } = data;
      this.setState({
        companyName,
        applicants,
        isLoading: false
      });
    })
    .catch(err => {
      console.error(err);
      this.setState({
        isLoading: false,
        isError: true,
        errorMsg: err.message
      });
    });
  }

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) });
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return <p>{this.state.errorMsg}</p>;
    }

    let applicantList = "";
    if (this.state.applicants.length > 0) {
      applicantList = (
        <ApplicantList
          applicants={this.state.applicants}
          deleteApplicant={this.deleteApplicant}
          editApplicant={this.editApplicant}
          searchedApplicant={this.state.search}
        />
      );
    } else {
      applicantList = <p>No applicants for this company yet.</p>;
    }

    return (
      <div className="Company">
        <div>
          <div className="applicantList">
            <strong>Search Applicant by Last Name</strong>
            <br />
            <input
              type="text"
              value={this.state.search}
              onChange={this.updateSearch}
              placeholder="Type last name here.."
            />
          </div>
          <ApplicantHeader />
          <div className="CompanyApplicantList">{applicantList}</div>
        </div>
      </div>
    );
  }
}

export default Applicants;
