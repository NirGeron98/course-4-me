import React from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import EmptyState from "../EmptyState";

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

// ListTable — generic responsive table primitive for admin panels.
// Props:
//  - columns: array of { key, header, width?, align?, className?, render?(row, index) }
//      * render defaults to row[key]
//      * align: "start" | "center" | "end" (defaults to "start")
//  - rows: array of record objects
//  - rowKey: (row, index) => string | number  (defaults to row.id || row._id || index)
//  - loading: when true, renders a skeleton body
//  - skeletonRows: number of skeleton rows to show (default 5)
//  - emptyTitle / emptyDescription / emptyIcon: EmptyState props for zero-row state
//  - onRowClick: optional click handler; when set, rows become interactive
//  - actionsColumn: optional node rendered in the rightmost header cell (e.g., actions label)
//  - renderRowActions: optional (row, index) => node shown in rightmost body cell
//  - className: additional classes on the outer Card container
const ALIGN_CLASS = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};

const ListTable = ({
  columns = [],
  rows = [],
  rowKey,
  loading = false,
  skeletonRows = 5,
  emptyTitle = "לא נמצאו תוצאות",
  emptyDescription,
  emptyIcon,
  onRowClick,
  actionsHeader,
  renderRowActions,
  className = "",
}) => {
  const getKey = (row, index) => {
    if (typeof rowKey === "function") return rowKey(row, index);
    return row?.id ?? row?._id ?? index;
  };

  const hasActions = typeof renderRowActions === "function";
  const totalCols = columns.length + (hasActions ? 1 : 0);
  const interactive = typeof onRowClick === "function";
  const shouldReduceMotion = useReducedMotion();
  const rowInitial = shouldReduceMotion ? "visible" : "hidden";

  if (!loading && rows.length === 0) {
    return (
      <div
        dir="rtl"
        className={`bg-surface-raised border border-slate-200 rounded-card shadow-card overflow-hidden ${className}`.trim()}
      >
        <div className="px-4 py-10">
          <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />
        </div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div
        dir="rtl"
        className={`bg-surface-raised border border-slate-200 rounded-card shadow-card overflow-hidden ${className}`.trim()}
      >
        {/* Mobile card-collapse (below md:) */}
        <m.div
          className="md:hidden divide-y divide-slate-100"
          variants={listVariants}
          initial={rowInitial}
          animate="visible"
        >
          {loading
            ? Array.from({ length: skeletonRows }).map((_, rowIdx) => (
                <div key={`skeleton-card-${rowIdx}`} className="p-4 space-y-2">
                  {Array.from({ length: Math.min(columns.length, 3) }).map((__, colIdx) => (
                    <div key={colIdx} className="h-4 rounded bg-slate-200 animate-pulse" />
                  ))}
                </div>
              ))
            : rows.map((row, index) => {
                const key = getKey(row, index);
                return (
                  <m.div
                    key={key}
                    variants={itemVariants}
                    onClick={interactive ? () => onRowClick(row, index) : undefined}
                    className={`p-4 flex flex-col gap-2 transition-colors duration-ui ease-ui ${
                      interactive ? "cursor-pointer hover:bg-slate-50" : ""
                    }`}
                  >
                    {columns.map((col) => {
                      const content = col.render ? col.render(row, index) : row?.[col.key];
                      return (
                        <div key={col.key} className="flex items-start justify-between gap-3 text-sm">
                          <span className="shrink-0 font-medium text-slate-500">{col.header}</span>
                          <span className="text-slate-800 text-end">{content}</span>
                        </div>
                      );
                    })}
                    {hasActions && (
                      <div
                        className="flex justify-end pt-2 mt-1 border-t border-slate-100"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {renderRowActions(row, index)}
                      </div>
                    )}
                  </m.div>
                );
              })}
        </m.div>

        {/* Desktop table (md: and up) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-surface-sunken border-b border-slate-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    style={col.width ? { width: col.width } : undefined}
                    className={`px-4 py-3 font-semibold text-slate-700 ${
                      ALIGN_CLASS[col.align] || ALIGN_CLASS.start
                    } ${col.className || ""}`.trim()}
                  >
                    {col.header}
                  </th>
                ))}
                {hasActions && (
                  <th
                    scope="col"
                    className="px-4 py-3 font-semibold text-slate-700 text-end w-px whitespace-nowrap"
                  >
                    {actionsHeader || "פעולות"}
                  </th>
                )}
              </tr>
            </thead>

            <m.tbody variants={listVariants} initial={rowInitial} animate="visible">
              {loading
                ? Array.from({ length: skeletonRows }).map((_, rowIdx) => (
                    <tr
                      key={`skeleton-${rowIdx}`}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      {Array.from({ length: totalCols }).map((__, colIdx) => (
                        <td key={colIdx} className="px-4 py-3">
                          <div className="h-4 rounded bg-slate-200 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map((row, index) => {
                    const key = getKey(row, index);
                    return (
                      <m.tr
                        key={key}
                        variants={itemVariants}
                        onClick={interactive ? () => onRowClick(row, index) : undefined}
                        className={`border-b border-slate-100 last:border-b-0 transition-colors duration-ui ease-ui ${
                          interactive ? "cursor-pointer hover:bg-slate-50" : ""
                        }`}
                      >
                        {columns.map((col) => {
                          const content = col.render
                            ? col.render(row, index)
                            : row?.[col.key];
                          return (
                            <td
                              key={col.key}
                              className={`px-4 py-3 text-slate-800 align-middle ${
                                ALIGN_CLASS[col.align] || ALIGN_CLASS.start
                              } ${col.className || ""}`.trim()}
                            >
                              {content}
                            </td>
                          );
                        })}
                        {hasActions && (
                          <td
                            className="px-4 py-3 text-end align-middle whitespace-nowrap"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {renderRowActions(row, index)}
                          </td>
                        )}
                      </m.tr>
                    );
                  })}
            </m.tbody>
          </table>
        </div>
      </div>
    </LazyMotion>
  );
};

export default ListTable;
