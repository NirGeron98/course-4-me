import React from "react";

const AuthDivider = ({ label = "או", className = "" }) => {
  return (
    <div
      className={`my-6 flex items-center gap-4 text-center ${className}`.trim()}
      role="separator"
      aria-label={label}
    >
      <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent" />
      <span className="rounded-full bg-surface-raised px-3 text-sm font-medium leading-none text-slate-500">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
    </div>
  );
};

export default AuthDivider;
