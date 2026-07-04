import React from 'react';
import { BarChart3, Heart, Brain, Clock, Award, ThumbsUp } from 'lucide-react';

const CourseStatisticsCard = ({ stats }) => {
    // Full literal class names so Tailwind's content scan keeps them in the
    // production build (dynamic `bg-${color}` strings get purged).
    const colors = {
        interest: { text: 'text-red-500', bar: 'bg-red-500' },
        difficulty: { text: 'text-yellow-500', bar: 'bg-yellow-500' },
        workload: { text: 'text-orange-500', bar: 'bg-orange-500' },
        teachingQuality: { text: 'text-purple-500', bar: 'bg-purple-500' },
        recommendation: { text: 'text-emerald-500', bar: 'bg-emerald-500' }
    };

    const renderStat = (Icon, label, value, color) => {
        if (value == null || isNaN(value)) return null;

        return (
            <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${color.text}`} />
                <div className="flex-1">
                    <div className="flex justify-between">
                        <span className="text-gray-600">{label}</span>
                        <span className={`font-bold ${color.text}`}>{parseFloat(value).toFixed(1)}/5.0</span>
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
    };

    if (!stats || Object.values(stats).every(val => val == null)) {
        return (
            <div className="bg-white rounded-card-lg shadow-card p-4 sm:p-6" dir="rtl">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    סטטיסטיקות
                </h3>
                <div className="text-center py-8 text-gray-500">
                    אין מספיק ביקורות להצגת סטטיסטיקות
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-card-lg shadow-card p-4 sm:p-6" dir="rtl">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                סטטיסטיקות ({stats.total} ביקורות)
            </h3>

            <div className="space-y-4">
                {renderStat(Heart, 'עניין', stats.avgInterest, colors.interest)}
                {renderStat(Brain, 'קושי', stats.avgDifficulty, colors.difficulty)}
                {renderStat(Clock, 'השקעה', stats.avgWorkload, colors.workload)}
                {renderStat(Award, 'איכות הוראה', stats.avgTeachingQuality, colors.teachingQuality)}
                {renderStat(ThumbsUp, 'המלצה', stats.avgRecommendation, colors.recommendation)}
            </div>
        </div>
    );
};

export default CourseStatisticsCard;