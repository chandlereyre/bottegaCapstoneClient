import "./styles/main.scss";
import "react-tooltip/dist/react-tooltip.css";
import { React, Component } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "./pages/main";
import Login from "./pages/login";
import Signup from "./pages/signup";

class App extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      loggedInStatus: null,
      username: null,
    };

    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleUnsuccessfulLogin = this.handleUnsuccessfulLogin.bind(this);
    this.handleSuccessfulLogout = this.handleSuccessfulLogout.bind(this);
  }

  handleSuccessfulLogin(username) {
    this.setState({
      loggedInStatus: true,
      username: username,
    });
  }

  handleUnsuccessfulLogin() {
    this.setState({
      loggedInStatus: false,
    });
  }

  handleSuccessfulLogout() {
    axios({
      url: "http://3.15.224.228/auth/logout",
      method: "delete",
      withCredentials: true,
    }).then((response) => {
      this.setState({
        loggedInStatus: false,
      });
    });
  }

  checkLoginStatus() {
    axios.defaults.withCredentials = true;
    axios({
      url: "http://3.15.224.228/auth/login",
      method: "get",
      withCredentials: true,
    }).then((response) => {
      this.setState({
        loggedInStatus: response.data.loggedIn,
        isLoading: false,
        username: response.data.username,
      });
    });
  }

  componentDidMount() {
    this.setState({ isloading: true });
    this.checkLoginStatus();
  }

  render() {
    if (this.state.isLoading) {
      return <div className="loader"></div>;
    }

    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                this.state.loggedInStatus ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/home"
              element={
                this.state.loggedInStatus ? (
                  <Main
                    handleSuccessfulLogout={this.handleSuccessfulLogout}
                    type={"home"}
                    username={this.state.username}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                this.state.loggedInStatus ? (
                  <Main
                    handleSuccessfulLogout={this.handleSuccessfulLogout}
                    type={"profile"}
                    username={this.state.username}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                this.state.loggedInStatus ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Login
                    handleSuccessfulLogin={this.handleSuccessfulLogin}
                    handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
                  />
                )
              }
            />
            <Route
              path="/login/accountcreated"
              element={
                this.state.loggedInStatus ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Login
                    handleSuccessfulLogin={this.handleSuccessfulLogin}
                    handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
                    message={"Account created"}
                  />
                )
              }
            />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
