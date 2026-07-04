import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Plus, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../../hooks/useApi';
import ReviewFormModal from './CourseReviewFormModal';
import ExistingReviewModal from '../common/ExistingReviewModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import ReviewCard, { getDisplayName } from '../common/ReviewCard';
import ReviewFilterBar from '../common/ReviewFilterBar';

const RATING_FIELDS = [
    { key: 'interest', label: 'עניין', textClass: 'text-red-600' },
    { key: 'difficulty', label: 'קושי', textClass: 'text-yellow-600' },
    { key: 'workload', label: 'השקעה', textClass: 'text-orange-600' },
    { key: 'teachingQuality', label: 'איכות הוראה', textClass: 'text-purple-600' },
    { key: 'recommendation', label: 'המלצה', textClass: 'text-emerald-600' },
];

const CourseReviewsSection = ({ courseId, courseTitle, user, onShowReviewForm, onReviewDeleted }) => {
    const [reviews, setReviews] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [filterLecturer, setFilterLecturer] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [showExistingReviewModal, setShowExistingReviewModal] = useState(false);
    const [userExistingReview, setUserExistingReview] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const isAdmin = user?.user?.role === 'admin';

    const fetchData = useCallback(async () => {
        try {
            let lecturersList = [];
            try {
                const courseData = await apiFetch(`/api/courses/${courseId}`, {
                    token: user.token,
                });
                lecturersList = courseData.lecturers || [];
                setLecturers(lecturersList);
            } catch {
                // Course fetch failing only degrades the lecturer filter;
                // still try to load the reviews themselves.
            }

            const reviewsData = await apiFetch(`/api/reviews/course/${courseId}`, {
                token: user.token,
            });

            const lecturerMap = {};
            lecturersList.forEach((lecturer) => {
                lecturerMap[lecturer._id] = lecturer;
            });

            const enrichedReviews = reviewsData.map((review) => ({
                ...review,
                lecturer: typeof review.lecturer === 'string'
                    ? lecturerMap[review.lecturer] || { name: 'מרצה לא ידוע' }
                    : review.lecturer
            }));

            setReviews(enrichedReviews);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [courseId, user.token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const checkForExistingReview = () => {
        if (!user?.user) return null;

        return reviews.find(review =>
            review.user && review.user._id === user.user._id
        );
    };

    const handleWriteReviewClick = () => {
        if (!user) {
            toast.error('יש להתחבר כדי לכתוב ביקורת');
            return;
        }

        const existingReview = checkForExistingReview();

        if (existingReview) {
            setUserExistingReview(existingReview);
            setShowExistingReviewModal(true);
        } else {
            setShowReviewForm(true);
        }
    };

    const handleEditExistingReview = () => {
        setShowExistingReviewModal(false);
        setEditingReview(userExistingReview);
        setShowReviewForm(true);
    };

    const handleCancelExistingReview = () => {
        setShowExistingReviewModal(false);
        setUserExistingReview(null);
    };

    const getFilteredReviews = () => {
        let filtered = [...reviews];

        if (filterLecturer !== 'all') {
            filtered = filtered.filter(review => review.lecturer && review.lecturer._id === filterLecturer);
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'highest':
                    return (b.recommendation || 0) - (a.recommendation || 0);
                case 'lowest':
                    return (a.recommendation || 0) - (b.recommendation || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const handleDeleteClick = (review) => {
        setReviewToDelete(review);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!reviewToDelete) return;

        try {
            await apiFetch(`/api/reviews/${reviewToDelete._id}`, {
                method: 'DELETE',
                token: user.token,
            });

            setReviews(prev => prev.filter(r => r._id !== reviewToDelete._id));
            setShowDeleteModal(false);
            setReviewToDelete(null);
            toast.success('הביקורת נמחקה בהצלחה');

            // Call the callback to refresh all data in parent component
            if (onReviewDeleted) {
                onReviewDeleted();
            }
        } catch (error) {
            toast.error(error.message || 'שגיאה במחיקת הביקורת');
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setReviewToDelete(null);
    };

    const handleReviewSubmitted = (newReview) => {
        fetchData();
        setEditingReview(null);
        setShowReviewForm(false);

        // Call the callback to refresh all data in parent component
        if (onReviewDeleted) {
            onReviewDeleted();
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setShowReviewForm(true);
    };

    const canEditReview = (review) => {
        return review.user && user?.user && review.user._id === user.user._id;
    };

    const canDeleteReview = (review) => {
        return isAdmin || canEditReview(review);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-card-lg shadow-card p-6">
                <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 text-brand animate-spin mx-auto mb-4" />
                    <p className="text-muted">טוען ביקורות...</p>
                </div>
            </div>
        );
    }

    const filteredReviews = getFilteredReviews();

    return (
        <>
            <div className="bg-white rounded-card-lg shadow-card p-6" dir="rtl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-brand" aria-hidden="true" />
                        ביקורות סטודנטים ({reviews.length})
                        {isAdmin && (
                            <span className="text-xs bg-danger-soft text-danger px-2 py-1 rounded-full flex items-center gap-1">
                                <Shield className="w-3 h-3" aria-hidden="true" />
                                אדמין
                            </span>
                        )}
                    </h2>

                    <Button onClick={handleWriteReviewClick} leftIcon={Plus} aria-label="כתוב ביקורת">
                        <span className="hidden sm:inline">כתוב ביקורת</span>
                    </Button>
                </div>

                {reviews.length > 0 && (
                    <ReviewFilterBar
                        filterValue={filterLecturer}
                        onFilterChange={setFilterLecturer}
                        filterAriaLabel="סינון לפי מרצה"
                        filterOptions={[
                            { value: 'all', label: 'כל המרצים' },
                            ...lecturers.map((lecturer) => ({
                                value: lecturer._id,
                                label: lecturer?.name || 'מרצה לא ידוע',
                            })),
                        ]}
                        sortValue={sortBy}
                        onSortChange={setSortBy}
                        sortOptions={[
                            { value: 'newest', label: 'הכי חדש' },
                            { value: 'oldest', label: 'הכי ישן' },
                            { value: 'highest', label: 'המלצה גבוהה' },
                            { value: 'lowest', label: 'המלצה נמוכה' },
                        ]}
                    />
                )}

                {filteredReviews.length === 0 ? (
                    <EmptyState
                        icon={MessageCircle}
                        title={filterLecturer !== 'all' ? 'אין ביקורות למרצה זה' : 'אין ביקורות עדיין'}
                        description={
                            filterLecturer !== 'all'
                                ? 'נסה לבחור מרצה אחר או לכתוב ביקורת ראשונה'
                                : 'היה הראשון לכתוב ביקורת על הקורס'
                        }
                        actionLabel="כתוב ביקורת ראשונה"
                        onAction={handleWriteReviewClick}
                    />
                ) : (
                    <div className="space-y-4">
                        {filteredReviews.map((review) => (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                accent="course"
                                contextLabel={review.lecturer?.name || 'מרצה לא ידוע'}
                                overallRating={parseFloat(review.recommendation || 0)}
                                ratings={RATING_FIELDS.map(({ key, label, textClass }) => ({
                                    label,
                                    value: review[key] || 0,
                                    textClass,
                                }))}
                                canEdit={canEditReview(review)}
                                canDelete={canDeleteReview(review)}
                                onEdit={() => handleEditReview(review)}
                                onDelete={() => handleDeleteClick(review)}
                                deleteTitle={isAdmin && !canEditReview(review) ? 'מחק ביקורת (אדמין)' : 'מחק ביקורת'}
                            />
                        ))}
                    </div>
                )}

                {showReviewForm && (
                    <ReviewFormModal
                        courseId={courseId}
                        courseTitle={courseTitle}
                        user={user}
                        existingReview={editingReview}
                        onClose={() => {
                            setShowReviewForm(false);
                            setEditingReview(null);
                        }}
                        onReviewSubmitted={handleReviewSubmitted}
                    />
                )}
            </div>

            {showExistingReviewModal && userExistingReview && (
                <ExistingReviewModal
                    onEdit={handleEditExistingReview}
                    onCancel={handleCancelExistingReview}
                    existingReview={userExistingReview}
                />
            )}

            {showDeleteModal && reviewToDelete && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    title="מחיקת ביקורת"
                    message={
                        isAdmin && !canEditReview(reviewToDelete)
                            ? `האם אתה בטוח שברצונך למחוק את הביקורת של ${getDisplayName(reviewToDelete)}? פעולה זו אינה ניתנת לביטול.`
                            : "האם אתה בטוח שברצונך למחוק את הביקורת? פעולה זו אינה ניתנת לביטול."
                    }
                />
            )}
        </>
    );
};

export default CourseReviewsSection;
