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
