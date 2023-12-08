import { React, Component } from "react";
import { NavLink } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      message: this.props.message,
    };

    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.handleLogIn();
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

  handleLogIn(event) {
    axios({
      method: "post",
      url: "http://3.15.224.228/auth/login",
      data: {
        username: this.state.username,
        password: this.state.password,
      },
      withCredentials: true,
    })
      .then((response) => {
        console.log(response.data);
        if (response.data === "session created") {
          this.props.handleSuccessfulLogin(this.state.username);
        } else {
          this.props.handleUnsuccessfulLogin();
          this.setState({ message: response.data });
        }
      })
      .catch((err) => {
        console.log("Error logging in: ", err);
      });
  }

  render() {
    return (
      <div className="login-wrapper">
        <div className="login-modal">
          <h1>Log in</h1>
          <input
            type="text"
            placeholder="username"
            className="input"
            name="username"
            onChange={this.handleChange}
            value={this.state.username}
            data-tooltip-id="login-tooltip"
            data-tooltip-content="Your username"
            data-tooltip-place="right"
          ></input>
          <input
            type="password"
            placeholder="password"
            className="input"
            name="password"
            onChange={this.handleChange}
            value={this.state.password}
            onKeyDown={this.handleKeyPress}
            data-tooltip-id="login-tooltip"
            data-tooltip-content="Your password"
            data-tooltip-place="right"
          ></input>
          <button
            type="submit"
            className="login-button"
            onClick={this.handleLogIn}
          >
            Log in
          </button>
          <div className="divider">
            <span className="line"></span>
            <p>OR</p>
            <span className="line"></span>
          </div>
          <NavLink to="/signup" className="link">
            Don't have an account?
          </NavLink>
        </div>
        <div className="modal-bg login-bg"></div>
        {this.state.message == "Account created" ? (
          <div className="success-message">
            <p>{this.state.message}!</p>
          </div>
        ) : null}
        {this.state.message && this.state.message != "Account created" ? (
          <div className="error-message">
            <p>{this.state.message}</p>
          </div>
        ) : null}
        <Tooltip id="login-tooltip" style={{ zIndex: 8 }} />
      </div>
    );
  }
}

export default Login;
