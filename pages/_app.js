import AuthContext from "../context/auth.tsx";
import DataProvider from "../context/data.tsx";
import "../style/index.css";
import "../style/customTheme.scss";
import Head from "next/head";
import NavbarCustom from "../components/NavbarCustom";

export default function App({ Component, pageProps }) {
  return (
    <AuthContext>
      <DataProvider>
        <Head>
          <title>Ola</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavbarCustom />
        <Component {...pageProps} />
      </DataProvider>
    </AuthContext>
  );
}
