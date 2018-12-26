import React, { Component } from "react";

import QuestionList from "./QuestionList/QuestionList";
import CreateQuestion from "./CreateQuestion";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Modal from "../../../components/UI/Modal/Modal";

class TestEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      createQuestionMounted: false,
      createExamMounted: false,
      examName: "",
      viewingExamId: "0",
      exams: []
    };

    this.toggleCreateQuestion = this.toggleCreateQuestion.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.toggleCreateExam = this.toggleCreateExam.bind(this);
    this.createExam = this.createExam.bind(this);
    this.deleteExam = this.deleteExam.bind(this);
    this.createQuestion = this.createQuestion.bind(this);
    this.editQuestion = this.editQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
  }

  componentDidMount() {
    this.loadExams()
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

  componentDidUpdate(prevProps) {
    if (prevProps.job._id !== this.props.job._id) {
      this.toggleSpinner().then(_ => this.loadExams())
      .then(exams => {
        this.setState({
          exams,
          viewingExamId: exams.length > 0 ? exams[0]._id : '0'
        }, () => this.toggleSpinner())
      })
      .catch(err => {
        this.setState({ isError: true });
        console.error(err);
      })
    }
  }

  toggleSpinner() {
    return new Promise(resolve =>
      this.setState(prevState => ({
        isLoading: !prevState.isLoading
      }), () => resolve())
    );
  }

  loadExams() {
    const options = {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    };
    return fetch(`/api/screening/${this.props.job._id}`, options)
      .then(res => res.json())
  }

  createExam(e) {
    e.preventDefault();
    const exam = {
      name: this.state.examName,
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
        viewingExamId: data._id,
        createExamMounted: false
      }));
    })
    .catch(err => {
      this.setState({ isError: true });
      console.error(err);
    });
  }

  deleteExam() {
    const { viewingExamId } = this.state;
    const options = {
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ screeningId: viewingExamId })
    };
    fetch('/api/screening/remove', options)
    .then(res => {
      if (res.status === 200) {
        this.setState(prevState => {
          // filter out deleted exam in state
          const newExams = prevState.exams.filter(ex => ex._id !== prevState.viewingExamId);
          return {
            exams: newExams,
            viewingExamId: newExams.length > 0 ? newExams[0]._id : '0'
          };
        });
      } else {
        console.error('Invalid status code ' + res.status);
      }
    })
    .catch(err => {
      this.setState({ isError: true });
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
      this.toggleSpinner().then(_ =>
        fetch('/api/screening/edit', options)
      )
      .then(res => res.json())
      .then(screening => {
        this.setState(prevState => ({
          exams: prevState.exams.map(ex =>
            ex._id === screening._id ? screening : ex
          )
        }), () => {
          this.toggleSpinner();
          this.toggleCreateQuestion();
        });
      })
      .catch(err => {
        this.setState({ isError: true });
        console.error(err);
      });
    } else {
      this.setState({ isError: true });
    }
  }

  editQuestion(newQuestion) {
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
          questions: exam.questions.map(q => q._id === newQuestion._id ? newQuestion : q)
        })
      };
      this.toggleSpinner().then(_ =>
        fetch('/api/screening/edit', options)
      )
      .then(res => res.json())
      .then(screening => {
        this.setState(prevState => ({
          exams: prevState.exams.map(ex =>
            ex._id === screening._id ? screening : ex
          )
        }), () => {
          this.toggleSpinner();
          // toggle off edit question somehow
        });
      })
      .catch(err => {
        this.setState({ isError: true });
        console.error(err);
      });
    } else {
      this.setState({ isError: true });
    }
  }

  deleteQuestion(id) {
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
          questions: exam.questions.filter(q => q._id !== id)
        })
      };
      this.toggleSpinner().then(_ =>
        fetch('/api/screening/edit', options)
      )
      .then(res => res.json())
      .then(screening => {
        this.setState(prevState => ({
          exams: prevState.exams.map(ex =>
            ex._id === screening._id ? screening : ex
          )
        }), () => {
          this.toggleSpinner();
          // toggle off edit question somehow
        });
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

  toggleCreateExam() {
    this.setState(prevState => ({
      createExamMounted: !prevState.createExamMounted
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
    // destructure everything else later
    const { viewingExamId, createExamMounted } = this.state;

    if (this.state.isError) {
      return <p>There was an error.</p>;
    }

    if (this.state.isLoading) {
      return <Spinner />;
    }

    let questionList = "";
    if (this.state.exams.length > 0) {
      questionList = (
        <QuestionList
          test={this.state.exams.find(x => x._id === this.state.viewingExamId)}
          jobId={this.props.job._id}
          editQuestion={this.editQuestion}
          deleteQuestion={this.deleteQuestion}
          token={this.props.token}
        />
      );
    } else {
      questionList = (
        <h3 style={{ paddingTop: "10px" }}>
          There are no exams for this job position yet. Create some
          exams!
        </h3>
      );
    }

    // TODO: Clean this up
    let createQuestionBtn = "";
    let createQuestion = "";
    if (viewingExamId !== "0") {
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
    }

    return (
      <div>
        <select value={this.state.viewingExamId} onChange={this.handleSelectChange}>
          <option value="0" disabled>Select exam</option>
          {
            this.state.exams.map((ex, i) =>
              <option key={ex._id} value={ex._id}>{ex.name || i}</option>
            )
          }
        </select>
        <span style={{ padding: '1%' }}>
          <button
            style={{ color: "purple" }}
            className="btn btn-light"
            type="button"
            onClick={this.toggleCreateExam}
          >
            Create Exam
          </button>
        </span>
        <Modal show={createExamMounted} modalClosed={this.toggleCreateExam}>
          <form onSubmit={this.createExam}>
            <label htmlFor="examName" style={{ paddingRight: '1%' }}>Give your new exam a name:</label>
            <input type="text" name="examName" onChange={this.handleChange} />
            <button style={{ color: 'purple' }} className="btn btn-light">Create</button>
            <button
              style={{ color: 'purple' }}
              className="btn btn-light"
              type="button"
              onClick={this.toggleCreateExam}
            >Cancel</button>
          </form>
        </Modal>
        { /* TODO: make it harder to delete exam. Probably use modal again */ }
        {
          viewingExamId && viewingExamId !== '0'
          ? <button type="button" onClick={this.deleteExam}>Delete Exam</button>
          : ''
        }
        {createQuestionBtn}
        {createQuestion}
        {questionList}
      </div>
    );
  }
}

export default TestEditor;
