import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import FormField from "../components/FormField";
import Button from "../components//Button";
import Form from "../components/Form";
import "./Login.css";
import { useEffect } from "react";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, authErrors, resetAuthErrors } = useAuth();

  const redirectPath = location.state?.from?.pathname || "/";

  useEffect(() => {
    resetAuthErrors?.();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await login({ email, password });
    if (!result.ok) {
      return;
    }
    navigate(redirectPath);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3 className="section-title login-form-title">Login</h3>

      <FormField
        label="Email"
        name="email"
        id="email"
        type="email"
        placeholder="example@example.com"
        required
      />

      <FormField
        label="Password"
        name="password"
        id="password"
        type="password"
        required
      />

      <div className="form-actions">
        <Button type="submit" id="login-submit">
          Submit
        </Button>

        <div className="form-errors" aria-live="polite">
          {authErrors?.map((err, i) => (
            <span key={i} className="login-form-errors">
              {err.error}
            </span>
          ))}
        </div>
      </div>

      <div className="form-alt-action">
        Don’t have an account? <Link to="/register">Register</Link>
      </div>
    </Form>
  );
}
