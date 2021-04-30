import { useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import GoogleLogin from "../components/GoogleLogin";
import { useAuth } from "../context/auth.tsx";

export default function signUp() {
  const { signUpWithEmailAndPassword } = useAuth;
  const handleSignUpPassword = useCallback(async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    signUpWithEmailAndPassword({ redirect: "/", email, password });
  }, []);
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
          <h3 className="text-center">Sign Up</h3>
          <Form onSubmit={handleSignUpPassword}>
            <Form.Group className="form-group">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                className="form-control"
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                className="form-control"
                placeholder="Enter password"
              />
            </Form.Group>

            <Button
              variant="primary"
              className="w-100 mb-3 text-light"
              type="submit"
            >
              Sign Up
            </Button>
          </Form>
          <GoogleLogin />
          <div align="center">
            <p
              className="forgot-password text-right"
              style={{ marginTop: "10px" }}
            >
              Already registered <a href="/login">sign in?</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
