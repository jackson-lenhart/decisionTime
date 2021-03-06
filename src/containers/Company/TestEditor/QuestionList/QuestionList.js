import React, { Component } from "react";
import _ from "lodash";
import IndividualQuestion from "./IndividualQuestion/IndividualQuestion";

class QuestionList extends Component {
  renderQuestions = () => {
    let test = this.props.test;
    const props = _.omit(this.props, "test");
    return test && test.questions.map((question, i) => (
      <IndividualQuestion
        question={question}
        key={question._id}
        index={i}
        examId={this.props.test._id}
        token={props.token}
        jobId={props.jobId}
        editQuestion={props.editQuestion}
        deleteQuestion={this.props.deleteQuestion}
        test={test}
      />
    ));
  };

  render() {
    return <div>{this.renderQuestions()}</div>;
  }
}

export default QuestionList;
