import React from "react";
import "./Test.css";

import Question from "../../../components/Question";

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: {},
      secondsElapsed: props.secondsElapsed
    };

    this.incrementer = null;
  }

  componentDidMount() {
    this.incrementer = setInterval(
      () =>
        this.setState({
          secondsElapsed: this.state.secondsElapsed + 1
        }),
      1000
    );
  }

  handleChange = e =>
    this.setState({
      answers: {
        ...this.state.answers,
        [e.target.name]: e.target.value
      }
    });

  handleSubmit = () => {
    clearInterval(this.incrementer);

    const answers = this.props.test.map(q => ({
      questionId: q._id,
      answerType: q.questionType,
      body: this.state.answers[q._id]
    }));

    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        answers,
        questions: this.props.test,
        jobId: this.props.jobId,
        applicantId: this.props.applicant._id,
        secondsElapsed: this.state.secondsElapsed
      })
    };

    fetch(
      `/api/screening/results`,
      options
    )
      .then(res => {
        if (res.status === 200) {
          this.props.redirectToFinished();
        } else {
          this.props.propagateError();
        }
      })
      .catch(err => console.error(err));
  };

  formattedSeconds = sec =>
    Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);

  render() {
    const test = this.props.test.map((x, i) => (
      <div key={x._id}>
        <Question question={x} index={i} handleChange={this.handleChange} />
      </div>
    ));

    return (
      <div className="testform">
        <h1 style={{ color: "purple", paddingBottom: "30px" }}>
          BEGIN TESTING NOW
        </h1>
        <h1 className="timer">
          {this.formattedSeconds(this.state.secondsElapsed)}
        </h1>
        {test}
        <div className="testformbtnarea">
          <a
            onClick={this.handleSubmit}
            className="testformbtn"
            style={{ color: "white" }}
          >
            SUBMIT
          </a>
        </div>
      </div>
    );
  }
}

export default Test;
