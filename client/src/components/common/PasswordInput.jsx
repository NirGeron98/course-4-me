import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import Input from "./Input";

// PasswordInput — Input with a built-in show/hide visibility toggle.
// Accepts every Input prop (label, hint, error, name, value, onChange, ...).
const PasswordInput = React.forwardRef(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      ref={ref}
      type={visible ? "text" : "password"}
      leftIcon={Lock}
      rightElement={
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "הסתר סיסמה" : "הצג סיסמה"}
          className="p-1.5 rounded-button text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-ui ease-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {visible ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      }
      {...props}
    />
  );
});

export default PasswordInput;
