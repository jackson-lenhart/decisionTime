import React, { Component } from "react";

import Spinner from "../../components/UI/Spinner/Spinner";

import "./Login.css";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      isError: false,
      email: "",
      password: "",
      denied: false
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token === null) {
      return;
    }

    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    this.setState(
      {
        isLoading: true
      },
      () => {
        fetch("http://localhost:4567/api/company/auth", options)
          .then(res => {
            if (res.status === 403) {
              return Promise.reject(new Error("Auth denied"));
            } else {
              return res.json();
            }
          })
          .then(_ => {
            this.props.history.push("/company");
          })
          .catch(err => {
            console.error(err);
            this.setState({ isLoading: false });
          });
      }
    );
  }

  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
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
        fetch(`http://localhost:4567/api/company/login`, options)
          .then(res => {
            if (res.status === 403) {
              this.setState({ denied: true });
              return Promise.reject(new Error("403 access denied"));
            } else {
              return res.json();
            }
          })
          .then(data => {
            localStorage.setItem("token", data.token);
            this.props.history.push("/company");
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
          <form>
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
                type="password"
                className="LoginInput"
                placeholder="password..."
                name="password"
                onChange={this.handleInput}
              />
            </div>
            <div>
              <div className="button">
                <a onClick={this.handleSubmit}>Login</a>
              </div>
              {deniedMsg}
              {errorMsg}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
