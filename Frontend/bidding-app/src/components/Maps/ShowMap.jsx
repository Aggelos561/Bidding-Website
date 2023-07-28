import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";


const ShowMap = (props) => {
  return props.longitude && props.latitude ? (

    <MapContainer
      style={{ width: "40vw", height: "40vh", margin: "auto" }}
      center={[props.latitude, props.longitude]}
      zoom={12}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        icon={
          new Icon({
            iconUrl: markerIconPng,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })
        }
        position={[props.latitude, props.longitude]}
      >
        <Popup>Auction's Location</Popup>
      </Marker>
    </MapContainer>

  ) : null;
};

export default ShowMap;
