import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Building, Plus, Trash2 } from "lucide-react";
import { apiFetch } from "../../../hooks/useApi";
import FilterBar from "../../common/admin/FilterBar";
import ListTable from "../../common/admin/ListTable";
import ConfirmDialog from "../../common/ConfirmDialog";
import { departmentColumns, renderDepartmentRowActions } from "./DepartmentRow";
import DepartmentFormModal from "./DepartmentFormModal";

// DepartmentManagement — thin shell mirroring LecturerManagement's structure.
// Data access (the same GET/POST/PUT/DELETE /api/departments calls the
// previous flat component made) stays local to this shell; row presentation
// lives in DepartmentRow, the edit form in DepartmentFormModal.

const DepartmentManagement = ({ onMessage, onError }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState(null); // "create" | "edit" | null
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/departments`);
      setDepartments(data);
    } catch (err) {
      onError("שגיאה בטעינת המחלקות");
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const filteredDepartments = useMemo(() => {
    if (!search.trim()) return departments;
    const needle = search.trim().toLowerCase();
    return departments.filter((d) => d.name?.toLowerCase().includes(needle));
  }, [departments, search]);

  const openCreate = () => {
    setActiveDepartment(null);
    setFormError("");
    setFormMode("create");
  };

  const openEdit = (department) => {
    setActiveDepartment(department);
    setFormError("");
    setFormMode("edit");
  };

  const closeForm = () => {
    setFormMode(null);
    setActiveDepartment(null);
    setFormError("");
  };

  const handleSubmit = async (payload) => {
    setMutating(true);
    try {
      if (formMode === "edit" && activeDepartment) {
        await apiFetch(`/api/departments/${activeDepartment._id}`, {
          method: "PUT",
          body: payload,
        });
        onMessage("מחלקה עודכנה בהצלחה!");
      } else {
        await apiFetch(`/api/departments`, {
          method: "POST",
          body: payload,
        });
        onMessage("מחלקה נוספה בהצלחה!");
      }
      closeForm();
      fetchDepartments();
    } catch (err) {
      setFormError(err.message || "שגיאה בשמירת המחלקה");
    } finally {
      setMutating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setMutating(true);
    try {
      await apiFetch(`/api/departments/${deleteTarget._id}`, {
        method: "DELETE",
      });
      onMessage("המחלקה נמחקה בהצלחה!");
      fetchDepartments();
    } catch (err) {
      onError(err.message || "שגיאה במחיקת המחלקה");
    } finally {
      setMutating(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-3 sm:p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Building className="w-7 h-7 text-brand" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-slate-800">ניהול מחלקות אקדמיות</h2>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="חיפוש לפי שם מחלקה..."
        onRefresh={fetchDepartments}
        refreshing={loading}
        primaryAction={{
          label: "הוסף מחלקה",
          icon: Plus,
          onClick: openCreate,
        }}
      />

      <ListTable
        columns={departmentColumns}
        rows={filteredDepartments}
        loading={loading}
        emptyTitle="לא נמצאו מחלקות"
        emptyDescription={
          search
            ? "נסה להתאים את החיפוש או לנקות את הסינון"
            : "טרם הוזנו מחלקות למערכת"
        }
        emptyIcon={Building}
        renderRowActions={renderDepartmentRowActions({
          onEdit: openEdit,
          onDelete: setDeleteTarget,
          disabled: mutating,
        })}
      />

      {formMode && (
        <DepartmentFormModal
          isOpen
          mode={formMode}
          department={activeDepartment}
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
        title="מחיקת מחלקה"
        description="הפעולה אינה ניתנת לביטול"
        message={`האם אתה בטוח שברצונך למחוק את ${deleteTarget?.name || "המחלקה"}?`}
        confirmLabel="מחק מחלקה"
        confirmIcon={Trash2}
        variant="danger"
        loading={mutating}
      />
    </div>
  );
};

export default DepartmentManagement;
