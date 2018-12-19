import React, { Component } from "react";

import Test from "./Test/Test";
import TestIntro from "./TestIntro/TestIntro";
import Spinner from "../../components/UI/Spinner/Spinner";

class Applicant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isCompleted: false,
      isAuth: false,
      isError: false,
      applicant: {},
      exam: [],
      secondsElapsed: 0,
      buttonClicked: false
    };

    this.companyName = props.match.params.companyName;
    this.jobId = props.match.params.jobId;
    this.id = props.match.params.id;
  }

  componentDidMount() {
    if (!this.id) {
      this.props.history.push("/");
      return;
    }

    fetch(`/api/applicant/${this.id}`)
      .then(res => {
        return res.status === 403 ? Promise.reject("Auth denied") : res.json();
      })
      .then(applicant => {
        if (applicant.status === 'COMPLETE') {
          this.setState({
            isLoading: false,
            isAuth: true,
            isCompleted: true
          });
        } else if (applicant.status === 'BEGUN_EXAM') {
          this.setState(
            {
              applicant,
              exam: applicant.exam,
              isLoading: false,
              secondsElapsed: Math.floor((Date.now() - applicant.testTimestamp) / 1000),
              isAuth: true
            },
            this.changePageHandler
          );
        } else {
          // Here we haven't yet begun the test
          this.setState({
            applicant,
            exam: applicant.exam,
            isLoading: false,
            isAuth: true
          });
        }
      })
      .catch(err => console.error(err));
  }

  // we may want to put this in TestIntro at some point?
  startTest = () => {
    if (!this.id) {
      this.props.history.push("/");
      return;
    }

    fetch(`/api/applicant/test-timestamp/${this.id}`)
      .then(res => {
        if (res.status === 200) {
          this.changePageHandler();
        }
      })
      .catch(err => console.error(err));
  };

  redirectToFinished = () => {
    this.props.history.push("/test-finished");
  };

  propagateError = () =>
    this.setState({ isError: true });

  changePageHandler = () =>
    this.setState({ buttonClicked: !this.state.buttonClicked });

  handleChange = e => {
    this.setState({
      answers: {
        ...this.state.answers,
        [e.target.id]: e.target.value
      }
    });
  };

  formattedSeconds = sec => {
    return Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);
  };

  render() {
    if (this.state.isError) {
      return <p>There was an error.</p>;
    }

    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (!this.state.isAuth) {
      return <p>Invalid token</p>;
    }

    if (this.state.isCompleted) {
      return <p>You have already completed the test!</p>;
    }

    let pageChoice = !this.state.buttonClicked ? (
      <TestIntro
        applicant={this.state.applicant}
        startTest={this.startTest}
        companyName={this.companyName}
        jobTitle={this.jobTitle}
      />
    ) : (
      <Test
        id={this.id}
        test={this.state.exam}
        secondsElapsed={this.state.secondsElapsed}
        applicant={this.state.applicant}
        propagateError={this.propagateError}
        handleChange={this.handleChange}
        redirectToFinished={this.redirectToFinished}
        companyName={this.companyName}
        jobTitle={this.jobTitle}
        jobId={this.jobId}
      />
    );

    return <div>{pageChoice}</div>;
  }
}

export default Applicant;
