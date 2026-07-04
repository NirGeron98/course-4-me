import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  User,
  BookOpen,
  Building,
  Hash,
  SortAsc,
  SortDesc,
  X,
  Eye,
  Star
} from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';

const FILTER_LABELS = {
  searchTerm: 'חיפוש',
  lecturer: 'מרצה',
  course: 'קורס',
  courseNumber: 'מספר קורס',
  department: 'מחלקה',
  startDate: 'מתאריך',
  endDate: 'עד תאריך',
  minRating: 'דירוג מינימלי',
  maxRating: 'דירוג מקסימלי',
  isAnonymous: 'סוג ביקורת',
  reviewType: 'סוג דירוג'
};

const SORT_OPTIONS = [
  { value: 'newest', label: 'הכי חדש' },
  { value: 'oldest', label: 'הכי ישן' },
  { value: 'course', label: 'לפי קורס' },
  { value: 'lecturer', label: 'לפי מרצה' },
  { value: 'rating', label: 'לפי דירוג' },
  { value: 'department', label: 'לפי מחלקה' }
];

const ReviewFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  uniqueLecturers,
  uniqueCourses,
  uniqueDepartments
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== '' && value !== 'all'
  );

  return (
    <div className="bg-white rounded-card-lg shadow-card p-6 mb-6">
      {/* Main Search and Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Search Bar */}
        <div className="flex-1">
          <Input
            type="text"
            leftIcon={Search}
            placeholder="חיפוש לפי שם קורס, מרצה, מחלקה או תוכן..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            aria-label="חיפוש ביקורות"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium whitespace-nowrap">מיין לפי:</span>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="מיון ביקורות"
              fullWidth={false}
              className="text-sm"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="p-2 border border-slate-300 rounded-card hover:bg-slate-50 transition-colors duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            title={sortOrder === 'desc' ? 'מיון יורד' : 'מיון עולה'}
            aria-label={sortOrder === 'desc' ? 'מיון יורד' : 'מיון עולה'}
          >
            {sortOrder === 'desc' ? (
              <SortDesc className="w-4 h-4 text-slate-600" aria-hidden="true" />
            ) : (
              <SortAsc className="w-4 h-4 text-slate-600" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            aria-expanded={showAdvancedFilters}
            aria-label="סינון מתקדם"
            className={`flex items-center gap-2 px-4 py-2 rounded-card border transition-colors duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              showAdvancedFilters
                ? 'bg-brand-tint text-brand-strong border-brand-soft'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Filter className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">סינון מתקדם</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              aria-label="נקה סינון"
              className="flex items-center gap-2 px-4 py-2 rounded-card bg-danger-soft text-danger hover:text-danger-strong border border-red-200 transition-colors duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">נקה סינון</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-slate-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Select
              label="מרצה"
              leftIcon={User}
              value={filters.lecturer}
              onChange={(e) => onFilterChange('lecturer', e.target.value)}
            >
              <option value="">כל המרצים</option>
              {uniqueLecturers.map(lecturer => (
                <option key={lecturer} value={lecturer}>
                  {lecturer}
                </option>
              ))}
            </Select>

            <Select
              label="קורס"
              leftIcon={BookOpen}
              value={filters.course}
              onChange={(e) => onFilterChange('course', e.target.value)}
            >
              <option value="">כל הקורסים</option>
              {uniqueCourses.map(course => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </Select>

            <Input
              label="מספר קורס"
              leftIcon={Hash}
              type="text"
              placeholder="לדוגמה: 12345"
              value={filters.courseNumber}
              onChange={(e) => onFilterChange('courseNumber', e.target.value)}
            />

            <Select
              label="מחלקה"
              leftIcon={Building}
              value={filters.department}
              onChange={(e) => onFilterChange('department', e.target.value)}
            >
              <option value="">כל המחלקות</option>
              {uniqueDepartments.map(department => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </Select>

            <Input
              label="מתאריך"
              leftIcon={Calendar}
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
            />

            <Input
              label="עד תאריך"
              leftIcon={Calendar}
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
            />

            <Select
              label="דירוג מינימלי"
              leftIcon={Star}
              value={filters.minRating}
              onChange={(e) => onFilterChange('minRating', e.target.value)}
            >
              <option value="">ללא מגבלה</option>
              <option value="1">1 כוכב ומעלה</option>
              <option value="2">2 כוכבים ומעלה</option>
              <option value="3">3 כוכבים ומעלה</option>
              <option value="4">4 כוכבים ומעלה</option>
              <option value="5">5 כוכבים</option>
            </Select>

            <Select
              label="דירוג מקסימלי"
              leftIcon={Star}
              value={filters.maxRating}
              onChange={(e) => onFilterChange('maxRating', e.target.value)}
            >
              <option value="">ללא מגבלה</option>
              <option value="1">1 כוכב</option>
              <option value="2">2 כוכבים ומטה</option>
              <option value="3">3 כוכבים ומטה</option>
              <option value="4">4 כוכבים ומטה</option>
              <option value="5">5 כוכבים ומטה</option>
            </Select>

            <Select
              label="סוג ביקורת"
              leftIcon={Eye}
              value={filters.isAnonymous}
              onChange={(e) => onFilterChange('isAnonymous', e.target.value)}
            >
              <option value="all">כל הביקורות</option>
              <option value="false">ביקורות גלויות</option>
              <option value="true">ביקורות אנונימיות</option>
            </Select>

            <Select
              label="סוג דירוג"
              leftIcon={BookOpen}
              value={filters.reviewType}
              onChange={(e) => onFilterChange('reviewType', e.target.value)}
            >
              <option value="all">כל הדירוגים</option>
              <option value="course">דירוגי קורסים</option>
              <option value="lecturer">דירוגי מרצים</option>
            </Select>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-2">סינונים פעילים:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || value === 'all') return null;

                  const displayValue = key === 'isAnonymous'
                    ? (value === 'true' ? 'אנונימי' : 'גלוי')
                    : key === 'reviewType'
                      ? (value === 'course' ? 'קורסים' : 'מרצים')
                      : value;

                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-brand-tint text-brand-strong text-sm rounded-full"
                    >
                      {FILTER_LABELS[key]}: {displayValue}
                      <button
                        type="button"
                        onClick={() => onFilterChange(key, key === 'isAnonymous' || key === 'reviewType' ? 'all' : '')}
                        className="ms-1 hover:text-emerald-900 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        aria-label={`הסר סינון ${FILTER_LABELS[key]}`}
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewFilters;
