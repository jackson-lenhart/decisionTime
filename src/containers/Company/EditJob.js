import React, { Component } from "react";

import Spinner from "../../components/UI/Spinner/Spinner";
import TextAreaFieldGroup from "../../components/UI/Form/TextAreaFieldGroup";
import TextFieldGroup from "../../components/UI/Form/TextFieldGroup";

class EditJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const { title, description } = this.props.job;
    if (!title || !description) {
      this.setState({ isError: true });
    } else {
      this.setState({ title, description });
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const job = {
      ...this.state,
      _id: this.props.id
    };

    const options = {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(job)
    };

    this.setState(
      {
        isLoading: true
      },
      () => {
        fetch("/api/job/edit", options)
          .then(res => {
            if (res.status === 200) {
              this.setState(
                {
                  isLoading: false
                },
                () => {
                  this.props.editJobInState(job);
                  this.props.toggleEditJob();
                }
              );
            } else {
              this.setState({
                isLoading: false,
                isError: true
              });
            }
          })
          .catch(err => {
            console.error(err);
            this.setState({
              isLoading: false,
              isError: true
            });
          });
      }
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }

    if (this.state.isError) {
      return (
        <div>
          <p>Error editing Job</p>
        </div>
      );
    }

    return (
      <div>
        <div>
          <label htmlFor="title">Edit Job Information:</label>
          <TextFieldGroup
            type="text"
            name="title"
            defaultValue={this.props.job.title}
            onChange={this.handleChange}
            info="Edit the current job title"
          />
        </div>
        <div>
          <TextAreaFieldGroup
            name="description"
            onChange={this.handleChange}
            defaultValue={this.props.job.description}
            info="Edit the current job description"
          />
        </div>
        <button
          style={{ color: "purple" }}
          className="btn btn-light"
          onClick={this.handleSubmit}
        >
          <i className="fas fa-check text-success mr-1" />
          Save
        </button>
        <button
          style={{ color: "purple" }}
          className="btn btn-light"
          type="button"
          onClick={this.props.toggleEditJob}
        >
          <i className="fas fa-ban text-success mr-1" />
          Cancel
        </button>
      </div>
    );
  }
}

export default EditJob;
