import React, { Component } from "react";
import shortid from "shortid";
import _ from "lodash";

import Spinner from "../../../components/UI/Spinner/Spinner";
import ActionButtons from "../../../components/UI/Buttons/ActionButtons";

class EditQuestion extends Component {
  constructor(props) {
    super(props);

    this.initialOption = {
      [shortid.generate()]: "",
      [shortid.generate()]: ""
    };

    this.state = {
      isLoading: false,
      isError: false,
      questionType: props.question.questionType,
      options:
        props.question.questionType === "MULTIPLE_CHOICE"
          ? props.question.options.reduce(
              (acc, x) => ({
                ...acc,
                [x._id]: x.body
              }),
              {}
            )
          : this.initialOption,

      correctAnswerId:
        props.question.type === "MULTIPLE_CHOICE"
          ? props.question.options.find(x => x.correct)
            ? props.question.options.find(x => x.correct)._id
            : null
          : null,

      body: props.question.body
    };

    this.onSaveClick = this.onSaveClick.bind(this);
    this.setCorrectAnswer = this.setCorrectAnswer.bind(this);
    this.removeOption = this.removeOption.bind(this);
    this.addOption = this.addOption.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  onSaveClick = event => {
    event.preventDefault();

    let newQuestion = {
      _id: this.props.question._id,
      body: this.state.body,
      questionType: this.state.questionType
    };

    if (this.state.questionType === "MULTIPLE_CHOICE") {
      newQuestion.options = [];
      for (let k in this.state.options) {
        if (this.state.options[k].length > 0) {
          newQuestion.options.push({
            body: this.state.options[k],
            correct: k === this.state.correctAnswerId ? true : false
          });
        }
      }
    }
    this.props.editQuestion(newQuestion);
  };

  setCorrectAnswer(e) {
    this.setState({
      correctAnswerId: e.target.value
    });
  }

  addOption() {
    this.setState({
      options: {
        ...this.state.options,
        [shortid.generate()]: ""
      }
    });
  }

  removeOption(id) {
    if (Object.keys(this.state.options).length > 2) {
      this.setState({
        options: _.omit(this.state.options, id)
      });
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleOptionChange(e) {
    this.setState({
      options: {
        ...this.state.options,
        [e.target.name]: e.target.value
      }
    });
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return <p>Error editing question</p>;
    }

    let options = "";
    let addOptionBtn = "";
    if (this.state.questionType === "MULTIPLE_CHOICE") {
      options = [];
      for (let k in this.state.options) {
        options.push(
          <div key={k}>
            <input
              type="radio"
              name="options"
              value={k}
              onClick={this.setCorrectAnswer}
              defaultChecked={k === this.state.correctAnswerId ? true : false}
            />
            <input
              type="text"
              style={{ padding: "5px 10px" }}
              name={k}
              onChange={this.handleOptionChange}
              defaultValue={this.state.options[k]}
            />
            <input
              type="button"
              onClick={() => this.removeOption(k)}
              value="Delete"
            />
            <br />
            <br />
          </div>
        );
      }

      addOptionBtn = (
        <div style={{ padding: "5px 0px 20px 0px" }}>
          <button type="button" onClick={this.addOption}>
            Add Option
          </button>
        </div>
      );
    }

    return (
      <div style={{ padding: "10px 0px" }}>
        <select
          name="questionType"
          value={this.state.questionType}
          onChange={this.handleChange}
        >
          <option value="OPEN_RESPONSE">Open Response</option>
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
        </select>
        <br />
        <br />
        <textarea
          rows="5"
          cols="50"
          name="body"
          defaultValue={this.props.question.body}
          onChange={this.handleChange}
          placeholder="Question body"
        />
        {options}
        {addOptionBtn}
        <div style={{ padding: "20px" }}>
          <ActionButtons
            isEditing={true}
            onCancel={this.props.toggleEditQuestion}
            onSaveClick={this.onSaveClick}
          />
        </div>
      </div>
    );
  }
}

export default EditQuestion;
