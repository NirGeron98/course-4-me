import React, { useEffect, useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import ReviewFilters from "../components/my-reviews/ReviewFilters";
import ReviewsList from "../components/my-reviews/ReviewsList";
import ReviewEditModal from "../components/my-reviews/ReviewEditModal";
import DeleteConfirmationModal from "../components/common/DeleteConfirmationModal";
import { SkeletonReviewList } from "../components/common/Skeleton";
import Alert from "../components/common/Alert";
import PageLayout from "../components/common/PageLayout";
import PageHero from "../components/common/PageHero";
import { useMyReviews } from "../hooks/useMyReviews";

const DEFAULT_FILTERS = {
  searchTerm: "",
  lecturer: "",
  course: "",
  courseNumber: "",
  department: "",
  startDate: "",
  endDate: "",
  minRating: "",
  maxRating: "",
  isAnonymous: "all",
  reviewType: "all",
};

// Computes the effective rating value to use for numeric filtering/sorting,
// falling back across the multiple shapes the review resources can return.
const resolveReviewRating = (review) => {
  if (review.reviewType === "course") {
    return (
      review.recommendation ||
      review.overallRating ||
      (review.interest + review.difficulty + review.workload + review.teachingQuality) / 4
    );
  }
  return (
    review.overallRating ||
    (review.clarity + review.responsiveness + review.availability + review.organization + review.knowledge) / 5
  );
};

const MyReviewsPage = ({ user }) => {
  const userId = user?.user?._id || null;

  const {
    reviews,
    loading,
    error,
    deleteReview,
    replaceReview,
  } = useMyReviews(userId);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("newest");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    document.title = "הביקורות שלי - Course4Me";
    return () => {
      document.title = "Course4Me";
    };
  }, []);

  // Unique filter dropdown values — derived from the current reviews collection.
  const { uniqueLecturers, uniqueCourses, uniqueDepartments } = useMemo(() => {
    return {
      uniqueLecturers: [
        ...new Set(reviews.map((r) => r.lecturer?.name).filter(Boolean)),
      ],
      uniqueCourses: [
        ...new Set(reviews.map((r) => r.course?.title).filter(Boolean)),
      ],
      uniqueDepartments: [
        ...new Set(reviews.map((r) => r.course?.department).filter(Boolean)),
      ],
    };
  }, [reviews]);

  // Fully derived filtered + sorted collection. No local state, no effects.
  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      list = list.filter(
        (review) =>
          review.course?.title?.toLowerCase().includes(q) ||
          review.course?.courseNumber?.toLowerCase().includes(q) ||
          review.lecturer?.name?.toLowerCase().includes(q) ||
          review.course?.department?.toLowerCase().includes(q) ||
          review.comment?.toLowerCase().includes(q)
      );
    }
    if (filters.lecturer) {
      list = list.filter((r) => r.lecturer?.name === filters.lecturer);
    }
    if (filters.course) {
      list = list.filter((r) => r.course?.title === filters.course);
    }
    if (filters.courseNumber) {
      list = list.filter((r) =>
        r.course?.courseNumber?.includes(filters.courseNumber)
      );
    }
    if (filters.department) {
      list = list.filter((r) => r.course?.department === filters.department);
    }
    if (filters.startDate) {
      list = list.filter(
        (r) => new Date(r.createdAt) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      list = list.filter(
        (r) => new Date(r.createdAt) <= new Date(filters.endDate)
      );
    }
    if (filters.minRating) {
      list = list.filter(
        (r) => resolveReviewRating(r) >= parseInt(filters.minRating, 10)
      );
    }
    if (filters.maxRating) {
      list = list.filter(
        (r) => resolveReviewRating(r) <= parseInt(filters.maxRating, 10)
      );
    }
    if (filters.reviewType !== "all") {
      list = list.filter((r) => r.reviewType === filters.reviewType);
    }
    if (filters.isAnonymous !== "all") {
      const isAnonymous = filters.isAnonymous === "true";
      list = list.filter((r) => Boolean(r.isAnonymous) === isAnonymous);
    }

    list.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "newest":
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        case "oldest":
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case "course":
          comparison = (a.course?.title || "").localeCompare(b.course?.title || "");
          break;
        case "lecturer":
          comparison = (a.lecturer?.name || "").localeCompare(b.lecturer?.name || "");
          break;
        case "rating":
          comparison = resolveReviewRating(b) - resolveReviewRating(a);
          break;
        case "department":
          comparison = (a.course?.department || "").localeCompare(
            b.course?.department || ""
          );
          break;
        default:
          break;
      }
      return sortOrder === "desc" ? comparison : -comparison;
    });

    return list;
  }, [reviews, filters, sortBy, sortOrder]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const handleEditClick = (review) => {
    setEditingReview(review);
    setShowEditModal(true);
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteReview(reviewToDelete);
      setShowDeleteModal(false);
      setReviewToDelete(null);
      toast.success("הביקורת נמחקה בהצלחה");
    } catch (err) {
      toast.error(err?.message || "שגיאה במחיקת הביקורת");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const handleReviewUpdated = (updatedReview) => {
    replaceReview(updatedReview);
    setShowEditModal(false);
    setEditingReview(null);
  };

  const hero = (
    <PageHero
      icon={MessageCircle}
      title="הביקורות שלי"
      subtitle="עקבו אחר כל הביקורות שכתבתם על קורסים ומרצים"
      badge={loading ? null : `נמצאו ${filteredReviews.length} ביקורות מתוך ${reviews.length} סה"כ`}
    />
  );

  return (
    <PageLayout accent="slate" width="max-w-screen-2xl" header={hero}>
        {error && <Alert type="error" message={error} className="mb-4" />}

        {loading ? (
          <div role="status">
            <p className="sr-only">טוען ביקורות...</p>
            <SkeletonReviewList count={4} />
          </div>
        ) : (
          <>
            <ReviewFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              uniqueLecturers={uniqueLecturers}
              uniqueCourses={uniqueCourses}
              uniqueDepartments={uniqueDepartments}
            />

            <ReviewsList
              reviews={filteredReviews}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          </>
        )}

        {showEditModal && editingReview && (
          <ReviewEditModal
            review={editingReview}
            user={user}
            onClose={() => {
              setShowEditModal(false);
              setEditingReview(null);
            }}
            onReviewUpdated={handleReviewUpdated}
          />
        )}

        {showDeleteModal && reviewToDelete && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            title="מחיקת ביקורת"
            message="האם אתה בטוח שברצונך למחוק את הביקורת? פעולה זו אינה ניתנת לביטול."
          />
        )}
    </PageLayout>
  );
};

export default MyReviewsPage;
