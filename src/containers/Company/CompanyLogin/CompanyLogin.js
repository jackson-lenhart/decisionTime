import React, { Component } from "react";

import Spinner from "../../../components/UI/Spinner/Spinner";

import "./CompanyLogin.css";

class CompanyLogin extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      isError: false,
      email: "",
      password: "",
      denied: false
    };
  }

  handleInput = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  handleSubmit = e => {
    e.preventDefault();
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    };

    this.setState(
      {
        isLoading: true
      },
      () => {
        fetch("/api/company/user/login", options)
          .then(res => {
            if (res.status === 401) {
              this.setState({
                isLoading: false,
                denied: true
              });
              return Promise.reject(new Error('401 unauthorized'));
            } else {
              return res.json();
            }
          })
          .then(data => {
            localStorage.setItem("token", data.token);
            this.props.login();
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
  };

  render() {
    let errorStyle = null;
    if (this.state.isError || this.state.denied) {
      errorStyle = {
        marginLeft: "10px",
        backgroundColor: "#d6d6d6",
        padding: "20px 190px 20px 20px",
        borderRadius: "5px"
      };
    }

    if (this.state.isLoading) {
      return <Spinner />;
    }

    let deniedMsg = "";
    if (this.state.denied) {
      deniedMsg = <p style={{ color: "red" }}>Invalid login credentials</p>;
    }

    let errorMsg = "";
    if (this.state.isError) {
      errorMsg = <p style={{ color: "red" }}>Login failed</p>;
    }

    return (
      <div className="background">
        <div className="login">
          <form onSubmit={this.handleSubmit}>
            <h2 className="company">
              <strong>Company Login</strong>
            </h2>
            <div style={{ padding: "10px" }}>
              <input
                type="text"
                className="LoginInput"
                placeholder="email..."
                name="email"
                onChange={this.handleInput}
              />
            </div>
            <div style={{ padding: "10px" }}>
              <input
                autoFocus="true"
                type="password"
                className="LoginInput"
                placeholder="password..."
                name="password"
                onChange={this.handleInput}
              />
            </div>
            <div>
              <input type="submit" value="Login" className="button" />
              <div style={errorStyle}>
                {deniedMsg}
                {errorMsg}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CompanyLogin;
