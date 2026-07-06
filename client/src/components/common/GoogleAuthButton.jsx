import React, { useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE_URL;
const BUTTON_TEXT = "המשך עם Google";

const GoogleLogo = () => (
  <svg
    className="h-5 w-5 shrink-0"
    viewBox="0 0 18 18"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3-2.33z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z"
    />
  </svg>
);

const GoogleAuthButton = ({ disabled = false }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (disabled || loading) return;
    setLoading(true);
    window.location.assign(`${API_BASE}/api/auth/google`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={BUTTON_TEXT}
      aria-busy={loading || undefined}
      className="group relative inline-flex min-h-[48px] w-full items-center justify-center gap-3 overflow-hidden rounded-button border border-slate-300 bg-white px-5 text-base font-semibold text-slate-800 shadow-sm transition-all duration-ui ease-ui hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:translate-y-0 active:border-slate-300 active:bg-slate-100 active:shadow-sm disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[44px]"
    >
      <span className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-white opacity-0 transition-opacity duration-ui group-hover:opacity-80" />
      <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
        <GoogleLogo />
      </span>
      <span className="relative">{loading ? "מעביר ל-Google..." : BUTTON_TEXT}</span>
      {loading && (
        <span
          className="relative h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand"
          aria-hidden="true"
        />
      )}
    </button>
  );
};

export default GoogleAuthButton;
