import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { apiFetch } from "../../../hooks/useApi";
import FilterBar from "../../common/admin/FilterBar";
import ListTable from "../../common/admin/ListTable";
import Pagination from "../../common/admin/Pagination";
import ConfirmDialog from "../../common/ConfirmDialog";
import { courseColumns, renderCourseRowActions } from "./CourseRow";
import CourseFormModal from "./CourseFormModal";

const COURSES_PER_PAGE = 5;

// CourseManagement — thin shell mirroring LecturerManagement's structure.
// Data access (the same GET/POST/PUT/DELETE /api/courses calls the previous
// flat component made, including the exact payload shape built on submit)
// stays local to this shell; row presentation lives in CourseRow, the edit
// form in CourseFormModal.

const CourseManagement = ({ lecturers, onMessage, onError }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formMode, setFormMode] = useState(null); // "create" | "edit" | null
  const [activeCourse, setActiveCourse] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/courses`);
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      onError("שגיאה בטעינת הקורסים");
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;
    const needle = search.trim().toLowerCase();
    return courses.filter((course) => course.title.toLowerCase().includes(needle));
  }, [courses, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / COURSES_PER_PAGE));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + COURSES_PER_PAGE);

  const openCreate = () => {
    setActiveCourse(null);
    setFormError("");
    setFormMode("create");
  };

  const openEdit = (course) => {
    setActiveCourse(course);
    setFormError("");
    setFormMode("edit");
  };

  const closeForm = () => {
    setFormMode(null);
    setActiveCourse(null);
    setFormError("");
  };

  const handleSubmit = async (formData) => {
    setMutating(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits, 10),
        prerequisites: formData.prerequisites.join(", "),
        createdBy: user?._id,
      };

      if (formMode === "edit" && activeCourse) {
        await apiFetch(`/api/courses/${activeCourse._id}`, {
          method: "PUT",
          body: courseData,
        });
        onMessage("הקורס עודכן בהצלחה!");
      } else {
        await apiFetch(`/api/courses`, {
          method: "POST",
          body: courseData,
        });
        onMessage("קורס נוסף בהצלחה!");
      }

      closeForm();
      fetchCourses();
    } catch (err) {
      console.error("Error saving course:", err);
      setFormError(err.message || "שגיאה בהוספת הקורס");
    } finally {
      setMutating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setMutating(true);
    try {
      await apiFetch(`/api/courses/${deleteTarget._id}`, {
        method: "DELETE",
      });
      onMessage("קורס נמחק בהצלחה!");
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
      onError(err.message || "שגיאה במחיקת הקורס");
    } finally {
      setMutating(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-3 sm:p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <BookOpen className="w-7 h-7 text-brand" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-slate-800">ניהול קורסים</h2>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="חיפוש לפי שם קורס..."
        onRefresh={fetchCourses}
        refreshing={loading}
        primaryAction={{
          label: "הוסף קורס",
          icon: Plus,
          onClick: openCreate,
        }}
      />

      <ListTable
        columns={courseColumns}
        rows={currentCourses}
        loading={loading}
        emptyTitle="לא נמצאו קורסים"
        emptyDescription={
          search
            ? "נסה להתאים את החיפוש או לנקות את הסינון"
            : "טרם הוזנו קורסים למערכת"
        }
        emptyIcon={BookOpen}
        renderRowActions={renderCourseRowActions({
          onEdit: openEdit,
          onDelete: setDeleteTarget,
          disabled: mutating,
        })}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {formMode && (
        <CourseFormModal
          isOpen
          mode={formMode}
          course={activeCourse}
          lecturers={lecturers}
          courses={courses}
          submitting={mutating}
          error={formError}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="מחיקת קורס"
        description="הפעולה אינה ניתנת לביטול"
        message={`האם אתה בטוח שברצונך למחוק את ${deleteTarget?.title || "הקורס"}?`}
        confirmLabel="מחק קורס"
        confirmIcon={Trash2}
        variant="danger"
        loading={mutating}
      />
    </div>
  );
};

export default CourseManagement;
