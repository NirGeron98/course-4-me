import { useCourseDataWithSync } from '../hooks/useCourseDataWithSync';
import { useReviewsWithSync } from '../hooks/useReviewsWithSync';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, AlertCircle } from 'lucide-react';
import CourseDescription from '../components/course-page/CourseDescription';
import CourseHeader from '../components/course-page/CourseHeader';
import QuickActions from '../components/course-page/CourseQuickActions';
import CourseReviewFormModal from '../components/course-page/CourseReviewFormModal';
import CourseReviewsSection from '../components/course-page/CourseReviewsSection';
import CourseStatisticsCard from '../components/course-page/CourseStatisticsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import PageLayout from '../components/common/PageLayout';

const CoursePage = ({ user }) => {
    const { courseNumber } = useParams();
    const navigate = useNavigate();
    const { course, loading, error, refetch: refetchCourse } = useCourseDataWithSync(courseNumber, user?.token, 'courseNumber');
    const {
        showReviewForm,
        setShowReviewForm,
        stats: reviewStats,
        reviews,
        reviewsLoading,
        refetchReviews
    } = useReviewsWithSync(course?._id || null, user?.token);



    const [editingReview, setEditingReview] = useState(null);

    // Function to refresh all data after review operations
    const refreshAllData = async () => {
        try {
            // Refresh both course data and reviews data
            await Promise.all([
                refetchCourse(),
                refetchReviews()
            ]);
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    };

    const handleShowReviewForm = (existingReview = null) => {
        if (existingReview) {
            setEditingReview(existingReview);
        } else {
            setEditingReview(null);
        }
        setShowReviewForm(true);
    };

    const handleCloseReviewForm = () => {
        setShowReviewForm(false);
        setEditingReview(null);
    };

    const handleReviewSubmitted = async (reviewData) => {
        try {
            // Refresh all data to ensure everything is up to date
            await refreshAllData();
            handleCloseReviewForm();
        } catch (error) {
            console.error('Error after review submission:', error);
            // Still close the form even if refresh fails
            handleCloseReviewForm();
        }
    };

    if (loading || reviewsLoading) {
        return <LoadingSpinner message="טוען מידע על הקורס..." />;
    }


    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">שגיאה בטעינת הקורס</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button onClick={() => navigate(-1)}>
                        חזור אחורה
                    </Button>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">קורס לא נמצא</h1>
                    <p className="text-gray-600 mb-6">הקורס שחיפשת לא קיים במערכת</p>
                    <Button onClick={() => navigate('/')}>
                        חזור לדף הבית
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <PageLayout
            accent="emerald"
            width="max-w-7xl"
            header={<CourseHeader course={course} stats={reviewStats} reviews={reviews} />}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <CourseDescription course={course} />
                    <CourseReviewsSection
                        courseId={course._id}
                        courseTitle={course.title}
                        user={user}
                        onShowReviewForm={handleShowReviewForm}
                        onReviewDeleted={refreshAllData}
                    />
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <CourseStatisticsCard stats={reviewStats} />
                    <QuickActions
                        onShowReviewForm={handleShowReviewForm}
                        courseId={course._id}
                        courseName={course.title}
                        user={user}
                        onDataChanged={refreshAllData}
                    />
                </div>
            </div>

            {showReviewForm && (
                <CourseReviewFormModal
                    courseId={course._id}
                    courseTitle={course.title}
                    user={user}
                    existingReview={editingReview}
                    onClose={handleCloseReviewForm}
                    onReviewSubmitted={handleReviewSubmitted}
                />
            )}
        </PageLayout>
    );
};

export default CoursePage;