import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Container from "../components/Container";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Once Upon AI</title>
        <meta name="description" content="Homepage for Once Upon AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main>
        <Container>
          <h1>Once Upon AI</h1>
          <h2>Welcome!</h2>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
