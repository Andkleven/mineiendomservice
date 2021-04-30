import { useCallback } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/auth.tsx";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import GoogleLogin from "../components/GoogleLogin";

export default function Login() {
  const router = useRouter();
  const { user, signInWithEmailAndPassword } = useAuth();
  const handleLoginPassword = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      signInWithEmailAndPassword({ redirect: "/", email, password });
    },
    [router]
  );

  if (user) {
    router.push("/");
    return null;
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#42a5f5",
      }}
    >
      <div
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          borderRadius: "5px",
        }}
      >
        <div className="p-3 w-100">
          <h3 className="text-center">Sign In</h3>
          <Form onSubmit={handleLoginPassword}>
            <Form.Group controlId="formUsername" className="mb-1 rounded-0">
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-1 rounded-0">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
              />
            </Form.Group>
            <Button
              variant="primary"
              className="w-100 mb-3 text-light"
              type="submit"
            >
              Login <FontAwesomeIcon icon={faSignInAlt} />
            </Button>
          </Form>
          <GoogleLogin />
          <div align="center" style={{ marginTop: "10px" }}>
            <a href={`/signUp`}>Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}
