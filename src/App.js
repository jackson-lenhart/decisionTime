import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import CompanyRouter from "./containers/Company/CompanyRouter";
import Applicant from "./containers/Applicant/Applicant";
import TestFinished from "./containers/Applicant/TestFinished/TestFinished";
import JobDescript from "./containers/Applicant/JobDescript/JobDescript";
import Application from "./containers/Applicant/Application/Application";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/applicant/:id" component={Applicant} />
        <Route path="/company" component={CompanyRouter} />
        <Route path="/test-finished" component={TestFinished} />
        <Route
          path="/job-description/:companyId/:jobId"
          component={JobDescript}
        />
        <Route path="/application/:companyId/:jobId" component={Application} />
      </div>
    );
  }
}

export default App;
