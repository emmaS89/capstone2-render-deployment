import React, { Component } from "react";
import { Link } from "react-router-dom";
import urls from "../../helpers/urls";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
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
      .post("/api/users/register", {
        email: this.state.email,
        pswd: this.state.password,
        firstname: this.state.firstName,
        lastname: this.state.lastName,
      })
      .then((res) => {
        toastr.success("Signup Success Redirecting to login.........");
        this.setState({ showSpinner: false });

        setTimeout(() => {
          this.props.history.push(urls.login);
        }, 1000);
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
                          <p>Welcome back, please create your account.</p>
                          <form
                            class="form-horizontal"
                            onSubmit={(e) => this.handleSubmit(e)}
                          >
                            <div className="row">
                              <div className="col-12 col-sm-6">
                                <div className="form-group">
                                  <label className="control-label">
                                    First Name*
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="First Name"
                                    name="firstName"
                                    required
                                    onChange={(e) => this.handleChange(e)}
                                    value={this.state.firstName}
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-sm-6">
                                <div className="form-group">
                                  <label className="control-label">
                                    Last Name*
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Last Name"
                                    name="lastName"
                                    required
                                    onChange={(e) => this.handleChange(e)}
                                    value={this.state.lastName}
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label className="control-label">
                                    Email*
                                  </label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    name="email"
                                    required
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
                              {/* <div className="col-12">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="gridCheck"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="gridCheck"
                                  >
                                    I accept terms &amp; policy
                                  </label>
                                </div>
                              </div> */}
                              <div className="col-12 mt-3">
                                <button className="btn btn-primary text-uppercase">
                                  {this.state.showSpinner ? (
                                    <span
                                      className="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                  ) : (
                                    "Sign up"
                                  )}
                                </button>
                              </div>
                              <div className="col-12  mt-3">
                                <p>
                                  Already have an account ?
                                  <Link to={urls.login}> Sign In</Link>
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

export default Register;
