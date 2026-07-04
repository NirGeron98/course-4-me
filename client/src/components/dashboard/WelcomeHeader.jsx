import React from 'react';
import { User } from 'lucide-react';

const WelcomeHeader = ({ userName }) => {
  return (
    <div className="bg-gradient-to-l from-emerald-600 via-emerald-600 to-emerald-700 text-white py-8 sm:py-10 px-4 sm:px-6 shadow-card-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-white/20 rounded-full p-3 sm:p-4 shrink-0">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">שלום, {userName}! 👋</h1>
              <p className="text-emerald-100 text-sm sm:text-base">איזה כיף שחזרת!</p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 rounded-card-lg p-3 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-lg font-bold">{new Date().toLocaleDateString('he-IL')}</div>
                <div className="text-emerald-200 text-xs">היום</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;