import React, { Component } from "react";
import _ from "lodash";
import { CopyToClipboard } from "react-copy-to-clipboard";

import CreateJob from "./CreateJob";
import EditJob from "./EditJob";
import DeleteJob from "./DeleteJob";
import TestEditor from "./TestEditor/TestEditor";
import Spinner from "../../components/UI/Spinner/Spinner";
import Modal from "../../components/UI/Modal/Modal";
import "./Jobs.css";

class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      companyId: "",
      companyName: "",
      jobs: [],
      viewingJobId: null,
      createJobMounted: false,
      editJobMounted: false,
      createJobModal: false,
      editJobModal: false,
      deleteJobModal: false,
      viewDescription: false
    };

    this.viewDescriptionHandler = this.viewDescriptionHandler.bind(this);
    this.token = localStorage.getItem("token");
  }

  componentDidMount() {
    const options = {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };

    fetch("/api/job/", options)
      .then(res => res.json())
      .then(data => {
        this.setState({
          isLoading: false,
          jobs: data.jobs,
          viewingJobId: data.jobs.length > 0 ? data.jobs[0]._id : null,

          // companyId: data.companyId,
          // companyName: data.companyName
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          isLoading: false,
          isError: true
        });
      });
  }

  setViewingJobId = id =>
    this.setState({
      viewingJobId: id,
      viewDescription: false
    });

  createJobInState = job =>
    this.setState(prevState => ({
      jobs: prevState.jobs.concat(job),
      viewingJobId: job.id
    }));

  editJobInState = job =>
    this.setState(prevState => ({
      jobs: prevState.jobs.map(
        x =>
          x.id === job.id
            ? {
                ...x,
                title: job.title,
                description: job.description
              }
            : x
      )
    }));

  viewDescriptionHandler = () => {
    this.setState({ viewDescription: !this.state.viewDescription });
  };

  deleteJobInState = id =>
    this.setState(prevState => {
      let newJobs = prevState.jobs.filter(x => x.id !== id);
      return {
        jobs: newJobs,
        viewingJobId: newJobs.length > 0 ? _.sample(newJobs).id : null
      };
    });

  createQuestionInState = q =>
    this.setState(prevState => ({
      jobs: prevState.jobs.map(
        x =>
          x.id === this.state.viewingJobId
            ? {
                ...x,
                test: x.test.concat(q)
              }
            : x
      )
    }));

  editQuestionInState = q =>
    this.setState(prevState => ({
      jobs: prevState.jobs.map(
        x =>
          x.id === this.state.viewingJobId
            ? {
                ...x,
                test: x.test.map(y => (y.id === q.id ? q : y))
              }
            : x
      )
    }));

  deleteQuestionInState = id =>
    this.setState(prevState => ({
      jobs: prevState.jobs.map(
        x =>
          x.id === this.state.viewingJobId
            ? {
                ...x,
                test: x.test.filter(y => y.id !== id)
              }
            : x
      )
    }));

  toggleCreateJob = () =>
    this.setState(prevState => ({
      createJobMounted: !prevState.createJobMounted,
      createJobModal: !prevState.createJobModal
    }));

  toggleEditJob = () =>
    this.setState(prevState => ({
      editJobMounted: !prevState.editJobMounted,
      editJobModal: !prevState.editJobModal
    }));

  toggleDeleteJob = () =>
    this.setState(prevState => ({
      deleteJobMounted: !prevState.deleteJobMounted,
      deleteJobModal: !this.state.deleteJobModal
    }));

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  render() {
    if (this.state.isLoading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }

    if (this.state.isError) {
      return <p>Error loading Jobs</p>;
    }

    let { jobs, viewingJobId } = this.state;

    let jobList = "";
    if (jobs.length > 0) {
      jobList = jobs.map(x => {
        const style =
          x._id === this.state.viewingJobId
            ? {
                cursor: "pointer",
                color: "green",
                backgroundColor: "#def9c0",
                paddingLeft: "5px"
              }
            : {
                cursor: "pointer"
              };

        return (
          <div
            key={x._id}
            className="jobs"
            style={style}
            onClick={() => this.setViewingJobId(x.id)}
          >
            {x.title.length < 17 ? x.title : x.title.substring(0, 16) + "..."}
            <button
              style={{
                float: "right",
                color: "purple",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "10px"
              }}
              type="button"
              onClick={this.toggleEditJob}
            >
              <i className="far fa-edit text-success mr-1" />
              Edit
            </button>
          </div>
        );
      });
    } else {
      jobList = <p>No jobs yet</p>;
    }

    let createJobBtn = "";
    let createJob = "";
    if (this.state.createJobMounted) {
      createJob = (
        <CreateJob
          toggleCreateJob={this.toggleCreateJob}
          createJobInState={this.createJobInState}
          id={this.state.viewingJobId}
          token={this.token}
        />
      );
    } else {
      createJobBtn = (
        <div>
          <center>
            <button
              style={{ color: "purple", borderRadius: "5px" }}
              type="button"
              onClick={this.toggleCreateJob}
            >
              <i className="fas fa-plus text-success mr-1" />
              Add New Job
            </button>
          </center>
        </div>
      );
    }

    let editJob = "";
    if (this.state.editJobMounted) {
      editJob = (
        <EditJob
          toggleEditJob={this.toggleEditJob}
          editJobInState={this.editJobInState}
          job={this.state.jobs.find(x => x._id === this.state.viewingJobId)}
          id={this.state.viewingJobId}
          token={this.token}
        />
      );
    }

    let testEditor = "";
    if (this.state.jobs.length > 0) {
      testEditor = (
        <TestEditor
          token={this.token}
          job={this.state.jobs.find(x => x._id === this.state.viewingJobId)}
          createQuestionInState={this.createQuestionInState}
          editQuestionInState={this.editQuestionInState}
          deleteQuestionInState={this.deleteQuestionInState}
        />
      );
    }

    let deleteJob = "";
    let deleteJobBtn = "";
    if (this.state.deleteJobMounted) {
      deleteJob = (
        <DeleteJob
          id={this.state.viewingJobId}
          title={
            this.state.jobs.find(x => x._id === this.state.viewingJobId).title
          }
          token={this.token}
          toggleDeleteJob={this.toggleDeleteJob}
          deleteJobInState={this.deleteJobInState}
        />
      );
    } else if (this.state.jobs.length > 0) {
      deleteJobBtn = (
        <button
          style={{ color: "purple" }}
          className="btn btn-light"
          type="button"
          onClick={this.toggleDeleteJob}
        >
          <i className="fas fa-trash-alt text-success mr-1" />
          Delete Job
        </button>
      );
    }

    let description = "";
    let copyLinkBtn = "";
    if (
      this.state.viewingJobId &&
      !this.state.editJobMounted &&
      !this.state.createJobMounted &&
      !this.state.testEditorMounted
    ) {
      description = this.state.jobs.find(x => x._id === this.state.viewingJobId)
        .description;

      let host = window.location.hostname;
      if (host.includes("localhost")) {
        host = "http://localhost:3000";
      }

      let url =
        host +
        `/job-description/${this.state.companyId}/${this.state.viewingJobId}`;

      copyLinkBtn = (
        <CopyToClipboard text={url}>
          <button
            style={{ color: "purple" }}
            className="btn btn-light"
            type="button"
          >
            <i className="fas fa-link text-success mr-1" />
            Copy Pre-Screening Link
          </button>
        </CopyToClipboard>
      );
    }

    let visits = "";
    if (this.state.viewingJobId) {
      let numVisitors = jobs.find(x => x._id === viewingJobId).visitors;

      visits = <p>This job has had {numVisitors} visitors so far</p>;
    }

    let editJobModal = null;

    if (this.state.editJobModal) {
      editJobModal = (
        <Modal show={this.state.editJobModal} modalClosed={this.toggleEditJob}>
          {editJob}
        </Modal>
      );
    }

    let createJobModal = null;
    if (this.state.createJobModal) {
      createJobModal = (
        <Modal
          show={this.state.createJobModal}
          modalClosed={this.toggleCreateJob}
        >
          {createJob}
        </Modal>
      );
    }

    let deleteJobModal = null;
    if (this.state.deleteJobModal) {
      deleteJobModal = (
        <Modal
          show={this.state.deleteJobModal}
          modalClosed={this.toggleDeleteJob}
        >
          {deleteJob}
        </Modal>
      );
    }

    return (
      <div className="jobeditor">
        {editJobModal}
        {createJobModal}
        {deleteJobModal}
        <div className="row">
          <div className="column1">
            <h3>List of Jobs</h3>
            {createJobBtn}
            <div className="jobnavbar">{jobList}</div>
          </div>
          <div className="column2">
            <div className="joblink">
              {visits}
              {copyLinkBtn}
              {deleteJobBtn}
            </div>
            <center style={{ paddingTop: "100px" }}>
              <div className="card card-body bg-light mb-3">
                <div className="jobdescription">
                  <h5>Job Description</h5>
                  {this.state.viewDescription ? (
                    <a
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                      onClick={this.viewDescriptionHandler}
                    >
                      Hide Job Description
                    </a>
                  ) : (
                    <a
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                      onClick={this.viewDescriptionHandler}
                    >
                      View Job Description
                    </a>
                  )}
                  {this.state.viewDescription ? (
                    <pre>
                      <p style={{
                        textAlign: "left",
                        width: "100%",
                        whiteSpace: "pre-wrap"
                      }}>
                        <em>{description}</em>
                      </p>
                    </pre>
                  ) : null}
                </div>
              </div>
            </center>
            {testEditor}
          </div>
        </div>
      </div>
    );
  }
}

export default Jobs;
