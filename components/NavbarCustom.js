import Link from "next/link";
import { useAuth } from "../context/auth.tsx";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default function NavbarCustom() {
  const { signOut } = useAuth();
  return (
    <Navbar
      className="justify-content-between"
      style={{
        backgroundColor: "rgb(0, 0, 0)",
        padding: "10px",
      }}
    >
      <Nav>
        <Link href="/">Home</Link>{" "}
        <Link href="/janitorAssignment">Caretaker</Link>{" "}
        <Link href="/building">Building</Link>
      </Nav>

      <Nav>
        <Button variant="primary" onClick={() => signOut()}>
          Sign Out
        </Button>
      </Nav>
    </Navbar>
  );
}
