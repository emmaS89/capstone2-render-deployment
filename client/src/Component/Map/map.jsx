import React, { useRef } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./../Map/index.css";
import MapBoxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import moment from "moment";
import ReactMapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
  useMap,
} from "react-map-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocoder from "./Geocoder";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZW1tYXM4OSIsImEiOiJjbDdhbWNrM3kwM3A2M29wN211eHY1ZjV1In0.tOUsvvxamG824K1xOKtomw";

const CustomMarker = ({ index, marker, openPopup, close }) => {
  //   console.log(marker);
  if (marker) {
    return (
      <Marker longitude={marker.longitude} latitude={marker.latitude}>
        <div className="marker" onMouseEnter={() => openPopup(index)}>
          <img
            src="https://i.postimg.cc/z39zjHZF/pngegg.png"
            border="0"
            alt="pngegg"
            style={{ width: 60, height: "100%" }}
          />
        </div>
      </Marker>
    );
  }
};

const CustomPopup = ({ index, marker, closePopup }) => {
  //   console.log(marker);
  if (marker) {
    return (
      <Popup
        latitude={marker.latitude}
        longitude={marker.longitude}
        onClose={closePopup}
        closeButton={true}
        closeOnClick={false}
        offsetTop={-30}
      >
        <table className="table" style={{ fontSize: "11px" }}>
          <tbody>
            <tr>
              <th>Title</th>
              <td>{marker.title}</td>
            </tr>
            <tr>
              <th>Organization</th>
              <td>{marker.organizername}</td>
            </tr>
            <tr>
              <th>Contact</th>
              <td>{marker.contactno}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{marker.description}</td>
            </tr>
            <tr>
              <th>Start Date</th>
              <td>
                {moment(marker.startDate).format("ddd MMM DD YYYY HH:mm:ss")}
              </td>
            </tr>
            <tr>
              <th>End Date</th>
              <td>
                {moment(marker.endDate).format("ddd MMM DD YYYY HH:mm:ss")}
              </td>
            </tr>
          </tbody>
        </table>
      </Popup>
    );
  }
};
export default class Maps extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lng: 31.9,
      lat: 25.35,
      zoom: 9,
      marker: [
        {
          lat: 25,
          lng: 31,
        },
        {
          lat: 12,
          lng: 21,
        },
      ],
      events: this.props.events,
      selectedIndex: null,
    };
    this.mapContainer = React.createRef();
    this.mapref = React.createRef();
  }

  setSelectedMarker = (index) => {
    this.setState({ selectedIndex: index });
  };

  closePopup = () => {
    this.setSelectedMarker(null);
  };

  openPopup = (index) => {
    this.setSelectedMarker(index);
  };
  renderPopup = () => {
    return (
      <Popup>
        <h1>hello</h1>
      </Popup>
    );
  };
  updateValues = (coords) => {
    // console.log(coords);
    this.setState({ lat: coords[1], lng: coords[0] });
  };

  ctrl = new MapBoxGeocoder({
    accessToken: MAPBOX_TOKEN,
    marker: false,
    collapsed: true,
  });

  addMarker = (e) => {
    this.props.modalopen(e);
    // this.setState({
    //   marker: [...this.state.marker, { lat: e.lngLat.lat, lng: e.lngLat.lng }],
    // });
    // console.log(e);
  };

  testM = (e) => {
    // console.log(e);
  };
  render() {
    const { lng, lat, zoom } = this.state;
    return (
      <div>
        <ReactMapGL
          ref={this.mapref}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: this.props.lng,
            latitude: this.props.lat,
            zoom: 1,
          }}
          style={{ height: "40rem", position: "relative" }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          onClick={this.addMarker}
        >
          {this.props.events && this.props.events.length > 0
            ? this.props.events.map((data, index) => {
                // console.log(index);
                return (
                  <CustomMarker
                    key={`marker-${index}`}
                    index={index}
                    marker={data}
                    openPopup={this.openPopup}
                    close={this.closePopup}
                  />
                );
              })
            : ""}
          {this.state.selectedIndex !== null && (
            <CustomPopup
              index={this.state.selectedIndex}
              marker={this.props.events[this.state.selectedIndex]}
              closePopup={this.closePopup}
            />
          )}
          <NavigationControl position="bottom-right" />
          <GeolocateControl
            position="top-left"
            trackUserLocation
            onGeolocate={(e) => {
              this.setState({
                lat: e.coords.latitude,
                lng: e.coords.longitude,
              });
            }}
          />
          <Geocoder
            updateValues={this.updateValues}
            token={MAPBOX_TOKEN}
            style={{}}
          />
        </ReactMapGL>
      </div>
    );
  }
}
