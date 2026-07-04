import React, { useState, useEffect } from 'react';
import { apiFetch } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Save,
  Loader2,
  Shield,
  LogOut
} from 'lucide-react';
import Alert from '../components/common/Alert';
import AuthLayout from '../components/common/AuthLayout';
import PasswordInput from '../components/common/PasswordInput';
import PasswordRules, { passwordSatisfiesRules } from '../components/common/PasswordRules';
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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectBarFilled, setRedirectBarFilled] = useState(false);

  // Check if user is using temporary password
  const isUsingTempPassword = user?.requiresPasswordReset || localStorage.getItem("requiresPasswordReset") === "true";

  const newPasswordValid = passwordSatisfiesRules(formData.newPassword);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Reset messages when user types
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // The live PasswordRules checklist shows what is missing.
    if (!newPasswordValid) {
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
    <AuthLayout
      icon={Shield}
      title={isUsingTempPassword ? 'הגדרת סיסמה חדשה' : 'שינוי סיסמה'}
      subtitle={isUsingTempPassword
        ? 'אנא הגדר סיסמה חדשה וחזקה למשך השימוש במערכת'
        : 'הגדר סיסמה חדשה וחזקה'}
    >
          {isUsingTempPassword && (
            <div className="mb-6 p-4 bg-accent-info-tint border border-accent-info-soft rounded-card">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-accent-info ml-2" aria-hidden="true" />
                <div>
                  <h3 className="text-accent-info-strong font-semibold mb-1">הגדרת סיסמה חדשה</h3>
                  <p className="text-accent-info-strong text-sm">
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

              <PasswordRules password={formData.newPassword} />

              <PasswordInput
                name="confirmPassword"
                label="אישור סיסמה חדשה"
                autoComplete="new-password"
                error={
                  formData.confirmPassword.length > 0 &&
                  formData.confirmPassword !== formData.newPassword
                    ? 'הסיסמאות החדשות אינן זהות'
                    : undefined
                }
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={formData.newPassword.length > 0 && !newPasswordValid}
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-soft rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-brand" />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">הסיסמה שונתה בהצלחה!</h3>
                <p className="text-muted">
                  עכשיו אתה יכול להמשיך להשתמש במערכת עם הסיסמה החדשה שלך.
                </p>
              </div>

              {isRedirecting ? (
                <div className="bg-brand-tint border border-brand-soft rounded-card p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="ml-3 w-5 h-5 animate-spin text-brand" />
                    <p className="text-brand-strong text-sm mr-2">מעביר אותך לדף הראשי...</p>
                  </div>
                  <div className="mt-3 bg-brand-soft rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand h-full rounded-full transition-all duration-[3000ms] ease-in-out"
                      style={{ width: redirectBarFilled ? '100%' : '0%' }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-tint border border-brand-soft rounded-card p-4">
                  <p className="text-brand-strong text-sm">
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
    </AuthLayout>
  );
};

export default ResetPassword;
