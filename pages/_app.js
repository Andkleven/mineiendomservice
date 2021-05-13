import AuthContext from "../context/auth.tsx";
import "../style/index.css";
import "../style/customTheme.scss";
import Head from "next/head";
import NavbarCustom from "../components/NavbarCustom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <AuthContext>
      <Head>
        <title>Mineiendomservice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavbarCustom />
      <Component {...pageProps} />
      <Button
        onClick={() => router.push("/chat")}
        variant="outline-primary"
        className="btn-circle btn-xl"
        style={{ position: "absolute", right: 0, bottom: 0, margin: "20px" }}
      >
        <FontAwesomeIcon icon={faCommentDots} />
      </Button>
    </AuthContext>
  );
}
