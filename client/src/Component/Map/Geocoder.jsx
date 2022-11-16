import React, { Component } from "react";
import MapBoxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useControl } from "react-map-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

function Geocoder(props) {
  const ctrl = new MapBoxGeocoder({
    accessToken: props.token,

    collapsed: false,
  });
  useControl(() => ctrl);
  ctrl.on("result", (e) => {
    const coords = e.result.geometry.coordinates;
    props.updateValues(coords);
  });
  return null;
}

export default Geocoder;
