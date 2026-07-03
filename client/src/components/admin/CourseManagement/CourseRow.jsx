import React from "react";
import RowActions from "../../common/admin/RowActions";

// CourseRow — presentational helpers for the course list table.
// Exports `courseColumns` (used by ListTable) and `renderCourseRowActions`
// (used as ListTable's renderRowActions prop), mirroring LecturerRow.jsx.

export const courseColumns = [
  {
    key: "title",
    header: "שם הקורס",
    render: (row) => (
      <div className="font-semibold text-slate-800 truncate" title={row.title}>
        {row.title}
      </div>
    ),
  },
  {
    key: "courseNumber",
    header: "מספר קורס",
    render: (row) => (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
        {row.courseNumber}
      </span>
    ),
  },
  {
    key: "credits",
    header: "נק״ז",
    align: "center",
    render: (row) => (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
        {row.credits}
      </span>
    ),
  },
  {
    key: "lecturers",
    header: "מרצים",
    render: (row) =>
      Array.isArray(row.lecturers) && row.lecturers.length > 0 ? (
        <span
          className="text-sm text-slate-600 truncate"
          title={row.lecturers.map((l) => l.name).join(", ")}
        >
          {row.lecturers.map((l) => l.name).join(", ")}
        </span>
      ) : (
        <span className="text-xs text-muted">אין מרצים</span>
      ),
  },
  {
    key: "department",
    header: "מחלקה",
    render: (row) => (
      <span className="text-sm text-slate-600 truncate">
        {row.department || "—"}
      </span>
    ),
  },
];

export const renderCourseRowActions = ({ onEdit, onDelete, disabled }) => (row) => (
  <RowActions
    onEdit={() => onEdit(row)}
    onDelete={() => onDelete(row)}
    disabled={disabled}
  />
);
