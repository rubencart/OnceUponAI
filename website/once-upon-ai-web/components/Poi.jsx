import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'


const defaultIcon = new L.icon({
  iconUrl: '/static/images/draakje.png', // your path may vary ...
  iconSize: [24, 24],
  iconAnchor: [2, 2],
  popupAnchor: [0, -2]
});

const Poi = (props) => {
  const { locations } = props;
  
  return (
      locations.map((location) => (
        <Marker key={location.object_id} position={location.coordinates} icon={defaultIcon}>
          <Popup>
            <div>
              <h2>{location.title}</h2>
              <img src={location.image_url} alt={location.title} />
              <p>{location.description}</p>
              <p>{location.address}</p>
            </div>
          </Popup>
        </Marker>
      ))
  );
}

export default Poi;