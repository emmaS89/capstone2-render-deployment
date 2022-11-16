import React, { Component } from "react";
import Select from "react-select";

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityId: "",
      title: "",
      startDate: "",
      selectedOption: null,
    };
  }

  handleChange(e) {
    console.log(e);
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleEventSelect = (selectedOption) => {
    this.setState({ selectedOption });
  };
  render() {
    return (
      <>
        <div className="row m-0">
          <div className="col-md-12 col-sm-12 col-12">
            <label className="">City</label>
            <span className="required-class"> *</span>
            <div className="form-group">
              <select
                name="cityId"
                id="cityId"
                onChange={(e) => this.handleChange(e)}
                className="filter-dropdown-height react-select theme-light react-select__control filter-dropdown-height is-untouched is-pristine av-valid form-control"
              >
                <option value="" disabled="">
                  Select
                </option>
                {this.props.cities && this.props.cities.length > 0
                  ? this.props.cities.map((city, index) => {
                      return (
                        <option key={index} value={city.id}>
                          {city.name}
                        </option>
                      );
                    })
                  : null}
              </select>
            </div>
          </div>
          {/* <div className="col-md-4 col-sm-4 col-12">
            <label className="">Event Title</label>
            <span className="required-class"> *</span>
            <div className="form-group">
              <Select
                name="title"
                onChange={this.handleEventSelect}
                options={this.props.eventChoices}
                value={this.state.selectedOption}
              />
              <input
                name="title"
                id="title"
                type="text"
                onChange={(e) => this.handleChange(e)}
                className="filter-dropdown-height react-select theme-light react-select__control filter-dropdown-height is-untouched is-pristine av-valid form-control"
                value={this.state.title}
              />
            </div>
          </div>
          <div className="col-md-4 col-sm-4 col-12">
            <label className="">Start Date</label>
            <span className="required-class"> *</span>
            <div className="form-group">
              <input
                name="startDate"
                id="startDate"
                type="date"
                onChange={(e) => this.handleChange(e)}
                value={this.state.startDate}
                className="filter-dropdown-height is-untouched is-pristine av-valid form-control"
              />
            </div>
          </div> */}
        </div>
        <div className="row mr-4 float-right">
          <div className="col-4 col-md-2" />
          <div className="col-8 col-md-10 p-0">
            <div role="group" className="pull-right btn-group">
              <button
                className="btn btn-success"
                onClick={() =>
                  this.props.filter({
                    cityId: this.state.cityId,
                    title: this.state.selectedOption?.value,
                    startDate: this.state.startDate,
                  })
                }
              >
                <i className="fa  fa-filter" />
                Apply
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => this.props.cancel()}
              >
                 View All
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Filter;
