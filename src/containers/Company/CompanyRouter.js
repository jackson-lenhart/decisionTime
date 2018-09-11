import React, { Component } from "react";
import { Router } from "react-router";
import { Route } from "react-router-dom";

import CompanyLogin from "./CompanyLogin/CompanyLogin";
import Company from "./CompanyIndex/Company";
import CompanyNav from "./CompanyNav/CompanyNav";
import Jobs from "./Jobs";
import Messaging from "./Messaging/Messaging";
import ApplicantProfile from "./ApplicantProfile/ApplicantProfile";

import Navbar from "../.././components/UI/layout/Navbar";

import { loadDrift } from "../../utils/drift";

class CompanyRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: localStorage.getItem("isLoggedIn")
    };
  }

  componentDidMount() {
    if (
      this.state.isLoggedIn === "true" &&
      document.getElementById("driftScript") === null
    ) {
      loadDrift();
    }
  }

  login = () => {
    this.setState({ isLoggedIn: "true" });
    localStorage.setItem("isLoggedIn", "true");
    loadDrift();
  };

  logout = () => {
    this.setState({ isLoggedIn: "false" });
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", "false");
  };

  render() {
    const { isLoggedIn } = this.state;
    const { history } = this.props;

		return (
			<Router history={ history }>
				{
					isLoggedIn === "true" ?
						(
							<div>
								<Navbar history={ history } logout={ this.logout } />
								<CompanyNav />
								<Route exact path="/company" component={ Company } />
								<Route path="/company/jobs" component={ Jobs } />
								<Route path="/company/messaging" component={ Messaging } />
								<Route path="/company/applicant/:applicantId" component={ ApplicantProfile } />
							</div>
						) :
						(
							<div>
								<Route
									path="/company"
									render={ props => <CompanyLogin { ...props } login={ this.login } /> }
								/>
							</div>
						)
				}
			</Router>
		);
	}
}

export default CompanyRouter;
