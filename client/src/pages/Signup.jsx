import React, { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail } from "lucide-react";
import Alert from "../components/common/Alert";
import AuthLayout from "../components/common/AuthLayout";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";
import GoogleAuthButton from "../components/common/GoogleAuthButton";

const Signup = ({ onLogin }) => {
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = 'הרשמה - Course4Me';
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Course4Me';
    };
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const isPasswordLengthError = passwordError === "הסיסמה חייבת להכיל לפחות 6 תווים";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("הסיסמאות אינן תואמות");
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    setIsLoading(true);
    setPasswordError("");
    setMessage(""); // Clear previous messages

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const data = await apiFetch(`/api/auth/signup`, {
        method: "POST",
        body: dataToSend,
        auth: false,
      });

      // Store user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userFullName", data.user.fullName);
      localStorage.setItem("userRole", data.user.role);

      // Call onLogin with the complete response data
      await onLogin(data);

      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setMessage(err.message || "ההרשמה נכשלה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout icon={User} title="הרשמה" subtitle="צור חשבון כדי להתחיל">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              name="fullName"
              label="שם מלא"
              autoComplete="name"
              leftIcon={User}
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <Input
              type="email"
              name="email"
              label="כתובת אימייל"
              autoComplete="email"
              leftIcon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <PasswordInput
              name="password"
              label="סיסמה"
              hint={!passwordError ? "לפחות 6 תווים" : undefined}
              error={isPasswordLengthError ? passwordError : undefined}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <PasswordInput
              name="confirmPassword"
              label="אימות סיסמה"
              error={passwordError && !isPasswordLengthError ? passwordError : undefined}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button type="submit" size="lg" fullWidth loading={isLoading}>
              {isLoading ? "נרשם..." : "הירשם"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4" aria-hidden="true">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm font-medium text-slate-500">או</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <GoogleAuthButton disabled={isLoading} />

          {message && (
            <div className="mt-6">
              <Alert type="error" message={message} onDismiss={() => setMessage("")} />
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-muted">
              כבר רשום?{" "}
              <Link
                to="/login"
                className="text-brand hover:text-brand-strong font-semibold hover:underline transition-colors duration-ui"
              >
                התחבר כאן
              </Link>
            </p>
          </div>
    </AuthLayout>
  );
};

export default Signup;
