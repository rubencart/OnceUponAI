import BackgroundCanvas from "@/components/BackgroundCanvas";
import "../styles/chatbot.css";
import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import RouteContextProvider from "@/context/RouteContext";

function MyApp({ Component, pageProps }) {
  return (
    <RouteContextProvider>
      <BackgroundCanvas />
      <Component {...pageProps} />
    </RouteContextProvider>
  );
}

export default appWithTranslation(MyApp);
