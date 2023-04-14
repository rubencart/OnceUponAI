import BackgroundCanvas from "@/components/BackgroundCanvas";
import "../styles/globals.css";
import "react-chatbot-kit/build/main.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <BackgroundCanvas />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
