import React from 'react';
import { User } from 'lucide-react';
import PageHero from '../common/PageHero';

const WelcomeHeader = ({ userName }) => {
  const today = (
    <div className="bg-white/10 rounded-card-lg p-3 backdrop-blur-sm">
      <div className="text-center">
        <div className="text-lg font-bold">{new Date().toLocaleDateString('he-IL')}</div>
        <div className="text-white/70 text-xs">היום</div>
      </div>
    </div>
  );

  return (
    <PageHero
      icon={User}
      title={`שלום, ${userName}! 👋`}
      subtitle="איזה כיף שחזרת!"
      aside={today}
    />
  );
};

export default WelcomeHeader;
