import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-gps";
import GeolocationButton from "./GeolocationButton";
import Poi from "./Poi";

// Classes used by Leaflet to position controls
// const POSITION_CLASSES = {
//   bottomleft: "leaflet-bottom leaflet-left",
//   bottomright: "leaflet-bottom leaflet-right",
//   topleft: "leaflet-top leaflet-left",
//   topright: "leaflet-top leaflet-right",
// };



const LeafletMap = ({ pois }) => {
  const [locations, setLocations] = useState([]);
  const LocationMarker = () => {
    const [position, setPosition] = useState(null);

    const map = useMap();

    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  return (
    <MapContainer
      center={[51.05314, 3.72626]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: 600, width: "100%", zIndex: "0" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}
      <Poi locations={pois} />
      <GeolocationButton
        position="topright"
        title={"Get Location"}
        markerPosition={[20.27, -157]}
        description="Get your location!"
      />
    </MapContainer>
  );
};

export default LeafletMap;
