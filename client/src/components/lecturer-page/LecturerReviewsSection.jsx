import React, { useState } from 'react';
import { MessageCircle, Plus, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../../hooks/useApi';
import ExistingReviewModal from '../common/ExistingReviewModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import EmptyState from '../common/EmptyState';
import ReviewCard, { getDisplayName } from '../common/ReviewCard';
import ReviewFilterBar from '../common/ReviewFilterBar';

const RATING_FIELDS = [
    { key: 'clarity', label: 'בהירות הוראה', textClass: 'text-blue-600' },
    { key: 'responsiveness', label: 'התחשבות', textClass: 'text-green-600' },
    { key: 'availability', label: 'זמינות', textClass: 'text-orange-600' },
    { key: 'organization', label: 'ארגון השיעור', textClass: 'text-red-600' },
    { key: 'knowledge', label: 'עומק הידע', textClass: 'text-yellow-600' },
];

const LecturerReviewsSection = ({
    reviews,
    courses,
    filterCourse,
    setFilterCourse,
    sortBy,
    setSortBy,
    filteredReviews,
    reviewsLoading,
    onWriteReview,
    onEditReview,
    user,
    lecturerId,
    onReviewDeleted
}) => {
    const [showExistingReviewModal, setShowExistingReviewModal] = useState(false);
    const [userExistingReview, setUserExistingReview] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const isAdmin = user?.user?.role === 'admin';

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
            onWriteReview();
        }
    };

    const handleEditExistingReview = () => {
        setShowExistingReviewModal(false);
        onEditReview(userExistingReview);
    };

    const handleCancelExistingReview = () => {
        setShowExistingReviewModal(false);
        setUserExistingReview(null);
    };

    const handleDeleteClick = (review) => {
        setReviewToDelete(review);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!reviewToDelete) return;

        try {
            await apiFetch(`/api/lecturer-reviews/${reviewToDelete._id}`, {
                method: 'DELETE',
                token: user.token,
            });

            toast.success('הביקורת נמחקה בהצלחה');

            if (onReviewDeleted) {
                onReviewDeleted(reviewToDelete._id);
            } else {
                window.location.reload(); // fallback
            }

            setShowDeleteModal(false);
            setReviewToDelete(null);
        } catch (error) {
            toast.error(error.message || 'שגיאה במחיקת הביקורת');
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setReviewToDelete(null);
    };

    const canEditReview = (review) => {
        return review.user && user?.user && review.user._id === user.user._id;
    };

    const canDeleteReview = (review) => {
        return isAdmin || canEditReview(review);
    };

    if (reviewsLoading) {
        return (
            <div className="bg-white rounded-card-lg shadow-card p-6">
                <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 text-accent-lecturer animate-spin mx-auto mb-4" />
                    <p className="text-muted">טוען ביקורות...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-card-lg shadow-card p-6" dir="rtl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-accent-lecturer" aria-hidden="true" />
                        ביקורות סטודנטים ({reviews.length})
                        {isAdmin && (
                            <span className="text-xs bg-danger-soft text-danger px-2 py-1 rounded-full flex items-center gap-1">
                                <Shield className="w-3 h-3" aria-hidden="true" />
                                אדמין
                            </span>
                        )}
                    </h2>

                    {user && (
                        <button
                            onClick={handleWriteReviewClick}
                            className="bg-accent-lecturer hover:bg-accent-lecturer-strong text-white px-4 py-2 rounded-card flex items-center gap-2 transition-colors duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-lecturer"
                            aria-label="כתוב ביקורת"
                        >
                            <Plus className="w-4 h-4" aria-hidden="true" />
                            <span className="hidden sm:inline">כתוב ביקורת</span>
                        </button>
                    )}
                </div>

                {/* Filters and Sort */}
                {reviews.length > 0 && (
                    <ReviewFilterBar
                        filterValue={filterCourse}
                        onFilterChange={setFilterCourse}
                        filterAriaLabel="סינון לפי קורס"
                        filterOptions={[
                            { value: 'all', label: 'כל הקורסים' },
                            ...courses.map((course) => ({
                                value: course._id,
                                label: `${course.title} (${course.courseNumber})`,
                            })),
                        ]}
                        sortValue={sortBy}
                        onSortChange={setSortBy}
                        sortOptions={[
                            { value: 'newest', label: 'הכי חדש' },
                            { value: 'oldest', label: 'הכי ישן' },
                            { value: 'highest', label: 'ציון גבוה' },
                            { value: 'lowest', label: 'ציון נמוך' },
                        ]}
                    />
                )}

                {/* Reviews List */}
                {filteredReviews.length === 0 ? (
                    <EmptyState
                        icon={MessageCircle}
                        title={filterCourse !== 'all' ? 'אין ביקורות לקורס זה' : 'אין ביקורות עדיין'}
                        description={
                            filterCourse !== 'all'
                                ? 'נסה לבחור קורס אחר או לכתוב ביקורת ראשונה'
                                : 'היה הראשון לכתוב ביקורת על המרצה'
                        }
                        actionLabel={user ? 'כתוב ביקורת ראשונה' : undefined}
                        onAction={user ? handleWriteReviewClick : undefined}
                    />
                ) : (
                    <div className="space-y-4">
                        {filteredReviews.map((review) => {
                            const overallRating = review.overallRating ||
                                ((review.clarity + review.responsiveness + review.availability + review.organization + review.knowledge) / 5);

                            return (
                                <ReviewCard
                                    key={review._id}
                                    review={review}
                                    accent="lecturer"
                                    contextLabel={review.course?.title || 'קורס לא ידוע'}
                                    overallRating={parseFloat(overallRating) || 0}
                                    ratings={RATING_FIELDS.map(({ key, label, textClass }) => ({
                                        label,
                                        value: review[key] || 0,
                                        textClass,
                                    }))}
                                    canEdit={canEditReview(review)}
                                    canDelete={canDeleteReview(review)}
                                    onEdit={() => onEditReview(review)}
                                    onDelete={() => handleDeleteClick(review)}
                                    deleteTitle={isAdmin && !canEditReview(review) ? 'מחק ביקורת (אדמין)' : 'מחק ביקורת'}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Existing Review Modal */}
            {showExistingReviewModal && userExistingReview && (
                <ExistingReviewModal
                    existingReview={userExistingReview}
                    onEdit={handleEditExistingReview}
                    onCancel={handleCancelExistingReview}
                    reviewType="lecturer"
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && reviewToDelete && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    title="מחיקת ביקורת מרצה"
                    message={
                        isAdmin && !canEditReview(reviewToDelete)
                            ? `האם אתה בטוח שברצונך למחוק את הביקורת של ${getDisplayName(reviewToDelete)} על הקורס ${reviewToDelete.course?.title || 'לא ידוע'}? פעולה זו אינה ניתנת לביטול.`
                            : "האם אתה בטוח שברצונך למחוק את הביקורת? פעולה זו אינה ניתנת לביטול."
                    }
                />
            )}
        </>
    );
};

export default LecturerReviewsSection;
