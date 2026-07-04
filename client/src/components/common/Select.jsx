import React, { useId } from "react";
import { ChevronDown } from "lucide-react";

// Select — native <select> with the same label/hint/error chrome as Input.
// Use this instead of raw <select> elements in filters and forms; keep
// react-select for multi-select fields only.
// Props:
//  - label: visible label text (Hebrew copy)
//  - hint: helper text below the field
//  - error: error message; replaces the hint and applies danger styles
//  - leftIcon: optional lucide-react icon component (rendered on the inline
//    start, matching Input's icon slot)
//  - fullWidth: stretch to parent width (default: true)
//  - children: <option> elements
const BASE_FIELD =
  "w-full appearance-none rounded-button bg-surface-raised border text-slate-900 " +
  "transition-colors duration-ui ease-ui cursor-pointer " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 " +
  "disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed";

const NEUTRAL_BORDER =
  "border-slate-300 hover:border-slate-400 focus-visible:border-brand focus-visible:ring-brand/40";

const DANGER_BORDER =
  "border-danger focus-visible:border-danger focus-visible:ring-danger/40";

// Same mobile sizing rules as Input: 16px text prevents iOS zoom, 44px touch
// target. Extra inline-end padding reserves room for the chevron.
const SIZE_CLASS =
  "text-base sm:text-sm py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] pr-3 pl-9";

const Select = React.forwardRef(function Select(
  {
    label,
    hint,
    error,
    leftIcon: LeftIcon,
    id,
    className = "",
    fullWidth = true,
    required,
    children,
    ...rest
  },
  ref
) {
  const reactId = useId();
  const fieldId = id || `select-${reactId}`;
  const describedById = error
    ? `${fieldId}-error`
    : hint
    ? `${fieldId}-hint`
    : undefined;

  const borderClass = error ? DANGER_BORDER : NEUTRAL_BORDER;
  const iconPadding = LeftIcon ? " pr-10" : "";

  return (
    <div className={fullWidth ? "w-full" : ""} dir="rtl">
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label}
          {required && <span className="text-danger mr-1">*</span>}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 pointer-events-none">
            <LeftIcon className="w-4 h-4" aria-hidden="true" />
          </span>
        )}
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedById}
          required={required}
          className={`${BASE_FIELD} ${borderClass} ${SIZE_CLASS}${iconPadding} ${className}`.trim()}
          {...rest}
        >
          {children}
        </select>
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </span>
      </div>

      {error ? (
        <p id={`${fieldId}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Select;
