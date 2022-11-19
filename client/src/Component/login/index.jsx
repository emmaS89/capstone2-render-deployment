import React, { Component } from "react";
import { Link } from "react-router-dom";
import urls from "../../helpers/urls";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import auth_axios from "../../utils/auth_axios";
import config from "../../helpers/config";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showSpinner: false,
    };
  }
  async handleSubmit(e) {
    e.preventDefault();
    // log in
    this.setState({ showSpinner: true });

    await axios
      .post(
        `${config.env == "prod" ? config.baseUrl : ""}/api/users/authenticate`,
        {
          email: this.state.email,
          pswd: this.state.password,
        }
      )
      .then((res) => {
        const {
          statusCode,
          data: { token, firstname, lastname, userId },
        } = res.data;

        if (statusCode !== 1) {
          toastr.error("Invalid Email or password");
          this.setState({ showSpinner: false });
        } else {
          toastr.success("Login Success Redirecting to MainMenu.........");
          sessionStorage.setItem("JWTtoken", token);
          sessionStorage.setItem("userName", firstname + " " + lastname);
          sessionStorage.setItem("userId", userId);

          auth_axios.defaults.headers.common["Authorization"] =
            "Bearer " + token;
          setTimeout(() => {
            this.props.history.push(urls.mainScreen);
          }, 1000);
        }
      })
      .catch((err) => {
        if (err.response && Array.isArray(err.response.data.msg)) {
          const msgs = err.response.data.msg.map((v) => v.msg);
          toastr.error(msgs);
          this.setState({ showSpinner: false });
        }
      });
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  render() {
    return (
      <>
        {/* begin app */}
        <div className="app">
          {/* begin app-wrap */}
          <div className="app-wrap">
            {/*start login contant*/}
            <div className="app-contant">
              <div className="bg-white">
                <div className="container-fluid p-0">
                  <div className="row no-gutters">
                    <div className="col-sm-6 col-lg-5 col-xxl-3  align-self-center order-2 order-sm-1">
                      <div className="d-flex align-items-center h-100-vh">
                        <div className="login p-50">
                          <h1 className="mb-2">Event Management</h1>
                          <p>Welcome back, please login to your account.</p>
                          <form
                            class="form-horizontal"
                            onSubmit={(e) => this.handleSubmit(e)}
                          >
                            <div className="row">
                              <div className="col-12">
                                <div className="form-group">
                                  <label className="control-label">
                                    Email*
                                  </label>
                                  <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Email"
                                    required="true"
                                    onChange={(e) => this.handleChange(e)}
                                    value={this.state.email}
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label className="control-label">
                                    Password*
                                  </label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    name="password"
                                    required
                                    onChange={(e) => this.handleChange(e)}
                                    value={this.state.password}
                                  />
                                </div>
                              </div>

                              <div className="col-12 mt-3">
                                <button className="btn btn-primary text-uppercase">
                                  {this.state.showSpinner ? (
                                    <span
                                      className="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                  ) : (
                                    "Sign In"
                                  )}
                                </button>
                              </div>
                              <div className="col-12  mt-3">
                                <p>
                                  Don't have an account ?
                                  <Link to={urls.register}> Sign Up</Link>
                                </p>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-xxl-9 col-lg-7 bg-gradient o-hidden order-1 order-sm-2">
                      <div className="row align-items-center h-100">
                        <div className="col-7 mx-auto ">
                          <img
                            className="img-fluid"
                            src="https://svgshare.com/i/m8s.svg"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*end login contant*/}
          </div>
          {/* end app-wrap */}
        </div>
      </>
    );
  }
}

export default Login;
