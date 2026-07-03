import React, { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, LogIn } from "lucide-react";
import Alert from "../components/common/Alert";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";

const Login = ({ onLogin, user }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
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
        setMessage(`טוען נתונים: ${event.detail.message || ""}`);
      }
    };

    window.addEventListener('userDataLoadingProgress', handleLoadingProgress);
    
    return () => {
      window.removeEventListener('userDataLoadingProgress', handleLoadingProgress);
    };
  }, []);

  // Listen to user-data loading lifecycle events
  useEffect(() => {
    const handleDataLoading = (event) => {
      setIsDataLoading(true);
      setMessage("טוען את הנתונים שלך...");
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
    setMessage("");

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

      // Surface a loading message while preload runs
      setMessage("מתחבר וטוען נתונים... (אנא המתן)");
      setIsDataLoading(true);

      // onLogin is async and waits for preload to finish
      await onLogin(data);

      // Navigation to dashboard happens in the preload-finished listener (useEffect)

    } catch (err) {
      setMessage(err.message || "התחברות נכשלה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4 shadow-card">
            <LogIn className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">התחברות</h1>
          <p className="text-gray-600">ברוך שובך! התחבר כדי להמשיך</p>
        </div>

        <Card variant="raised" padding="lg">
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
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors duration-ui"
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

          {message && (message.includes('טוען') || message.includes('נתונים')) && (
            <div className="mt-6 p-4 rounded-card-lg bg-blue-50 text-blue-700 border border-blue-200 flex flex-col space-y-3" role="status">
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-3" aria-hidden="true" />
                <p className="text-right font-medium flex-grow">{message}</p>
              </div>
              {isDataLoading && (
                <div className="w-full">
                  <div className="text-xs text-blue-700 mb-1">{loadingDetails || "טוען נתונים..."}</div>
                  <div className="w-full bg-blue-100 rounded-full h-2.5 mb-1">
                    <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2.5 rounded-full transition-all duration-ui" style={{ width: `${loadingProgress}%` }} />
                  </div>
                  <div className="text-xs text-right text-blue-600">{loadingProgress}%</div>
                </div>
              )}
            </div>
          )}
          {message && !message.includes('טוען') && !message.includes('נתונים') && (
            <div className="mt-6">
              <Alert type={message.includes('בהצלחה') ? 'success' : 'error'} message={message} onDismiss={() => setMessage('')} />
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-gray-600">
              עוד לא נרשמת?{" "}
              <Link
                to="/signup"
                className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors duration-ui"
              >
                הירשם עכשיו
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
