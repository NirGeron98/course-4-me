import React from "react";
import { BookOpen, Star, MessageCircle, Heart } from "lucide-react";
import Card from "./Card";

// AuthLayout — shared shell for Login / Signup / ForgotPassword /
// ResetPassword. Split-screen on lg: (brand/value panel beside the form),
// single centered column below. Pages pass their form as children; it is
// rendered inside a raised Card under the icon/title header.
const VALUE_PROPS = [
  {
    icon: Star,
    title: "ביקורות אמיתיות",
    text: "דירוגים וחוות דעת של סטודנטים על קורסים ומרצים",
  },
  {
    icon: Heart,
    title: "מעקב אישי",
    text: "עקבו אחרי הקורסים והמרצים שמעניינים אתכם",
  },
  {
    icon: MessageCircle,
    title: "קהילה משתפת",
    text: "שתפו את הניסיון שלכם ועזרו לסטודנטים אחרים לבחור נכון",
  },
];

const AuthLayout = ({ icon: Icon, title, subtitle, children }) => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex"
      dir="rtl"
    >
      {/* Form column */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {Icon && (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand rounded-full mb-4 shadow-card">
                <Icon className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
            )}
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
            {subtitle && <p className="text-muted">{subtitle}</p>}
          </div>

          <Card variant="raised" padding="lg">
            {children}
          </Card>
        </div>
      </div>

      {/* Brand panel — desktop only */}
      <div
        className="hidden lg:flex w-[44%] xl:w-2/5 bg-gradient-to-br from-brand via-brand-strong to-emerald-900 text-white items-center justify-center p-12 relative overflow-hidden"
        aria-hidden="true"
      >
        {/* Soft decorative blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-white/10 rounded-full blur-xl" />

        <div className="relative max-w-md space-y-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 rounded-card p-3 backdrop-blur-sm">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold">{'Course4Me'}</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl xl:text-3xl font-bold leading-snug">
              בוחרים קורסים חכם יותר
            </h2>
            <p className="text-emerald-100 text-lg">
              כל המידע שסטודנטים צריכים על קורסים ומרצים — במקום אחד
            </p>
          </div>

          <ul className="space-y-5">
            {VALUE_PROPS.map(({ icon: PropIcon, title: propTitle, text }) => (
              <li key={propTitle} className="flex items-start gap-4">
                <span className="bg-white/15 rounded-card p-2.5 backdrop-blur-sm shrink-0">
                  <PropIcon className="w-5 h-5 text-white" />
                </span>
                <span>
                  <span className="block font-semibold">{propTitle}</span>
                  <span className="block text-emerald-100 text-sm mt-0.5">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5 text-amber-300">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
            <span className="text-emerald-100 text-sm mr-2">
              מבוסס על ביקורות של סטודנטים
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
