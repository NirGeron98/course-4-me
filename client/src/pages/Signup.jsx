import React, { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail } from "lucide-react";
import Alert from "../components/common/Alert";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4 shadow-card">
            <User className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">הרשמה</h1>
          <p className="text-gray-600">צור חשבון כדי להתחיל</p>
        </div>

        <Card variant="raised" padding="lg">
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

          {message && (
            <div className="mt-6">
              <Alert type="error" message={message} onDismiss={() => setMessage("")} />
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-gray-600">
              כבר רשום?{" "}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors duration-ui"
              >
                התחבר כאן
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;