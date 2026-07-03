import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Users, Trash2 } from "lucide-react";
import FilterBar from "../../common/admin/FilterBar";
import ListTable from "../../common/admin/ListTable";
import ConfirmDialog from "../../common/ConfirmDialog";
import useLecturers from "../../../hooks/useLecturers";
import { lecturerColumns, renderLecturerRowActions } from "./LecturerRow";
import LecturerFormModal from "./LecturerFormModal";

const LECTURERS_PER_PAGE = 5;

// LecturerManagement — thin shell for the admin panel. All data access lives
// in useLecturers, all row presentation in LecturerRow, and the edit form in
// LecturerFormModal. This component is only responsible for wiring filter +
// list + modals together.

const LecturerManagement = ({ onMessage, onError, onLecturersUpdate }) => {
  const {
    lecturers,
    departments,
    loading,
    mutating,
    error,
    refetch,
    createLecturer,
    updateLecturer,
    deleteLecturer,
  } = useLecturers({ onLecturersUpdate });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formMode, setFormMode] = useState(null); // "create" | "edit" | null
  const [activeLecturer, setActiveLecturer] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredLecturers = useMemo(() => {
    if (!search.trim()) return lecturers;
    const needle = search.trim().toLowerCase();
    return lecturers.filter((l) => l.name?.toLowerCase().includes(needle));
  }, [lecturers, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredLecturers.length / LECTURERS_PER_PAGE));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const startIndex = (currentPage - 1) * LECTURERS_PER_PAGE;
  const currentLecturers = filteredLecturers.slice(startIndex, startIndex + LECTURERS_PER_PAGE);

  useEffect(() => {
    if (error) onError?.(error);
  }, [error, onError]);

  const openCreate = () => {
    setActiveLecturer(null);
    setFormError("");
    setFormMode("create");
  };

  const openEdit = (lecturer) => {
    setActiveLecturer(lecturer);
    setFormError("");
    setFormMode("edit");
  };

  const closeForm = () => {
    setFormMode(null);
    setActiveLecturer(null);
    setFormError("");
  };

  const handleSubmit = async (payload) => {
    try {
      if (formMode === "edit" && activeLecturer) {
        await updateLecturer(activeLecturer._id, payload);
        onMessage?.("המרצה עודכן בהצלחה");
      } else {
        await createLecturer(payload);
        onMessage?.("המרצה נוסף בהצלחה");
      }
      closeForm();
    } catch (err) {
      setFormError(err?.message || "שגיאה בשמירת המרצה");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLecturer(deleteTarget._id);
      onMessage?.("המרצה נמחק בהצלחה");
    } catch (err) {
      onError?.(err?.message || "שגיאה במחיקת המרצה");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-3 sm:p-6 flex flex-col gap-4">
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="חיפוש לפי שם מרצה..."
        onRefresh={refetch}
        refreshing={loading}
        primaryAction={{
          label: "הוסף מרצה",
          icon: Plus,
          onClick: openCreate,
        }}
      />

      <ListTable
        columns={lecturerColumns}
        rows={currentLecturers}
        loading={loading}
        emptyTitle="לא נמצאו מרצים"
        emptyDescription={
          search
            ? "נסה להתאים את החיפוש או לנקות את הסינון"
            : "טרם הוזנו מרצים למערכת"
        }
        emptyIcon={Users}
        renderRowActions={renderLecturerRowActions({
          onEdit: openEdit,
          onDelete: setDeleteTarget,
          disabled: mutating,
        })}
      />

      {filteredLecturers.length > LECTURERS_PER_PAGE && (
        <div className="flex items-center justify-center gap-2 py-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-button ${
              currentPage === 1
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:text-brand hover:bg-brand/10"
            }`}
            aria-label="עמוד קודם"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((pageNumber) => Math.abs(pageNumber - currentPage) <= 2)
              .map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 rounded-button text-sm font-medium ${
                    currentPage === pageNumber
                      ? "bg-brand text-white shadow-card"
                      : "text-slate-600 hover:text-brand hover:bg-brand/10"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-button ${
              currentPage === totalPages
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:text-brand hover:bg-brand/10"
            }`}
            aria-label="עמוד הבא"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {formMode && (
        <LecturerFormModal
          isOpen
          mode={formMode}
          lecturer={activeLecturer}
          departments={departments}
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
        title="מחיקת מרצה"
        description="הפעולה אינה ניתנת לביטול"
        message={`האם אתה בטוח שברצונך למחוק את ${deleteTarget?.name || "המרצה"}?`}
        confirmLabel="מחק מרצה"
        confirmIcon={Trash2}
        variant="danger"
        loading={mutating}
      />
    </div>
  );
};

export default LecturerManagement;
