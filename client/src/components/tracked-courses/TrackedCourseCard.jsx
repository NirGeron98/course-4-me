import React, { useState, useEffect } from 'react';
import { BookOpen, Building, User, ThumbsUp } from 'lucide-react';
import { useCourseDataContext } from '../../contexts/CourseDataContext';
import TrackedEntityCard, { TrackedCardStars } from '../common/TrackedEntityCard';

const TrackedCourseCard = ({ course, onRemove }) => {
    const [displayCourse, setDisplayCourse] = useState(course);
    const [recommendationRating, setRecommendationRating] = useState(null);
    const [reviewsCount, setReviewsCount] = useState(0);
    const { getCourseData, getRefreshTrigger, fetchCourseStats } = useCourseDataContext();
    const refreshTrigger = getRefreshTrigger(course._id);

    // Update display course when cached data changes
    useEffect(() => {
        const cachedData = getCourseData(course._id);
        if (cachedData) {
            setDisplayCourse(prev => ({
                ...prev,
                ...cachedData,
            }));

            if (cachedData.stats && cachedData.stats.avgRecommendation !== undefined) {
                setRecommendationRating(cachedData.stats.avgRecommendation);
                setReviewsCount(cachedData.stats.total || 0);
            } else {
                setRecommendationRating(cachedData.averageRating ? parseFloat(cachedData.averageRating) : null);
                setReviewsCount(cachedData.ratingsCount || 0);
            }
        }
    }, [course._id, getCourseData, refreshTrigger]);

    // Fetch stats if not available in cache
    useEffect(() => {
        const cachedData = getCourseData(course._id);
        const hasStats = cachedData && cachedData.stats && cachedData.stats.avgRecommendation !== undefined;

        if (!hasStats) {
            const token = localStorage.getItem('token');
            if (token) {
                fetchCourseStats(course._id, token);
            }
        }
    }, [course._id, getCourseData, fetchCourseStats]);

    const getLecturerName = (lecturers) => {
        if (!Array.isArray(lecturers) || lecturers.length === 0) return "מרצה לא מזוהה";
        const first = lecturers[0];
        if (typeof first === "object" && first.name) return first.name;
        return "מרצה לא מזוהה";
    };

    return (
        <TrackedEntityCard
            to={`/course/${displayCourse.courseNumber}`}
            accent="course"
            icon={BookOpen}
            title={displayCourse.title}
            removeLabel="הסר מעקב"
            onRemove={() => onRemove(displayCourse._id)}
            footerNote={displayCourse.academicInstitution || 'מכללת אפקה'}
            meta={
                <>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                        <span className="bg-brand-tint text-brand-strong px-2 py-1 rounded text-xs font-medium">
                            {displayCourse.courseNumber}
                        </span>
                        <span>{displayCourse.credits} נק"ז</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User className="w-4 h-4" aria-hidden="true" />
                        <span className="truncate">{getLecturerName(displayCourse.lecturers)}</span>
                    </div>
                    {displayCourse.department && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                            <Building className="w-4 h-4" aria-hidden="true" />
                            <span className="truncate">{displayCourse.department}</span>
                        </div>
                    )}
                </>
            }
        >
            {/* Recommendation Rating */}
            {recommendationRating && reviewsCount > 0 ? (
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-card p-4 mb-4 border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <ThumbsUp className="w-4 h-4 text-brand" aria-hidden="true" />
                            <span className="text-sm font-medium text-slate-700">דירוג המלצה</span>
                        </div>
                        <span className="text-lg font-bold text-brand">
                            {recommendationRating ? recommendationRating.toFixed(1) : '0.0'}/5.0
                        </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <TrackedCardStars rating={recommendationRating} />
                        <span className="text-xs text-slate-600">
                            {reviewsCount} ביקורות
                        </span>
                    </div>
                    <div className="text-xs text-muted bg-emerald-50 rounded px-2 py-1 mt-2">
                        מבוסס על קריטריון ההמלצה של הסטודנטים
                    </div>
                </div>
            ) : (
                <div className="bg-surface-sunken rounded-card p-4 mb-4 text-center border border-slate-200">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <ThumbsUp className="w-4 h-4 text-slate-400" aria-hidden="true" />
                        <span className="text-sm text-muted">עדיין אין ביקורות</span>
                    </div>
                    <span className="text-xs text-slate-400">היה הראשון לדרג את הקורס</span>
                </div>
            )}

            {/* Course Description */}
            {displayCourse.description && (
                <div className="mb-4">
                    <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                        {displayCourse.description.length > 100
                            ? displayCourse.description.substring(0, 100) + "..."
                            : displayCourse.description}
                    </p>
                </div>
            )}
        </TrackedEntityCard>
    );
};

export default TrackedCourseCard;
