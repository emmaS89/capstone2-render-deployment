import React, { Component } from "react";
import Maps from "../Map/map";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import urls from "../../helpers/urls";
import auth_axios from "../../utils/auth_axios";
import moment from "moment";
import Filter from "./Filter";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

class MainPage extends Component {
  constructor(props) {
    super(props);
    // states
    this.state = {
      username: "",
      events: [],
      modal_show: false,
      lat: "",
      lng: "",
      addModal: false,
      showSpinner: false,
      title: "",
      description: "",
      organizername: sessionStorage.getItem("userName"),
      address: "",
      contactno: "",
      city: "",
      startDate: "",
      endDate: "",
      id: "",
      initial_lat: 25.35,
      initial_lng: 31.9,
      cities: [],
      event_select: [],
      changePassword: false,
      oldPassword: "",
      newPassword: "",
    };
  }

  async componentDidMount() {
    this.setState({ username: sessionStorage.getItem("userName") });
    await this.getAllEventsFromDataBase();
    await this.getAllCitiesFromDatabase();
  }

  openEventModalForEdit = (data) => {
    console.log(data);
    if (data.userid === parseInt(sessionStorage.getItem("userId"))) {
      this.setState({
        modal_show: true,
        title: data.title,
        description: data.description,
        organizername: data.organizername,
        address: data.address,
        contactno: data.contactno,
        city: data.city.name,
        startDate: data.startdate,
        endDate: data.enddate,
        lat: data.latitude,
        lng: data.longitude,
        id: data.id,
      });
    } else {
      toastr.error("This event will only be update by the created user.");
    }
  };

