import React, { Component } from "react";

import FinalResults from "./FinalResults/FinalResults";
import SubmittedApplication from "./SubmittedApplication/SubmittedApplication";
import ApplicantProfileHeader from "./ApplicantProfileHeader";

import Spinner from "../../../components/UI/Spinner/Spinner";

import "./ApplicantProfile.css";

class ApplicantProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			isError: false,
			errorMsg: "",
			applicant: {},
			pageChoice: "application"
		};

		this.token = localStorage.getItem("token");
		this.applicantId = props.match.params.applicantId
	}

	componentDidMount() {
		const options = {
			headers: {
				"Authorization": `Bearer ${this.token}`
			}
		};

		fetch(
			`/api/company/applicants/${this.applicantId}`,
			options
		).then(res => res.json())
		.then(data => {
			this.setState({
				isLoading: false,
				applicant: data.applicant
			});
		}).catch(err => {
			console.error(err);
			this.setState({
				isError: true,
				errorMsg: err.message
			});
		});
	}

	changePage = pageChoice =>
		this.setState({ pageChoice });

	renderPageChoice = choice =>
		choice === "application" ?
			<SubmittedApplication
				applicant={this.state.applicant}
			/> : <FinalResults
				applicant={this.state.applicant}
			/>;

  render() {
    const {
			isError,
			errorMsg,
			isLoading,
			pageChoice,
		} = this.state;

    if (isError) {
      return <p>{errorMsg}</p>;
    }

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <div>
        <div className="profilenav">
          <ApplicantProfileHeader changePage={this.changePage} />
        </div>
        {this.renderPageChoice(pageChoice)}
      </div>
    );
  }
}

export default ApplicantProfile;
