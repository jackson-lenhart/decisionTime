import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import Home from "./containers/Home/Home";

import Spinner from "./components/UI/Spinner/Spinner";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCompany: false,
      isApplicant: false,
      companyRouter: null,
      applicantComponent: null
    };
  }

  async componentDidMount() {
    const pathname = new URL(window.location.href).pathname;

    if (pathname.startsWith('/company')) {

      const companyModule = await import('./containers/Company/CompanyRouter');
      this.setState({ companyRouter: companyModule.default, isCompany: true });

    } else if (pathname.startsWith('/applicant')) {

      const applicantModule = await import('./containers/Applicant/Applicant');
      this.setState({ applicantComponent: applicantModule.default, isApplicant: true });

    }
  }

  render() {
    const { isCompany, isApplicant, companyRouter, applicantComponent } = this.state;

    return (
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/applicant/:token" component={ isApplicant ? applicantComponent : Spinner} />
        <Route path="/company" component={isCompany ? companyRouter : Spinner} />
      </div>
    );
  }
}

export default App;
