import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Pagination — shared prev/next/page-number control for admin list shells.
// Renders nothing when there is only one page.
const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 py-2 ${className}`.trim()}>
      <button
        type="button"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
              type="button"
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              aria-current={currentPage === pageNumber ? "page" : undefined}
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
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
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
  );
};

export default Pagination;
