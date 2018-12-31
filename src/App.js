import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import CompanyRouter from "./containers/Company/CompanyRouter";
import Applicant from "./containers/Applicant/Applicant";
import TestFinished from "./containers/Applicant/TestFinished/TestFinished";
import JobDescript from "./containers/Applicant/JobDescript/JobDescript";
import Application from "./containers/Applicant/Application/Application";
import ResumeUpload from "./containers/Applicant/Application/ResumeUpload";
import Home from "./containers/Home/Home";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route
          path="/applicant/:token"
          component={Applicant}
        />
        <Route path="/company" component={CompanyRouter} />
        <Route path="/test-finished" component={TestFinished} />
        <Route
          path="/job-description/:companyId/:jobId"
          component={JobDescript}
        />
        <Route
          path="/application/:companyName/:jobTitle/:companyId/:jobId"
          component={Application}
        />
        <Route
          path="/application/resume/:companyId/:applicantId"
          component={ResumeUpload}
        />
      </div>
    );
  }
}

export default App;
