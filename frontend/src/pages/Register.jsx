import "./Register.css";
import Form from "../components/Form";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Register() {
  const { register, authErrors, resetAuthErrors } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const redirectPath = location.state?.from?.pathname || "/";

  useEffect(() => {
    resetAuthErrors?.();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await register({ email, password });
    if (!result.ok) {
      return;
    }
    navigate(redirectPath);
  };

  return (
    <Form onSubmit={handleRegister}>
      <h3 className="section-title">Register</h3>
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
        placeholder=""
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
        Have an account already? <Link to="/login">Login</Link>
      </div>
    </Form>
  );
}
