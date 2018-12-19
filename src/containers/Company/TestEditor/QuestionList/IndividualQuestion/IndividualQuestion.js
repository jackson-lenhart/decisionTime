import React, { Component } from "react";

import EditQuestion from "../../EditQuestion";
import ActionButtons from "../../../../../components/UI/Buttons/ActionButtons";
import Spinner from "../../../../../components/UI/Spinner/Spinner";
import "./IndividualQuestion.css";

class IndividualQuestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isError: false,
      editQuestionMounted: false
    };

    this.toggleEditQuestion = this.toggleEditQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
  }

  toggleEditQuestion() {
    this.setState(prevState => ({
      editQuestionMounted: !prevState.editQuestionMounted
    }));
  }

  deleteQuestion = () => {
    const newTest = this.props.test.filter(
      x => x._id !== this.props.question._id
    );

    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.token}`
      },
      method: "POST",
      body: JSON.stringify({
        screeningId: this.props.jobId,
        questions: newTest
      })
    };

    this.setState(
      {
        isLoading: true
      },
      () => {
        fetch("/api/screening/edit", options)
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              console.log(data);
              return this.setState({
                isError: true,
                isLoading: false
              });
            }
            console.log(data);
            this.setState(
              {
                isLoading: false
              },
              () => this.props.deleteQuestionInState(this.props.question._id)
            );
          })
          .catch(err => console.error(err));
      }
    );
  };

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return <p>Error</p>;
    }

    let question = "";
    let editQuestion = "";
    let actionBtns = "";
    if (this.state.editQuestionMounted) {
      editQuestion = (
        <EditQuestion
          question={this.props.question}
          toggleEditQuestion={this.toggleEditQuestion}
          test={this.props.test}
          jobId={this.props.jobId}
          examId={this.props.examId}
          editQuestion={this.props.editQuestion}
          token={this.props.token}
        />
      );
    } else {
      switch (this.props.question.questionType) {
        case "OPEN_RESPONSE":
          question = (
            <pre
              style={{
                textAlign: "left",
                width: "95%",
                whiteSpace: "pre-wrap"
              }}
            >
              <p>
                {this.props.index + 1}. {this.props.question.body}
              </p>
            </pre>
          );
          break;
        case "MULTIPLE_CHOICE":
          question = (
            <pre>
              <p>
                {this.props.index + 1}. {this.props.question.body}
              </p>
              {this.props.question.options.map(x => {
                let highlighter = {};
                if (x.correct) {
                  highlighter = {
                    color: "green"
                  };
                }
                return (
                  <div key={x._id}>
                    <strong style={highlighter}>{x.body}</strong>
                  </div>
                );
              })}
            </pre>
          );
          break;
        default:
          console.error("Invalid question type");
          console.log('Question:', this.props.question);
          return <p>Error</p>;
      }
      actionBtns = (
        <ActionButtons
          isEditing={false}
          editHandler={this.toggleEditQuestion}
          deleteHandler={this.deleteQuestion}
        />
      );
    }

    return (
      <div className="indyquestion">
        <span>
          {this.state.isLoading ? (
            <Spinner />
          ) : (
            <div>
              {question}
              {editQuestion}
              <div className="actionbtn">{actionBtns}</div>
            </div>
          )}
        </span>
      </div>
    );
  }
}

export default IndividualQuestion;
