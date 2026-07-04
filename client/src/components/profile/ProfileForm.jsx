import React from 'react';
import { User, Mail, Shield, Calendar, Save, Edit3 } from 'lucide-react';
import MessageAlert from './MessageAlert';
import Button from '../common/Button';
import Input from '../common/Input';

const ProfileForm = ({
  userProfile,
  editedProfile,
  setEditedProfile,
  isEditing,
  setIsEditing,
  handleProfileUpdate,
  loading,
  messages,
  formatDate
}) => {
  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(userProfile);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white rounded-card-lg shadow-card p-8 border border-emerald-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <User className="w-6 h-6 text-brand" aria-hidden="true" />
          פרטים אישיים
        </h2>
        <button
          type="button"
          onClick={handleEditToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-card font-medium transition-all duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
            isEditing
              ? 'bg-slate-500 hover:bg-slate-600 text-white'
              : 'bg-brand-tint hover:bg-emerald-200 text-brand-strong'
          }`}
        >
          <Edit3 className="w-4 h-4" aria-hidden="true" />
          {isEditing ? 'ביטול' : 'עריכה'}
        </button>
      </div>

      <MessageAlert message={messages.profile} />

      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <Input
          label="שם מלא"
          leftIcon={User}
          type="text"
          value={isEditing ? editedProfile.fullName || "" : userProfile.fullName}
          onChange={(e) => setEditedProfile(prev => ({ ...prev, fullName: e.target.value }))}
          disabled={!isEditing}
          placeholder="הכנס שם מלא"
        />

        <Input
          label="כתובת אימייל"
          leftIcon={Mail}
          type="email"
          value={isEditing ? editedProfile.email || "" : userProfile.email}
          onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
          disabled={!isEditing}
          placeholder="הכנס כתובת אימייל"
        />

        <Input
          label="מוסד אקדמי"
          type="text"
          value={isEditing ? editedProfile.academicInstitution || "" : userProfile.academicInstitution || "מכללת אפקה"}
          onChange={(e) => setEditedProfile(prev => ({ ...prev, academicInstitution: e.target.value }))}
          disabled={!isEditing}
          placeholder="הכנס מוסד אקדמי"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1.5">
              תפקיד
            </span>
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-sunken border border-slate-200 rounded-card">
              {userProfile.role === 'admin' ? (
                <>
                  <Shield className="w-5 h-5 text-accent-lecturer" aria-hidden="true" />
                  <span className="text-accent-lecturer-strong font-medium">מנהל מערכת</span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5 text-brand" aria-hidden="true" />
                  <span className="text-brand-strong font-medium">משתמש</span>
                </>
              )}
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1.5">
              תאריך הצטרפות
            </span>
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-sunken border border-slate-200 rounded-card">
              <Calendar className="w-5 h-5 text-slate-400" aria-hidden="true" />
              <span className="text-slate-700">
                {userProfile.createdAt ? formatDate(userProfile.createdAt) : "לא זמין"}
              </span>
            </div>
          </div>
        </div>

        {isEditing && (
          <Button
            type="submit"
            fullWidth
            loading={loading.updateProfile}
            leftIcon={Save}
          >
            {loading.updateProfile ? "שומר..." : "שמור שינויים"}
          </Button>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
