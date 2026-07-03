import React, { useState, useEffect } from 'react';
import { apiFetch } from '../hooks/useApi';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  Send,
  Key
} from 'lucide-react';
import Alert from '../components/common/Alert';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.title = 'שכחתי סיסמה - Course4Me';
    
    return () => {
      document.title = 'Course4Me';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const data = await apiFetch(`/api/auth/forgot-password`, {
        method: 'POST',
        body: { email },
        auth: false,
      });

      setMessage(data.message);
      setIsSuccess(true);

    } catch (err) {
      setMessage(err.message || 'שגיאה בשליחת הבקשה');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4 shadow-card">
            <Key className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">שכחתי סיסמה</h1>
          <p className="text-gray-600">נשלח לך סיסמה זמנית למייל</p>
        </div>

        <Card variant="raised" padding="lg">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="כתובת אימייל"
                autoComplete="email"
                leftIcon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" size="lg" fullWidth loading={isLoading} leftIcon={!isLoading ? Send : undefined}>
                {isLoading ? "שולח..." : "שלח סיסמה זמנית"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">הבקשה נשלחה!</h3>
                <p className="text-gray-600">
                  בדוק את תיבת המייל שלך. אם החשבון קיים במערכת, תקבל סיסמה זמנית.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-card p-4">
                <p className="text-emerald-700 text-sm">
                  <strong>שים לב:</strong> הסיסמה הזמנית תפוג תוך 24 שעות. לאחר התחברות, תתבקש לשנות את הסיסמה שלך.
                </p>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-6">
              <Alert type={isSuccess ? "success" : "error"} message={message} onDismiss={() => setMessage("")} />
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors duration-ui"
            >
              <ArrowLeft className="w-4 h-4 ml-1" aria-hidden="true" />
              חזרה להתחברות
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
