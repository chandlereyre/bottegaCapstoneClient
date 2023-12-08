import { React, Component } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import axios from "axios";

export default class Signup extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      redirect: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.handleSubmit();
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
        .replace(/\s/g, "")
        .replace(/\./g, ""),
      errorText: "",
    });
  }

  handleSubmit() {
    if (this.state.password != this.state.confirmPassword) {
      this.setState({ errorMessage: "Passwords must match" });
    } else if (this.state.password.length < 8) {
      this.setState({ errorMessage: "Password must be at least 8 characters" });
    } else if (this.state.username.length < 6) {
      this.setState({ errorMessage: "Username must be at least 6 characters" });
    } else {
      axios({
        method: "post",
        url: "http://3.15.224.228/create-account",
        data: {
          username: this.state.username,
          password: this.state.password,
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.data == "user already exists") {
            this.setState({ errorMessage: response.data });
          } else if (response.data == "account created") {
            this.setState({
              redirect: true,
            });
          }
        })
        .catch((err) => {
          console.log("Error signing up: ", err);
        });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to="/login/accountcreated" />;
    }
    return (
      <div className="login-wrapper">
        <div className="login-modal signup-modal">
          <h1>Create account</h1>
          <input
            type="text"
            placeholder="username"
            className="input"
            name="username"
            onChange={this.handleChange}
            value={this.state.username}
            data-tooltip-id="signup-tooltip"
            data-tooltip-content="At least 6 characters, no dots or spaces"
            data-tooltip-place="right"
          ></input>
          <input
            type="password"
            placeholder="password"
            className="input"
            name="password"
            onChange={this.handleChange}
            value={this.state.password}
            data-tooltip-id="signup-tooltip"
            data-tooltip-content="At least 8 characters, no spaces"
            data-tooltip-place="right"
          ></input>
          <input
            type="password"
            placeholder="confirm password"
            className="input"
            name="confirmPassword"
            onChange={this.handleChange}
            value={this.state.confirmPassword}
            onKeyDown={this.handleKeyPress}
            data-tooltip-id="signup-tooltip"
            data-tooltip-content="Make sure the passwords match!"
            data-tooltip-place="right"
          ></input>
          <button
            type="submit"
            className="login-button"
            onClick={this.handleSubmit}
          >
            Create account
          </button>

          <div className="divider">
            <span className="line"></span>
            <p>OR</p>
            <span className="line"></span>
          </div>
          <NavLink to="/login" className="link">
            Already have an account?
          </NavLink>
        </div>
        <div className="modal-bg signup-bg"></div>
        {this.state.errorMessage ? (
          <div className="error-message">
            <p>{this.state.errorMessage}</p>
          </div>
        ) : null}
        <Tooltip id="signup-tooltip" style={{ zIndex: 8 }} />
      </div>
    );
  }
}
