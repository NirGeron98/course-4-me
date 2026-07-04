import React from 'react';
import { BarChart3, Eye, Users, Clock, Zap, Award } from 'lucide-react';

const LecturerStatisticsCard = ({ stats }) => {
    // Full literal class names so Tailwind's content scan keeps them in the
    // production build (dynamic `bg-${color}` strings get purged).
    const colors = {
        clarity: { text: 'text-blue-500', bar: 'bg-blue-500' },
        responsiveness: { text: 'text-green-500', bar: 'bg-green-500' },
        availability: { text: 'text-orange-500', bar: 'bg-orange-500' },
        organization: { text: 'text-red-500', bar: 'bg-red-500' },
        knowledge: { text: 'text-yellow-500', bar: 'bg-yellow-500' }
    };

    const renderStat = (Icon, label, value, color) => (
        <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${color.text}`} />
            <div className="flex-1">
                <div className="flex justify-between">
                    <span className="text-gray-600">{label}</span>
                    <span className={`font-bold ${color.text}`}>{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                        className={`${color.bar} h-2 rounded-full`}
                        style={{ width: `${(value / 5) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-card-lg shadow-card p-4 sm:p-6" dir="rtl">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                סטטיסטיקות
            </h3>

            <div className="space-y-4">
                {renderStat(Eye, 'בהירות הוראה', stats.avgClarity, colors.clarity)}
                {renderStat(Users, 'התחשבות בסטודנטים', stats.avgResponsiveness, colors.responsiveness)}
                {renderStat(Clock, 'זמינות', stats.avgAvailability, colors.availability)}
                {renderStat(Zap, 'ארגון השיעור', stats.avgOrganization, colors.organization)}
                {renderStat(Award, 'עומק הידע', stats.avgKnowledge, colors.knowledge)}
            </div>
        </div>
    );
};

export default LecturerStatisticsCard;