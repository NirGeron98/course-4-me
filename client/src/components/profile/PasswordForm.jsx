import React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import MessageAlert from './MessageAlert';
import Button from '../common/Button';
import Input from '../common/Input';

// One eye-toggle button, reused for all three password fields. Rendered
// through Input's rightElement slot so it stays clickable inside the field.
const VisibilityToggle = ({ visible, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={visible ? 'הסתר סיסמה' : 'הצג סיסמה'}
    className="p-1 text-slate-400 hover:text-slate-600 rounded-button transition-colors duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
  >
    {visible ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
  </button>
);

const PasswordForm = ({
  passwords,
  setPasswords,
  showPasswords,
  togglePasswordVisibility,
  handlePasswordUpdate,
  loading,
  messages
}) => {
  return (
    <div className="bg-white rounded-card-lg shadow-card p-8 border border-emerald-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <Lock className="w-6 h-6 text-brand" aria-hidden="true" />
        שינוי סיסמה
      </h2>

      <MessageAlert message={messages.password} />

      <form onSubmit={handlePasswordUpdate} className="space-y-6">
        <Input
          label="סיסמה נוכחית"
          leftIcon={Lock}
          type={showPasswords.current ? "text" : "password"}
          value={passwords.currentPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
          placeholder="הכנס סיסמה נוכחית"
          rightElement={
            <VisibilityToggle
              visible={showPasswords.current}
              onToggle={() => togglePasswordVisibility('current')}
            />
          }
        />

        <Input
          label="סיסמה חדשה"
          leftIcon={Lock}
          type={showPasswords.new ? "text" : "password"}
          value={passwords.newPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
          placeholder="הכנס סיסמה חדשה (לפחות 6 תווים)"
          rightElement={
            <VisibilityToggle
              visible={showPasswords.new}
              onToggle={() => togglePasswordVisibility('new')}
            />
          }
        />

        <Input
          label="אישור סיסמה חדשה"
          leftIcon={Lock}
          type={showPasswords.confirm ? "text" : "password"}
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
          placeholder="הכנס שוב את הסיסמה החדשה"
          rightElement={
            <VisibilityToggle
              visible={showPasswords.confirm}
              onToggle={() => togglePasswordVisibility('confirm')}
            />
          }
        />

        <div className="bg-accent-info-tint border border-accent-info-soft rounded-card p-4">
          <h4 className="text-sm font-medium text-accent-info-strong mb-2">דרישות סיסמה:</h4>
          <ul className="text-sm text-accent-info-strong space-y-1">
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${passwords.newPassword.length >= 6 ? 'bg-brand' : 'bg-slate-300'}`} aria-hidden="true"></div>
              לפחות 6 תווים
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${passwords.newPassword === passwords.confirmPassword && passwords.newPassword ? 'bg-brand' : 'bg-slate-300'}`} aria-hidden="true"></div>
              הסיסמאות תואמות
            </li>
          </ul>
        </div>

        <Button
          type="submit"
          fullWidth
          leftIcon={Lock}
          loading={loading.updatePassword}
          disabled={
            loading.updatePassword ||
            !passwords.currentPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword ||
            passwords.newPassword !== passwords.confirmPassword ||
            passwords.newPassword.length < 6
          }
        >
          {loading.updatePassword ? "מעדכן סיסמה..." : "עדכן סיסמה"}
        </Button>
      </form>
    </div>
  );
};

export default PasswordForm;
