import React, { Component } from "react";
import shortid from "shortid";
import _ from "lodash";

import ActionButtons from "../../../components/UI/Buttons/ActionButtons";
import TextAreaFieldGroup from "../../../components/UI/Form/TextAreaFieldGroup";

class CreateQuestion extends Component {
  constructor(props) {
    super(props);

    this.initialOptions = {
      [shortid.generate()]: "",
      [shortid.generate()]: ""
    };

    this.state = {
      isLoading: false,
      questionType: "OPEN_RESPONSE",
      options: this.initialOptions,
      correctAnswerId: null,
      body: ""
    };

    this.onSaveClick = this.onSaveClick.bind(this);
    this.setCorrectAnswer = this.setCorrectAnswer.bind(this);
    this.removeOption = this.removeOption.bind(this);
    this.addOption = this.addOption.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  onSaveClick(event) {
    event.preventDefault();
    const { body, questionType, options, correctAnswerId } = this.state;
    const newQuestion = { body, questionType };
    if (questionType === "MULTIPLE_CHOICE") {
      newQuestion.options = [];
      for (let k in options) {
        if (options[k].length > 0) {
          newQuestion.options.push({
            body: options[k],
            correct: k === correctAnswerId ? true : false
          });
        }
      }
    }
    this.props.createQuestion(newQuestion);
  }

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
    let options = "";
    let addOptionBtn = "";
    if (this.state.questionType === "MULTIPLE_CHOICE") {
      options = [];
      for (let k in this.state.options) {
        options.push(
          <div key={k}>
            <label>Click here if correct &#x21E8;</label>{" "}
            <input
              type="radio"
              name="options"
              value={k}
              onClick={this.setCorrectAnswer}
              defaultChecked={k === this.state.correctAnswerId ? true : false}
            />{" "}
            <input
              type="text"
              style={{ padding: "5px 10px" }}
              name={k}
              placeholder="Place option here"
              onChange={this.handleOptionChange}
              defaultValue={this.state.options[k]}
            />
            {"  "}
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
        <TextAreaFieldGroup
          name="body"
          onChange={this.handleChange}
          placeholder="Question body"
        />
        {options}
        {addOptionBtn}
        <div style={{ padding: "20px" }}>
          <ActionButtons
            isEditing={true}
            onCancel={this.props.toggleCreateQuestion}
            onSaveClick={this.onSaveClick}
          />
        </div>
      </div>
    );
  }
}

export default CreateQuestion;