  normalizeInput = (value, previousValue) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, "");
    const cvLength = currentValue.length;

    if (!previousValue || value.length > previousValue.length) {
      if (cvLength < 4) return currentValue;
      if (cvLength < 7)
        return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
        3,
        6
      )}-${currentValue.slice(6, 10)}`;
    }
  };

  getAllCitiesFromDatabase = async () => {
    auth_axios.defaults.headers.common = {
      Authorization: "Bearer " + sessionStorage.getItem("JWTtoken"),
    };
    await auth_axios
      .get("/api/city/getAll")
      .then((res) => {
        if (res.data.statusCode === 1) {
          this.setState({ cities: res.data.data.cities });
        } else {
          toastr.error("Error in fetching events data");
        }
      })
      .catch((err) => {
        toastr.error("Error in fetching events data");
      });
  };

  showEventOnMap = (data) => {
    this.setState({ initial_lat: data.latitude, initial_lng: data.longitude });
  };

  getAllEventsFromDataBase = async () => {
    auth_axios.defaults.headers.common = {
      Authorization: "Bearer " + sessionStorage.getItem("JWTtoken"),
    };
    await auth_axios
      .get("/api/event/all")
      .then((res) => {
        if (res.data.statusCode === 1) {
          let events = [];
          for (let i = 0; i < res.data.data.events.length; i++) {
            events.push({
              value: res.data.data.events[i].title,
              label: res.data.data.events[i].title,
            });
          }
          this.setState({ events: res.data.data.events, event_select: events });
        } else {
          toastr.error("Error in fetching events data");
        }
      })
      .catch((err) => {
        toastr.error("Error in fetching events data");
      });
  };

  openModal = (event) => {
    this.setState({
      modal_show: true,
      addModal: true,
      lat: event.lngLat.lat,
      lng: event.lngLat.lng,
    });
  };
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleContactNumber(e) {
    this.setState({
      [e.target.name]: this.normalizeInput(
        e.target.value,
        this.state.contactno
      ),
    });
  }
  handleLogout() {
    sessionStorage.clear();
    toastr.success("Logout Success ");
    setTimeout(() => {
      this.props.history.push(urls.login);
    }, 1000);
  }

  async handleChangePasswordSubmit(e) {
    e.preventDefault();
    this.setState({ showSpinner: true });
    if (this.state.changePassword != "") {
      auth_axios.defaults.headers.common = {
        Authorization: "Bearer " + sessionStorage.getItem("JWTtoken"),
      };
      await auth_axios
        .post("/api/users/passwordChange", {
          userId: sessionStorage.getItem("userId"),
          newPassword: this.state.newPassword,
        })
        .then(async (res) => {
          const { statusCode } = res.data;

          if (statusCode !== 1) {
            toastr.error("Password Not Changed");
            this.setState({ showSpinner: false });
          } else {
            toastr.success("Password updated successfull");
            this.setState({
              newPassword: "",
              changePassword: false,
            });
          }
        })
        .catch((err) => {
          if (err.response && Array.isArray(err.response.data.msg)) {
            const msgs = err.response.data.msg.map((v) => v.msg);
            toastr.error(msgs);
            this.setState({ showSpinner: false });
          }
        });
    } else {
      toastr.error("Please enter new password");
    }
  }

  openChangePasswordModal() {
    this.setState({ changePassword: true });
  }

  async handleSubmit(e) {
    e.preventDefault();
    var q = new Date();
    var date = new Date(q.getFullYear(), q.getMonth(), q.getDate());
    date.setHours(0, 0, 0);
    var mydate = new Date(this.state.endDate);
    mydate.setHours(0, 0, 0);
    const d = new Date();

    date.setDate(mydate.getDate() + 1);

    console.log(d);
    console.log(date);
    // if (d.getTime() < date.getTime()) {
    //   toastr.error("end date must be greater then today");
    // } else {
    this.setState({ showSpinner: true });
    if (this.state.addModal) {
      auth_axios.defaults.headers.common = {
        Authorization: "Bearer " + sessionStorage.getItem("JWTtoken"),
      };
      await auth_axios
        .post("/api/event/add", {
          title: this.state.title,
          description: this.state.description,
          startDate: moment(this.state.startDate, "YYYY-MM-DD")
            .add(1, "days")
            .format("X"),
          endDate: moment(this.state.endDate, "YYYY-MM-DD")
            .add(1, "days")
            .format("X"),
          contactno: this.state.contactno,
          latitude: this.state.lat,
          longitude: this.state.lng,
          city: this.state.city,
          address: this.state.address,
          organizername: this.state.organizername,
          userId: sessionStorage.getItem("userId"),
        })
        .then(async (res) => {
          const { statusCode } = res.data;

          if (statusCode !== 1) {
            toastr.error("Event not added successfully");
            this.setState({ showSpinner: false });
          } else {
            toastr.success("Event added successfully");
            this.setState({
              addModal: false,
              showSpinner: false,
              title: "",
              description: "",
              organizername: "",
              address: "",
              contactno: "",
              city: "",
              startDate: "",
              endDate: "",
              lat: "",
              lng: "",
              modal_show: false,
            });
            await this.getAllEventsFromDataBase();
          }
        })
        .catch((err) => {
          if (err.response && Array.isArray(err.response.data.msg)) {
            const msgs = err.response.data.msg.map((v) => v.msg);
            toastr.error(msgs);
            this.setState({ showSpinner: false });
          }
        });
    } else {
      auth_axios.defaults.headers.common = {
        Authorization: "Bearer " + sessionStorage.getItem("JWTtoken"),
      };

      await auth_axios
        .put("/api/event/update/" + this.state.id, {
          title: this.state.title,
          description: this.state.description,
          startDate: moment(this.state.startDate, "YYYY-MM-DD")
            .add(1, "days")
            .format("X"),
          endDate: moment(this.state.endDate, "YYYY-MM-DD")
            .add(1, "days")
            .format("X"),
          contactno: this.state.contactno,
          latitude: this.state.lat,
          longitude: this.state.lng,
          city: this.state.city,
          address: this.state.address,
          organizername: this.state.organizername,
        })
        .then(async (res) => {
          const { statusCode } = res.data;

          if (statusCode !== 1) {
            toastr.error("Event not updated successfully");
            this.setState({ showSpinner: false });
          } else {
            toastr.success("Event updated successfully");
            this.setState({
              addModal: false,
              showSpinner: false,
              title: "",
              description: "",
              organizername: "",
              address: "",
              contactno: "",
              city: "",
              startDate: "",
              endDate: "",
              lat: "",
              lng: "",
              modal_show: false,
              id: "",
            });
            await this.getAllEventsFromDataBase();
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
    // }
  }

  filterEventsData = async (filter) => {
    let data = {
      ...filter,
      startDate:
        filter.startDate !== ""
          ? moment(filter.startDate, "YYYY-MM-DD").add(1, "days").format("X")
          : null,
    };
    auth_axios.defaults.headers.common = {
      Authorization: "Bearer " + sessionStorage.getItem("JWTtoken"),
    };
    await auth_axios
      .post("/api/event/filter", data)
      .then((res) => {
        if (res.data.statusCode === 1) {
          this.setState({ events: res.data.data.events });
        } else {
          toastr.error("Error in fetching events data");
        }
      })
      .catch((err) => {
        toastr.error("Error in getting filter data");
      });
  };
  cancel = async () => {
    await this.getAllEventsFromDataBase();
  };
  render() {
    return (
      <>
        {/* begin app */}
        <div className="app">
          {/* begin app-wrap */}
          <div className="app-wrap">
            {/* begin app-header */}
            <header className="app-header top-bar">
              {/* begin navbar */}
              <nav className="navbar navbar-expand-md">
                {/* begin navbar-header */}
                <div className="navbar-header d-flex align-items-center"></div>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <i className="ti ti-align-left" />
                </button>
                {/* end navbar-header */}
                {/* begin navigation */}
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <div className="navigation d-flex">
                    <ul className="navbar-nav nav-right ml-auto">
                      <li className="nav-item dropdown user-profile">
                        <a
                          href="javascript:void(0)"
                          className="nav-link dropdown-toggle "
                          id="navbarDropdown4"
                          role="button"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <img
                            src="https://www.lenco-marine.com/wp-content/uploads/2021/04/user-512x480.png"
                            alt="avtar-img"
                          />
                          <span className="bg-success user-status" />
                        </a>
                        <div
                          className="dropdown-menu animated fadeIn"
                          aria-labelledby="navbarDropdown"
                        >
                          <div className="bg-gradient px-4 py-3">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="mr-1">
                                <h4 className="text-white mb-0">
                                  {this.state.username}
                                </h4>
                              </div>
                              <a
                                href="#"
                                className="text-white font-20"
                                title
                                data-original-title="Logout"
                                onClick={() => this.handleLogout()}
                              >
                                {" "}
                                Log out
                              </a>
                            </div>
                          </div>
                          <div className="p-4">
                            <a
                              className="dropdown-item d-flex nav-link"
                              onClick={() => this.openChangePasswordModal()}
                            >
                              <i className=" ti ti-settings pr-2 text-info" />{" "}
                              Change Password
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* end navigation */}
              </nav>
              {/* end navbar */}
            </header>
            {/* end app-header */}
            {/* begin app-container */}
            <div className="app-container">
              {/* begin app-nabar */}
              <aside className="app-navbar">
                {/* begin sidebar-nav */}
                <div className="sidebar-nav scrollbar scroll_light">
                  <ul className="metismenu " id="sidebarNav">
                    <li className="nav-static-title">Events List</li>
                    <li>
                      <ul style={{ display: "block !important" }}>
                        {this.state.events.length > 0 ? (
                          this.state.events.map((event, index) => {
                            return (
                              <li key={index}>
                                <a
                                  onClick={() =>
                                    this.openEventModalForEdit(event)
                                  }
                                  href="#"
                                >
                                  {event.title}
                                </a>
                              </li>
                            );
                          })
                        ) : (
                          <li>
                            <a>No Data found</a>
                          </li>
                        )}
                      </ul>
                    </li>
                  </ul>
                </div>
                {/* end sidebar-nav */}
              </aside>
              {/* end app-navbar */}
              {/* begin app-main */}
              <div className="app-main" id="main">
                {/* begin container-fluid */}
                <div className="container-fluid">
                  {/* begin row */}
                  <div className="row">
                    <div className="col-md-12 m-b-30">
                      {/* begin page title */}
                      <div className="d-block">
                        <Filter
                          cities={this.state.cities}
                          filter={this.filterEventsData}
                          cancel={this.cancel}
                          eventChoices={this.state.event_select}
                        />
                      </div>
                      {/* end page title */}
                    </div>
                  </div>
                  {/* end row */}
                  {/* begin row */}
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card card-statistics">
                        <div className="card-header">
                          <div className="card-heading">
                            <h6 className="card-title">
                              Search place from search bar and click on map in
                              order to add event
                            </h6>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="mapaelmap-wrapper">
                            <Maps
                              events={this.state.events}
                              {...this.props}
                              modalopen={this.openModal}
                              lat={this.state.initial_lat}
                              lng={this.state.initial_lng}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end row */}
                </div>
                {/* end container-fluid */}
              </div>
              {/* end app-main */}
            </div>
            {/* end app-container */}
            {/* begin footer */}
            <footer className="footer">
              <div className="row">
                <div className="col-12 col-sm-6 text-center text-sm-left">
                  <p>© Copyright 2019. All rights reserved.</p>
                </div>
              </div>
            </footer>
            {/* end footer */}
          </div>
          {/* end app-wrap */}
        </div>
        {/* end app */}

        <div
          className={`modal fadeIn ${
            this.state.modal_show ? "custom-show" : ""
          }`}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {this.state.addModal ? "Add New Event" : "Edit Event"}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    this.setState({ modal_show: false, addModal: false });
                  }}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form
                  class="form-horizontal"
                  onSubmit={(e) => this.handleSubmit(e)}
                >
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Title:
                        </label>
                        <input
                          type="text"
                          name="title"
                          required
                          className="form-control"
                          id="recipient-name"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.title}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label
                          htmlFor="message-text"
                          className="col-form-label"
                        >
                          Description:
                        </label>
                        <input
                          type={"text"}
                          required
                          className="form-control"
                          id="message-text"
                          name="description"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.description}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label
                          htmlFor="message-text"
                          className="col-form-label"
                        >
                          Organizer Name:
                        </label>
                        <input
                          type={"text"}
                          required
                          className="form-control"
                          name="organizername"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.organizername}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label
                          htmlFor="message-text"
                          className="col-form-label"
                        >
                          Address:
                        </label>
                        <input
                          type={"text"}
                          required
                          className="form-control"
                          name="address"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.address}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label
                          htmlFor="message-text"
                          className="col-form-label"
                        >
                          Contact Number:
                        </label>
                        <input
                          type={"text"}
                          required
                          className="form-control"
                          placeholder="(111) 111-11-11"
                          name="contactno"
                          onChange={(e) => this.handleContactNumber(e)}
                          value={this.state.contactno}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label
                          htmlFor="message-text"
                          className="col-form-label"
                        >
                          City:
                        </label>
                        <input
                          type={"text"}
                          required
                          className="form-control"
                          name="city"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.city}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label
                          htmlFor="message-text"
                          className="col-form-label"
                        >
                          Start Date:
                        </label>
                        <input
                          type={"date"}
                          required
                          className="form-control"
                          name="startDate"
                          onChange={(e) => this.handleChange(e)}
                          value={moment(this.state.startDate).format(
                            "YYYY-MM-DD"
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label
                          htmlFor="message-text"
                          className="col-form-label"
                        >
                          End Date:
                        </label>
                        <input
                          type={"date"}
                          required
                          className="form-control"
                          name="endDate"
                          onChange={(e) => this.handleChange(e)}
                          value={moment(this.state.endDate).format(
                            "YYYY-MM-DD"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      {this.state.showSpinner ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`modal fadeIn ${
            this.state.changePassword ? "custom-show" : ""
          }`}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Change Password
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    this.setState({ changePassword: false });
                  }}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form
                  class="form-horizontal"
                  onSubmit={(e) => this.handleChangePasswordSubmit(e)}
                >
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label
                          htmlFor="message-text"
                          className="col-form-label"
                        >
                          User name:
                        </label>
                        <input
                          type={"text"}
                          disabled
                          className="form-control"
                          id="message-text"
                          name="username"
                          // onChange={(e) => this.handleChange(e)}
                          value={this.state.organizername}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label
                          htmlFor="message-text"
                          className="col-form-label"
                        >
                          New Password:
                        </label>
                        <input
                          type={"password"}
                          required
                          className="form-control"
                          id="message-text"
                          name="newPassword"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.newPassword}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      {this.state.showSpinner ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default MainPage;
