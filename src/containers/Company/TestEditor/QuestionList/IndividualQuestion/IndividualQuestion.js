import React, { Component } from "react";
import shortid from "shortid";

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

  componentWillMount() {
    console.log("QUESTION:", this.props.question.body)
  }

  toggleEditQuestion() {
    this.setState(prevState => ({
      editQuestionMounted: !prevState.editQuestionMounted
    }));
  }

  deleteQuestion = () => {
    const newTest = this.props.test.filter(
      x => x.id !== this.props.question.id
    );

    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.token}`
      },
      method: "POST",
      body: JSON.stringify({
        id: this.props.jobId,
        test: newTest
      })
    };

    this.setState(
      {
        isLoading: true
      },
      () => {
        fetch("http://localhost:4567/api/job/edit-test", options)
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
              () => this.props.deleteQuestionInState(this.props.question.id)
            );
          })
          .catch(err => console.error(err));
      }
    );
  };

  renderBody = question =>
    <div>
      {
        question.body
          .split(/(<code>(.|\n|\t)+<\/code>)/)
          .map(s =>
            /^<code>(.|\n|\t)+<\/code>$/.test(s) ?
              <code key={shortid.generate()}>
                {s.slice(6, -7)}
              </code> : <p key={shortid.generate()}>{s}</p>
          )
      }
    </div>

  renderOptions = options =>
    options.map((x, i) => {
      let highlighter = {};
      if (x.correct) {
        highlighter = {
          color: "green"
        };
      }
      return (
        <div key={x.id}>
          <h6>Option {i + 1}:</h6>
          <strong style={highlighter}>
            {
              x.answer
                .split(/(<code>(.|\n|\t)+<\/code>)/)
                .map(s =>
                  /^<code>(.|\n|\t)+<\/code>$/.test(s) ?
                    <code key={shortid.generate()}>
                      {s.slice(6, -7)}
                    </code> : <p key={shortid.generate()}>{s}</p>
              )
            }
          </strong>
        </div>
      );
    })

  render() {
    const {
      isLoading,
      isError,
      editQuestionMounted
    } = this.state;

    const {
      question,
      test,
      jobId,
      editQuestionInState,
      token,
      index
    } = this.props;

    if (isError) {
      return <p>Error</p>;
    }

    let editQuestion = "";
    let actionBtns = "";
    if (editQuestionMounted) {
      editQuestion = (
        <EditQuestion
          question={question}
          toggleEditQuestion={this.toggleEditQuestion}
          test={test}
          jobId={jobId}
          editQuestionInState={editQuestionInState}
          token={token}
        />
      );
    } else {
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
          {isLoading ? (
            <Spinner />
          ) : (
            <div>
              <h3>Question {index + 1}</h3>
              <hr/>
              <pre style={{ fontFamily: 'sans-serif' }}>
                <div>{ this.renderBody(question) }</div>
                <div>
                  {
                    question.type === 'MULTIPLE_CHOICE' ?
                      this.renderOptions(question.options) : ""
                  }
                </div>
                {editQuestion}
              </pre>
              <div className="actionbtn">{actionBtns}</div>
            </div>
          )}
        </span>
      </div>
    );
  }
}

export default IndividualQuestion;
