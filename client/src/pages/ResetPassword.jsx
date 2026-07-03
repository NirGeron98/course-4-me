import React, { useState, useEffect } from 'react';
import { apiFetch } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  AlertCircle,
  Save,
  Loader2,
  Shield,
  LogOut
} from 'lucide-react';
import Alert from '../components/common/Alert';
import Card from '../components/common/Card';
import PasswordInput from '../components/common/PasswordInput';
import Button from '../components/common/Button';

const ResetPassword = ({ user, onLogout, updateUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectBarFilled, setRedirectBarFilled] = useState(false);
  
  // Check if user is using temporary password
  const isUsingTempPassword = user?.requiresPasswordReset || localStorage.getItem("requiresPasswordReset") === "true";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("requiresPasswordReset");
    onLogout();
    navigate("/login");
  };

  useEffect(() => {
    document.title = 'שינוי סיסמה - Course4Me';
    
    return () => {
      document.title = 'Course4Me';
    };
  }, []);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) {
      errors.push('הסיסמה חייבת להכיל לפחות 6 תווים');
    }
    if (!/[A-Za-z]/.test(password)) {
      errors.push('הסיסמה חייבת להכיל לפחות אות אחת');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('הסיסמה חייבת להכיל לפחות ספרה אחת');
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset messages when user types
    setMessage('');
    
    // Validate new password in real-time
    if (name === 'newPassword') {
      setPasswordErrors(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validate passwords
    const newPasswordErrors = validatePassword(formData.newPassword);
    if (newPasswordErrors.length > 0) {
      setPasswordErrors(newPasswordErrors);
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('הסיסמאות החדשות אינן זהות');
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiFetch(`/api/auth/reset-password`, {
        method: 'POST',
        body: {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        token: user.token,
      });

      setMessage(data.message);
      setIsSuccess(true);
      
      // Clear the password reset requirement
      localStorage.removeItem("requiresPasswordReset");
      
      // Update user state to remove password reset requirement
      const updatedUser = { ...user };
      delete updatedUser.requiresPasswordReset;
      updateUser(updatedUser);
      
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Show redirect animation and redirect to dashboard
      setIsRedirecting(true);
      // Start the bar at 0% and fill it on the next frame so the width
      // transition actually animates instead of rendering already-full.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setRedirectBarFilled(true));
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (err) {
      setMessage(err.message || 'שגיאה בשינוי הסיסמה');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4 shadow-card">
            <Shield className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isUsingTempPassword ? 'הגדרת סיסמה חדשה' : 'שינוי סיסמה'}
          </h1>
          <p className="text-gray-600">
            {isUsingTempPassword
              ? 'אנא הגדר סיסמה חדשה וחזקה למשך השימוש במערכת'
              : 'הגדר סיסמה חדשה וחזקה'
            }
          </p>
        </div>

        <Card variant="raised" padding="lg">
          {isUsingTempPassword && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-card">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-600 ml-2" aria-hidden="true" />
                <div>
                  <h3 className="text-blue-800 font-semibold mb-1">הגדרת סיסמה חדשה</h3>
                  <p className="text-blue-700 text-sm">
                    התחברת עם סיסמה זמנית. כדי להמשיך להשתמש במערכת, הגדר סיסמה חדשה וחזקה.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <PasswordInput
                name="currentPassword"
                label={isUsingTempPassword ? "סיסמה זמנית" : "סיסמה נוכחית"}
                autoComplete="current-password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />

              <PasswordInput
                name="newPassword"
                label="סיסמה חדשה"
                autoComplete="new-password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />

              {passwordErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-card p-4">
                  <ul className="text-red-700 text-sm space-y-1">
                    {passwordErrors.map((error, index) => (
                      <li key={index} className="flex items-center">
                        <AlertCircle className="w-4 h-4 ml-2 flex-shrink-0" aria-hidden="true" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <PasswordInput
                name="confirmPassword"
                label="אישור סיסמה חדשה"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={passwordErrors.length > 0}
                leftIcon={!isLoading ? Save : undefined}
              >
                {isLoading ? "משנה סיסמה..." : "שמור סיסמה חדשה"}
              </Button>

              {isUsingTempPassword && (
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={handleLogout}
                  leftIcon={LogOut}
                >
                  חזרה להתחברות
                </Button>
              )}
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">הסיסמה שונתה בהצלחה!</h3>
                <p className="text-gray-600">
                  עכשיו אתה יכול להמשיך להשתמש במערכת עם הסיסמה החדשה שלך.
                </p>
              </div>

              {isRedirecting ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-card p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="ml-3 w-5 h-5 animate-spin text-emerald-600" />
                    <p className="text-emerald-700 text-sm mr-2">מעביר אותך לדף הראשי...</p>
                  </div>
                  <div className="mt-3 bg-emerald-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-[3000ms] ease-in-out"
                      style={{ width: redirectBarFilled ? '100%' : '0%' }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-card p-4">
                  <p className="text-emerald-700 text-sm">
                    הכנה למעבר לדף הראשי...
                  </p>
                </div>
              )}
            </div>
          )}

          {message && !isSuccess && (
            <div className="mt-6">
              <Alert type="error" message={message} onDismiss={() => setMessage('')} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
