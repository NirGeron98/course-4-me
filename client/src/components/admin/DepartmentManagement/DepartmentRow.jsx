import React from "react";
import RowActions from "../../common/admin/RowActions";

// DepartmentRow — presentational helpers for the department list table.
// Exports `departmentColumns` (used by ListTable) and `renderDepartmentRowActions`
// (used as ListTable's renderRowActions prop), mirroring LecturerRow.jsx.

export const departmentColumns = [
  {
    key: "name",
    header: "שם המחלקה",
    render: (row) => (
      <div className="font-semibold text-slate-800 truncate" title={row.name}>
        {row.name}
      </div>
    ),
  },
  {
    key: "code",
    header: "קוד",
    render: (row) => (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
        {row.code}
      </span>
    ),
  },
  {
    key: "description",
    header: "תיאור",
    render: (row) => (
      <span className="text-sm text-slate-600 truncate" title={row.description}>
        {row.description || "—"}
      </span>
    ),
  },
];

export const renderDepartmentRowActions = ({ onEdit, onDelete, disabled }) => (row) => (
  <RowActions
    onEdit={() => onEdit(row)}
    onDelete={() => onDelete(row)}
    disabled={disabled}
  />
);
