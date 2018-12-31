import React, { Component } from "react";

import Test from "./Test/Test";
import TestIntro from "./TestIntro/TestIntro";
import TestFinished from './TestFinished/TestFinished';
import Spinner from "../../components/UI/Spinner/Spinner";

class Applicant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      applicant: {},
      exam: [],
      secondsElapsed: 0
    };

    this.startTest = this.startTest.bind(this);
    this.propagateError = this.propagateError.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.redirectToFinished = this.redirectToFinished.bind(this);

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

      if (applicant.status === 'NOT_VERIFIED') {
        const res = await fetch('/api/applicant/verify', options);

        if (res.status === 200) {
          this.setState({
            applicant: {
              ...applicant,
              status: 'VERIFIED'
            },
            exam: applicant.exam,
            isLoading: false
          });
        } else {
          throw new Error(`Unexpected status code on verification ${res.status}`);
        }
      } else {
        this.setState({ applicant, exam: applicant.exam, isLoading: false });
      }
    } catch (err) {
      this.setState({ isError: true });
      console.error(err);
    }
  }

  startTest() {

    // TODO: Make this use token as well
    fetch(`/api/applicant/test-timestamp/${this.state.applicant._id}`)
      .then(res => {
        if (res.status === 200) {
          this.setState(prevState => ({
            applicant: {
              ...prevState.applicant,
              status: 'BEGUN_EXAM'
            }
          }));
        }
      })
      .catch(err => console.error(err));
  };

  redirectToFinished() {
    this.setState(prevState => ({
      applicant: {
        ...prevState.applicant,
        status: 'COMPLETE'
      }
    }));
  }

  propagateError() {
    this.setState({ isError: true });
  }

  handleChange(e) {
    this.setState({
      answers: {
        ...this.state.answers,
        [e.target.id]: e.target.value
      }
    });
  }

  renderStatus() {
    const { status } = this.state.applicant;

    switch (status) {
      case 'VERIFIED':
        return <TestIntro
          applicant={this.state.applicant}
          startTest={this.startTest}
          companyName={this.companyName}
          jobTitle={this.jobTitle}
        />;
        break;

      case 'BEGUN_EXAM':
        return <Test
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
        />;
        break;

      case 'COMPLETE':
        return <TestFinished />;
        break;

      default:
        this.setState({ isError: true });
        console.error(`Unexpected status ${status} in renderStatus`);
    }
  }

  render() {
    if (this.state.isError) {
      return <p>There was an error.</p>;
    }

    if (this.state.isLoading) {
      return <Spinner />;
    }

    return <div>{this.renderStatus()}</div>;
  }
}

export default Applicant;
