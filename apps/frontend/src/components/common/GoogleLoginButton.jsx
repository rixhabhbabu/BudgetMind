import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button.jsx";
import { LogIn } from "lucide-react";

export function GoogleLoginButton() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <Button type="button" variant="secondary" onClick={handleGoogleLogin}>
      <LogIn size={18} /> Continue with Google
    </Button>
  );
}
