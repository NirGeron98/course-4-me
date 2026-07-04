// Tailwind design tokens for the Course4Me "Elegant & Minimalist" system.
// See client/UI_REFINEMENTS.md for usage guidelines and primitive component APIs.
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Heebo",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      // Semantic color tokens. Prefer these over raw gray-X so color tweaks
      // can happen in one place.
      colors: {
        surface: "#f8fafc",
        "surface-raised": "#ffffff",
        "surface-sunken": "#f1f5f9",
        muted: "#64748b",
        "muted-strong": "#475569",
        brand: {
          DEFAULT: "#059669",
          soft: "#d1fae5",
          strong: "#047857",
          tint: "#ecfdf5",
        },
        danger: {
          DEFAULT: "#dc2626",
          soft: "#fee2e2",
          strong: "#b91c1c",
        },
        // Entity accent families: courses/self = emerald (same hue as brand),
        // lecturers = purple, search/contact = indigo. Prefer these over raw
        // emerald-*/purple-*/indigo-* so the mapping stays consistent app-wide.
        accent: {
          course: {
            DEFAULT: "#059669",
            soft: "#d1fae5",
            strong: "#047857",
            tint: "#ecfdf5",
          },
          lecturer: {
            DEFAULT: "#9333ea",
            soft: "#f3e8ff",
            strong: "#7e22ce",
            tint: "#faf5ff",
          },
          info: {
            DEFAULT: "#4f46e5",
            soft: "#e0e7ff",
            strong: "#4338ca",
            tint: "#eef2ff",
          },
        },
      },
      textColor: {
        muted: "#64748b",
        "muted-strong": "#475569",
      },
      backgroundColor: {
        surface: "#f8fafc",
        "surface-raised": "#ffffff",
        "surface-sunken": "#f1f5f9",
      },
      borderRadius: {
        card: "1rem",
        "card-lg": "1.25rem",
        button: "0.75rem",
      },
      boxShadow: {
        // Subtle shadow for regular cards / list rows.
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        "card-hover":
          "0 4px 6px -1px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.06)",
        // Slightly richer resting shadow for hero/feature cards, between card-hover and elevated.
        "card-lg":
          "0 8px 12px -3px rgb(15 23 42 / 0.10), 0 3px 5px -3px rgb(15 23 42 / 0.08)",
        // Stronger shadow for modals, popovers, menus.
        elevated:
          "0 10px 15px -3px rgb(15 23 42 / 0.12), 0 4px 6px -4px rgb(15 23 42 / 0.10)",
        "elevated-lg":
          "0 25px 50px -12px rgb(15 23 42 / 0.25)",
      },
      transitionDuration: {
        ui: "200ms",
      },
      transitionTimingFunction: {
        ui: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-out",
      },
    },
  },
  plugins: [],
};
