import React, { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, LogIn } from "lucide-react";
import Alert from "../components/common/Alert";
import AuthLayout from "../components/common/AuthLayout";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";
import GoogleAuthButton from "../components/common/GoogleAuthButton";
import AuthDivider from "../components/common/AuthDivider";

const Login = ({ onLogin, user }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Explicit message-type state: errorMessage drives the Alert; the
  // preload panel is driven only by isDataLoading + progress state (no
  // substring sniffing on a shared message string).
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingDetails, setLoadingDetails] = useState("");

  // Listen to user-data loading progress events
  useEffect(() => {
    const handleLoadingProgress = (event) => {
      if (event.detail && typeof event.detail.progress === 'number') {
        setLoadingProgress(event.detail.progress);
        setLoadingDetails(event.detail.message || "");
      }
    };

    window.addEventListener('userDataLoadingProgress', handleLoadingProgress);

    return () => {
      window.removeEventListener('userDataLoadingProgress', handleLoadingProgress);
    };
  }, []);

  // Listen to user-data loading lifecycle events
  useEffect(() => {
    const handleDataLoading = () => {
      setIsDataLoading(true);
    };

    const handleDataLoaded = (event) => {
      setIsDataLoading(false);
      const status = event.detail?.status;

      if (status === 'completed') {
        // All data loaded successfully - navigate to dashboard
        const urlParams = new URLSearchParams(location.search);
        const redirectPath = urlParams.get("redirect");

        if (redirectPath) {
          navigate(decodeURIComponent(redirectPath));
        } else {
          navigate("/dashboard");
        }
      } else if (status === 'error') {
        // Preload errored - navigate to dashboard anyway
        console.warn('אירעה שגיאה בטעינת נתונים מקדימה, ממשיכים לדף הבית');
        navigate("/dashboard");
      }
    };

    window.addEventListener('userDataPreloading', handleDataLoading);
    window.addEventListener('userDataPreloaded', handleDataLoaded);

    return () => {
      window.removeEventListener('userDataPreloading', handleDataLoading);
      window.removeEventListener('userDataPreloaded', handleDataLoaded);
    };
  }, [navigate, location.search]);

  useEffect(() => {
    document.title = 'התחברות - Course4Me';

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Course4Me';
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authError = urlParams.get("error");

    if (authError === "google_auth_failed") {
      setErrorMessage("התחברות עם Google נכשלה, נסה שוב");
    } else if (authError === "google_auth_unavailable") {
      setErrorMessage("התחברות עם Google אינה זמינה כרגע");
    }
  }, [location.search]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const redirectPath = urlParams.get("redirect");

    if (user !== null) {
      if (user && redirectPath) {
        navigate(decodeURIComponent(redirectPath));
      } else if (user) {
        navigate("/dashboard");
      }
    }
  }, [user, location, navigate]);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await apiFetch(`/api/auth/login`, {
        method: "POST",
        body: formData,
        auth: false,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userFullName", data.user.fullName);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userId", data.user._id);

      // Store if password reset is required
      if (data.requiresPasswordReset) {
        localStorage.setItem("requiresPasswordReset", "true");
      }

      // Check if user needs to reset password first - skip preload when so
      if (data.requiresPasswordReset) {
        onLogin(data);
        navigate("/reset-password");
        return;
      }

      setIsDataLoading(true);

      // onLogin is async and waits for preload to finish
      await onLogin(data);

      // Navigation to dashboard happens in the preload-finished listener (useEffect)

    } catch (err) {
      setErrorMessage(err.message || "התחברות נכשלה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout icon={LogIn} title="התחברות" subtitle="ברוך שובך! התחבר כדי להמשיך">
      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div>
          <PasswordInput
            name="password"
            label="סיסמה"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="mt-2 text-left">
            <Link
              to="/forgot-password"
              className="text-sm text-brand hover:text-brand-strong font-medium hover:underline transition-colors duration-ui"
            >
              שכחתי סיסמה
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={isLoading || isDataLoading}
        >
          {isDataLoading ? "טוען נתונים..." : isLoading ? "מתחבר..." : "התחבר"}
        </Button>
      </form>

      <AuthDivider />
      <GoogleAuthButton disabled={isLoading || isDataLoading} />

      {isDataLoading && (
        <div className="mt-6 p-4 rounded-card-lg bg-brand-tint text-brand-strong border border-brand-soft flex flex-col space-y-3" role="status">
          <div className="flex items-center">
            <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin ml-3" aria-hidden="true" />
            <p className="text-right font-medium flex-grow">טוען את הנתונים שלך...</p>
          </div>
          <div className="w-full">
            <div className="text-xs text-brand-strong mb-1">{loadingDetails || "טוען נתונים..."}</div>
            <div className="w-full bg-brand-soft rounded-full h-2.5 mb-1">
              <div className="bg-brand h-2.5 rounded-full transition-all duration-ui" style={{ width: `${loadingProgress}%` }} />
            </div>
            <div className="text-xs text-right text-brand-strong">{loadingProgress}%</div>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="mt-6">
          <Alert type="error" message={errorMessage} onDismiss={() => setErrorMessage('')} />
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-slate-200 text-center">
        <p className="text-muted">
          עוד לא נרשמת?{" "}
          <Link
            to="/signup"
            className="text-brand hover:text-brand-strong font-semibold hover:underline transition-colors duration-ui"
          >
            הירשם עכשיו
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
