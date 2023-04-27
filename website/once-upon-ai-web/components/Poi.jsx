import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";
import {BrowserView, MobileView} from 'react-device-detect';

const defaultIcon = new L.icon({
  iconUrl: "/static/images/marker.png", // your path may vary ...
  iconSize: [24, 24],
  iconAnchor: [2, 2],
  popupAnchor: [0, -2],
});

const hoverIcon = new L.icon({
  iconUrl: "/static/images/draakje.png", // your path may vary ...
  iconSize: [24, 24],
  iconAnchor: [2, 2],
  popupAnchor: [0, -2],
});


const Poi = ({ locations }) => {
  if (!locations) {
    return;
  }
  const markerHover = (event, id ) => {
    const sideBarElement = document.querySelector(`[data-id='${id}']`);
    const eventImage = event.target['_icon'];
    if(event.type == 'mouseover'){
      sideBarElement.classList.add('poi-sidebar-active');
      sideBarElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      eventImage.classList.add('poi-marker-active');
      eventImage.classList.remove('poi-marker-non-active');
    } 
    else{
      // sideBarElement.classList.remove('poi-sidebar-active');
      eventImage.classList.add('poi-marker-non-active');
      eventImage.classList.remove('poi-marker-active');
    }
    
  }

  const markedClicked = (event, id) => {
    var clickEvent = new MouseEvent("click", {
      "view": window,
      "bubbles": true,
      "cancelable": false
  });
    document.querySelector(`[data-button-id='${id}']`).dispatchEvent(clickEvent);
  }
  
  return locations.map((location) => (
      <Marker eventHandlers={{
        mouseover: (e) => {markerHover(e,location.object_id)},
        mousedown: (e) => {markedClicked(e,location.object_id)},
        mouseout: (e) => {markerHover(e,location.object_id)},
      }} key={location.object_id} position={location.coordinates} icon={defaultIcon}>
        <MobileView>
        <Popup>
          <div>
          <h2>{location.title}</h2>
          <img src={location.image_url} alt={location.title} />
          <p>{location.description}</p>
          <p>{location.address}</p>
          </div>
        </Popup>
        </MobileView>
      </Marker>
  ));
};

export default Poi;
