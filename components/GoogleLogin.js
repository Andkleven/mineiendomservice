import { useCallback } from "react";
import { useAuth } from "../context/auth.tsx";
import Button from "react-bootstrap/Button";

export default function GoogleLogin() {
  const { signInWithGoogle } = useAuth();
  const handleLoginGoogle = useCallback(async (event) => {
    event.preventDefault();
    signInWithGoogle("/");
  }, []);
  return (
    <div className="login-buttons">
      <Button className="login-provider-button" onClick={handleLoginGoogle}>
        <img
          src="https://img.icons8.com/ios-filled/50/000000/google-logo.png"
          alt="google icon"
        />
        <span> Sign In with Google</span>
      </Button>
    </div>
  );
}
