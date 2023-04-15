import BackgroundCanvas from "@/components/BackgroundCanvas";
import "../styles/chatbot.css";
import "../styles/globals.css";


function MyApp({ Component, pageProps }) {
  return (
    <>
      <BackgroundCanvas />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
