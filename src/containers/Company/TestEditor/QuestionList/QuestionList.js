import React, { Component } from "react";
import _ from "lodash";
import IndividualQuestion from "./IndividualQuestion/IndividualQuestion";

class QuestionList extends Component {
  renderQuestions = () => {
    let test = this.props.test;
    console.log('Test?', test);
    const props = _.omit(this.props, "test");
    return test.map((question, i) => (
      <IndividualQuestion
        question={question}
        key={question.id}
        index={i}
        token={props.token}
        jobId={props.jobId}
        deleteQuestionInState={props.deleteQuestionInState}
        createQuestionInState={props.createQuestionInState}
        editQuestionInState={props.editQuestionInState}
        test={test}
      />
    ));
  };

  render() {
    return <div>{this.renderQuestions()}</div>;
  }
}

export default QuestionList;
