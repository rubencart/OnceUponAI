import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import React, { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css';
import 'leaflet-gps';

// Classes used by Leaflet to position controls
const POSITION_CLASSES = {
	bottomleft: 'leaflet-bottom leaflet-left',
	bottomright: 'leaflet-bottom leaflet-right',
	topleft: 'leaflet-top leaflet-left',
	topright: 'leaflet-top leaflet-right',
  }

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
	
	const GeolocatingButton = () => {
		const [map, setMap] = useState(null);
		const [location, setLocation] = useState(null);
		
		useEffect(() => {
		  if (map) {
			map.locate();
			map.on('locationfound', handleLocationFound);
		  }
		}, [map]);
		
		const handleLocationFound = (e) => {
		  const { lat, lng } = e.latlng;
		  setLocation([lat, lng]);
		};
		
		const handleClick = () => {
		  if (map) {
			map.locate();
		  }
		};
		
		return (
		  <div>
			<button onClick={handleClick}>Get location</button>
			{location && (
			  <Map center={location} zoom={15} style={{ height: '400px' }} ref={setMap}>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				<Marker position={location} />
			  </Map>
			)}
		  </div>
		);
	  };
	
  return (
    <MapContainer center={[51.05314,3.72626]} zoom={13} scrollWheelZoom={false} style={{height: 400, width: "100%"}}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}
	  		<GeolocatingButton position="topright"/>
    </MapContainer>
  )
}

export default LeafletMap
