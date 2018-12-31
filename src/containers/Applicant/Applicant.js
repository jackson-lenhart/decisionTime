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

    this.token = props.match.params.token;
  }

  async componentDidMount() {
    const options = {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };

    try {
      const response = await fetch('/api/applicant/gateway', options)
      const applicant = await response.json();

      switch (applicant.status) {
        case 'COMPLETE':
          // TODO: Maybe get rid of all these setStates
          // and have a render function that switches on applicant.status
          this.setState({
            isLoading: false,
            isAuth: true,
            isCompleted: true
          });
          break;
        case 'BEGUN_EXAM':
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
          break;
        case 'VERIFIED':
          this.setState({
            applicant,
            exam: applicant.exam,
            isLoading: false,
            isAuth: true
          });
          break;
        case 'NOT_VERIFIED':
          const res = await fetch('/api/applicant/verify', options);

          if (res.status === 200) {
            this.setState({
              applicant: {
                ...applicant,
                status: 'VERIFIED'
              },
              exam: applicant.exam,
              isLoading: false,
              isAuth: true
            });
          } else {
            throw new Error(`Unexpected status code on verification ${res.status}`);
          }
          break;
        default:
          throw new Error(`Applicant status ${applicant.status} not in status enum`);
      }
    } catch (err) {
      this.setState({ isError: true });
      console.error(err);
    }
  }

  // we may want to put this in TestIntro at some point?
  startTest = () => {

    // TODO: Make this use token as well
    fetch(`/api/applicant/test-timestamp/${this.state.applicant._id}`)
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
        id={this.state.applicant.id}
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
