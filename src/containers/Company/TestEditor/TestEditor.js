import React, { Component } from "react";

import QuestionList from "./QuestionList/QuestionList";
import CreateQuestion from "./CreateQuestion";
import Spinner from "../../../components/UI/Spinner/Spinner";

class TestEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      createQuestionMounted: false,
      name: "",
      viewingExamId: "0",
      exams: []
    };

    this.toggleCreateQuestion = this.toggleCreateQuestion.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.createExam = this.createExam.bind(this);
    this.createQuestion = this.createQuestion.bind(this);
  }

  componentDidMount() {
    const options = {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    };
    fetch(`/api/screening/${this.props.job._id}`, options)
    .then(res => res.json())
    .then(exams => {
      this.setState({
        exams,
        isLoading: false
      });
    })
    .catch(err => {
      this.setState({
        isError: true,
        isLoading: false
      });
      console.error(err);
    });
  }

  createExam() {
    const exam = {
      name: this.state.name,
      jobId: this.props.job._id,
      questions: []
    };
    const options = {
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(exam)
    };
    fetch('/api/screening/', options)
    .then(res => res.json())
    .then(data => {
      this.setState(prevState => ({
        exams: prevState.exams.concat({
          ...exam,
          _id: data._id
        }),
        viewingExamId: data._id
      }));
    })
    .catch(err => {
      this.setState({
        isError: true
      });
      console.error(err);
    });
  }

  createQuestion(question) {
    const { exams, viewingExamId } = this.state;
    const exam = exams.find(ex => ex._id === viewingExamId);
    if (exam && exam.questions) {
      const options = {
        headers: {
          'Authorization': `Bearer ${this.props.token}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          screeningId: exam._id,
          questions: exam.questions.concat(question)
        })
      };
      fetch('/api/screening/edit', options)
      .then(res => res.json())
      .then(screening => {
        this.setState(prevState => ({
          exams: prevState.exams.map(ex =>
            ex._id === screening._id ? screening : ex
          )
        }));
      })
      .catch(err => {
        this.setState({ isError: true });
        console.error(err);
      });
    } else {
      this.setState({ isError: true });
    }
  }

  toggleCreateQuestion() {
    this.setState(prevState => ({
      createQuestionMounted: !prevState.createQuestionMounted
    }));
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSelectChange(e) {
    this.setState({
      viewingExamId: e.target.value
    });
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }

    if (this.state.isError) {
      return <p>There was an error.</p>;
    }

    let questionList = "";
    if (this.state.exams.length > 0) {
      questionList = (
        <QuestionList
          test={this.state.exams.find(x => x._id === this.state.viewingExamId)}
          jobId={this.props.job._id}
          deleteQuestionInState={this.props.deleteQuestionInState}
          createQuestionInState={this.props.createQuestionInState}
          editQuestionInState={this.props.editQuestionInState}
          token={this.props.token}
        />
      );
    } else {
      questionList = (
        <h3 style={{ paddingTop: "10px" }}>
          There are no questions for this job position yet. Create some
          questions!
        </h3>
      );
    }

    let createQuestionBtn = "";
    let createQuestion = "";
    if (!this.state.createQuestionMounted) {
      createQuestionBtn = (
        <button
          style={{ color: "purple" }}
          className="btn btn-light"
          type="button"
          onClick={this.toggleCreateQuestion}
        >
          <i className="fas fa-plus text-success mr-1" />
          Add New Question
        </button>
      );
    } else {
      createQuestion = (
        <CreateQuestion
          test={this.props.job.test}
          jobId={this.props.job._id}
          createQuestion={this.createQuestion}
          toggleCreateQuestion={this.toggleCreateQuestion}
          token={this.props.token}
        />
      );
    }

    return (
      <div>
        <select value={this.state.viewingExamId} onChange={this.handleSelectChange}>
          <option value="0" disabled>Select exam</option>
          {
            this.state.exams.map((ex, i) =>
              <option key={ex._id} value={ex._id}>{i}</option>
            )
          }
        </select>
        <button type="button" onClick={this.createExam}>Create Exam</button>
        {createQuestionBtn}
        {createQuestion}
        {questionList}
      </div>
    );
  }
}

export default TestEditor;
