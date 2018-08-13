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

  onSaveClick = event => {
    event.preventDefault();

    let newQuestion = {
      id: shortid.generate(),
      body: this.state.body,
      type: this.state.questionType
    };

    if (this.state.questionType === "MULTIPLE_CHOICE") {
      newQuestion.options = [];
      for (let k in this.state.options) {
        if (this.state.options[k].length > 0) {
          newQuestion.options.push({
            id: k,
            answer: this.state.options[k],
            correct: k === this.state.correctAnswerId ? true : false
          });
        }
      }
    }

    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.token}`
      },
      method: "POST",
      body: JSON.stringify({
        id: this.props.jobId,
        test: this.props.test.concat(newQuestion)
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
            console.log(data);
            this.props.createQuestionInState(newQuestion);
            this.props.toggleCreateQuestion();
          })
          .catch(err => console.error(err));
      }
    );
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
            <textarea
              style={{
                padding: "5px 10px",
                whiteSpace: 'pre-wrap'
              }}
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
          style={{
            whiteSpace: 'pre-wrap'
          }}
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
