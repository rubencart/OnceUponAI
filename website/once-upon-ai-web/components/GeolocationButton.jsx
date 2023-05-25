import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const Description = (props) => {
  const helpButtonRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    const createButtonControl = () => {
      const HelpButtonControl = L.Control.extend({
        onAdd: (map) => {
          const helpButton = L.DomUtil.create("button", "");
          helpButtonRef.current = helpButton;
          helpButton.innerHTML = props.title;
          helpButton.style = `
          font-family: "Mazius Review Extra", sans-serif;
          background-color: transparent;
          color: black;
          margin-top: 8px;
          box-sizing: border-box;
          position: relative;
          border: 1.5px solid black;
          padding: 8px 32px;
          text-align: center;
          overflow: hidden;
          -webkit-transition: all 1s ease;
          -moz-transition: all 1s ease;
          -o-transition: all 1s ease;
          transition: all 1s ease;
        
          &:hover {
            opacity: 0.67;
            transform: scale(0.95);
          }
          &:before,
          &:after {
            content: "";
            aspect-ratio: 1 / 1;
            height: calc(3px + 100%);
            -moz-border-radius: 50%;
            -webkit-border-radius: 50%;
            border-radius: 50%;
            border: 1.5px solid black;
            position: absolute;
            box-sizing: border-box;
          }
          &:after {
            right: 0;
            transform: translate(50%, -9.5px);
          }
          &:before {
            left: 0;
            transform: translate(-50%, -9.5px);
          }`;
          helpButton.addEventListener("click", () => {
            map.locate();
            map.on("locationfound", handleLocationFound);
            map.on("locationerror", handleLocationError);
          });
          return helpButton;
        },
      });
      return new HelpButtonControl({ position: props.position });
    };

    const control = createButtonControl();
    control.addTo(map);

    return () => {
      if (helpButtonRef.current) {
        helpButtonRef.current.remove();
      }
    };
  }, [map, props.title]);

  const handleLocationFound = (event) => {
    const marker = L.marker(event.latlng).addTo(map);
    marker.bindPopup("You are here").openPopup();
    map.flyTo(event.latlng, map.getZoom(), {
      animate: true,
      duration: 1.0,
    });
    map.on("locationfound", updateLocation);
  };

  const updateLocation = (event) => {
    const marker = L.marker(event.latlng);
    marker.addTo(map);
    marker.bindPopup("You are here").openPopup();
    map.flyTo(event.latlng, map.getZoom(), {
      animate: true,
      duration: 1.0,
    });
  };

  const handleLocationError = (event) => {
    alert("Error finding your location");
  };

  return null;
};

const withMap = (Component) => {
  const WithMap = (props) => {
    const map = useMap();
    return <Component {...props} map={map} />;
  };
  return WithMap;
};

export default withMap(Description);
