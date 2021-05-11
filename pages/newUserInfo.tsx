import { useCallback, FC, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../context/auth";

const signUp: FC = () => {
  const { updateProfile } = useAuth();
  const [image, setImage] = useState(null);
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const { email, password, name } = event.target.elements;
    updateProfile({
      email: email.value,
      password: password.value,
      name: name.value,
      photoURL: image,
    });
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
          <h3 className="text-center">Ny bruker Info</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-1 rounded-0">
              <Form.Control type="email" placeholder="Mail" required={true} />
            </Form.Group>
            <br />
            <Form.Group className="mb-1 rounded-0">
              <Form.Control
                type="password"
                placeholder="Passord"
                required={true}
              />
            </Form.Group>
            <br />
            <Form.Group className="mb-1 rounded-0">
              <Form.Control type="name" placeholder="Navn" required={true} />
            </Form.Group>
            <br />
            <Form.Group controlId="image" className="mb-1 rounded-0">
              <Form.File
                label="Profil Bilde"
                onChange={(e) =>
                  setImage((e.target as HTMLInputElement)?.files?.[0])
                }
              />
            </Form.Group>
            <br />
            <Button
              variant="primary"
              className="w-100 mb-3 text-light"
              type="submit"
            >
              Lagre
            </Button>
          </Form>
          <div style={{ textAlign: "center" }}>
            <p
              className="forgot-password text-right"
              style={{ marginTop: "10px" }}
            >
              <a href="/">Hop over</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default signUp;
