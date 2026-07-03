import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Button from "./Button";

// 404 page rendered by the catch-all route in App.js.
// Uses client-side navigation (Link) instead of a full page reload.
const NotFound = ({ isLoggedIn }) => {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-surface flex items-center justify-center px-4"
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-800 mb-2">404</h1>
        <p className="text-muted text-lg mb-8">הדף שחיפשת לא נמצא</p>
        <Button
          as={Link}
          to={isLoggedIn ? "/dashboard" : "/login"}
          variant="primary"
          size="lg"
          leftIcon={Home}
        >
          {isLoggedIn ? "חזור לדף הבית" : "חזור להתחברות"}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
