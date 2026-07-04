import React from 'react';
import { Filter, SortAsc } from 'lucide-react';
import Select from './Select';

// ReviewFilterBar — the filter + sort row shared by the course and lecturer
// review sections. Options are [{ value, label }].
const ReviewFilterBar = ({
  filterValue,
  onFilterChange,
  filterOptions,
  filterAriaLabel = 'סינון ביקורות',
  sortValue,
  onSortChange,
  sortOptions,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
        <Select
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          aria-label={filterAriaLabel}
          fullWidth={false}
          className="text-sm"
        >
          {filterOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <SortAsc className="w-4 h-4 text-slate-500" aria-hidden="true" />
        <Select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="מיון ביקורות"
          fullWidth={false}
          className="text-sm"
        >
          {sortOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default ReviewFilterBar;
