import BackgroundCanvas from "@/components/BackgroundCanvas";
import "../styles/chatbot.css";
import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <BackgroundCanvas />
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);
