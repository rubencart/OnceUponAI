import { createContext, useState } from "react";

export const RouteContext = createContext();

export default function RouteContextProvider({ children }) {
  const [routeObjects, setRouteObjects] = useState([]);

  return <RouteContext.Provider value={{ routeObjects, setRouteObjects }}>{children}</RouteContext.Provider>;
}
