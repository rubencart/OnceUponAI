import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import React, { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css'



const LeafletMap = () => {
	const LocationMarker = () => {
		const [position, setPosition] = useState(null);
	
		const map = useMap();
	
		useEffect(() => {
			map.locate().on("locationfound", function (e) {
				setPosition(e.latlng);
				map.flyTo(e.latlng, map.getZoom());
			});
		}, []);
	
		return position === null ? null : (
			<Marker position={position}>
				<Popup>You are here</Popup>
			</Marker>
		);
	}
  return (
    <MapContainer center={[51.05314,3.72626]} zoom={13} scrollWheelZoom={false} style={{height: 400, width: "100%"}}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
			<LocationMarker />
    </MapContainer>
  )
}

export default LeafletMap
