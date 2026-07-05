import React from 'react';
import { User, Shield } from 'lucide-react';
import PageHero from '../common/PageHero';

const ProfileHeader = ({ userProfile }) => {
  const isAdmin = userProfile.role === 'admin';

  return (
    <PageHero
      icon={isAdmin ? Shield : User}
      title="ניהול פרופיל"
      subtitle={`ברוך הבא, ${userProfile.fullName}`}
      badge={
        isAdmin ? (
          <span className="inline-flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            מנהל מערכת
          </span>
        ) : null
      }
    />
  );
};

export default ProfileHeader;
