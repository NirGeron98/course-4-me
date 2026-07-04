import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

// PasswordRules — live password-requirements checklist. Pass the current
// password string; each rule flips to a green check as it is satisfied.
// Keep RULES in sync with the server's password policy.
export const RULES = [
  { id: "length", label: "לפחות 6 תווים", test: (p) => p.length >= 6 },
  { id: "letter", label: "לפחות אות אחת", test: (p) => /[A-Za-z]/.test(p) },
  { id: "digit", label: "לפחות ספרה אחת", test: (p) => /[0-9]/.test(p) },
];

export const passwordSatisfiesRules = (password) =>
  RULES.every((rule) => rule.test(password));

const PasswordRules = ({ password = "" }) => {
  return (
    <ul
      className="bg-surface-sunken border border-slate-200 rounded-card p-3.5 space-y-1.5"
      aria-label="דרישות סיסמה"
    >
      {RULES.map((rule) => {
        const ok = rule.test(password);
        return (
          <li
            key={rule.id}
            className={`flex items-center gap-2 text-sm transition-colors duration-ui ${
              ok ? "text-brand-strong" : "text-muted"
            }`}
          >
            {ok ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <Circle className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            {rule.label}
            <span className="sr-only">{ok ? "(מולא)" : "(טרם מולא)"}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default PasswordRules;
