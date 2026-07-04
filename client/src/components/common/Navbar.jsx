// Navbar — app-wide top navigation. Token colors only, aria-current on the
// active link, and a mobile sheet that closes on Esc, outside click, and
// route change.
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, BookOpen, Settings, LogOut, Menu, X, Home, Shield, UserCheck, Heart, Search, MessageCircle, HelpCircle } from "lucide-react";
import ContactModal from "./ContactModal";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const navRef = useRef(null);

  // Don't show navbar on auth pages or when password reset is required
  const authPages = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const requiresPasswordReset = user?.requiresPasswordReset || localStorage.getItem("requiresPasswordReset") === "true";
  const shouldShowNavbar = user && !authPages.includes(location.pathname) && !requiresPasswordReset;

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close on Escape and on clicks outside the nav while the sheet is open.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    const handlePointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("requiresPasswordReset");
    onLogout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  // Navigate to profile when clicking on user name
  const handleUserNameClick = () => {
    navigate("/profile");
  };

  if (!shouldShowNavbar) {
    return null;
  }

  // Navigation items with shorter labels for better fitting
  const navItems = [
    {
      path: "/dashboard",
      label: "בית",
      fullLabel: "דף הבית",
      icon: Home
    },
    {
      path: "/search",
      label: "חיפוש",
      fullLabel: "חיפוש מתקדם",
      icon: Search
    },
    {
      path: "/my-reviews",
      label: "ביקורות",
      fullLabel: "הביקורות שלי",
      icon: MessageCircle
    },
    {
      path: "/my-contact-requests",
      label: "פניות",
      fullLabel: "הפניות שלי",
      icon: HelpCircle
    },
    {
      path: "/lecturers",
      label: "מרצים",
      fullLabel: "המרצים שלי",
      icon: UserCheck
    },
    {
      path: "/tracked-courses",
      label: "קורסים",
      fullLabel: "הקורסים שלי",
      icon: Heart
    }
  ];

  // Add admin link if user is admin
  if (user?.user?.role === "admin") {
    navItems.push({
      path: "/admin",
      label: "ניהול",
      fullLabel: "ניהול מערכת",
      icon: Shield
    });
  }

  const linkClass = (path) =>
    isActivePage(path)
      ? 'bg-slate-100 text-slate-900 shadow-card'
      : path === '/admin'
        ? 'text-accent-lecturer hover:text-accent-lecturer-strong hover:bg-accent-lecturer-tint'
        : 'text-muted hover:text-slate-800 hover:bg-slate-50';

  return (
    <nav ref={navRef} className="bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16" dir="rtl">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 group rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-card p-2 shadow-card group-hover:shadow-card-hover transition-all duration-ui ml-2">
                <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent mr-3">
                {'Course4Me'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block flex-1 max-w-4xl mx-8">
            <div className="flex items-center justify-center gap-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={isActivePage(item.path) ? "page" : undefined}
                    className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-card font-medium transition-all duration-ui whitespace-nowrap text-sm xl:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${linkClass(item.path)}`}
                    title={item.fullLabel}
                  >
                    <Icon className="w-4 h-4 ml-1.5" />
                    <span className="hidden xl:inline">{item.fullLabel}</span>
                    <span className="xl:hidden">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Medium screens navigation (tablet) */}
          <div className="hidden md:flex lg:hidden flex-1 justify-center mx-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={isActivePage(item.path) ? "page" : undefined}
                    aria-label={item.fullLabel}
                    className={`flex items-center justify-center w-10 h-10 rounded-card transition-all duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${linkClass(item.path)}`}
                    title={item.fullLabel}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User menu & logout */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 space-x-reverse">
            {/* Contact request button — info accent */}
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex items-center space-x-2 bg-accent-info hover:bg-accent-info-strong text-white px-3 py-2 rounded-card font-medium text-sm shadow-card hover:shadow-card-hover transform hover:-translate-y-0.5 transition-all duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-info"
              title="פתח פנייה חדשה"
              aria-label="פתח פנייה חדשה"
            >
              <HelpCircle className="w-3.5 h-3.5 ml-1" />
              <span className="hidden lg:inline">פתח פנייה</span>
            </button>

            {/* User profile button */}
            <button
              onClick={handleUserNameClick}
              aria-current={isActivePage('/profile') ? "page" : undefined}
              aria-label="ניהול פרופיל"
              className={`flex items-center space-x-2 lg:space-x-3 rounded-card px-2 lg:px-3 py-2 transition-all duration-ui cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${isActivePage('/profile')
                  ? 'bg-slate-100 hover:bg-slate-200'
                  : 'bg-slate-50 hover:bg-slate-100'
                }`}
            >
              <div className={`rounded-full p-1.5 ml-2 lg:ml-3 ${user?.user?.role === 'admin' ? 'bg-accent-lecturer' : 'bg-slate-600'}`}>
                {user?.user?.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5 text-white" />
                ) : (
                  <User className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <div className="text-right mr-2 lg:mr-3 hidden lg:block">
                <span className={`font-medium text-sm block ${isActivePage('/profile') ? 'text-slate-900' : 'text-slate-700'
                  }`}>
                  {(user?.user?.fullName || user?.fullName || user?.name || 'משתמש').split(' ')[0]}
                </span>
                {user?.user?.role === 'admin' && (
                  <span className="text-accent-lecturer text-xs font-medium">מנהל</span>
                )}
              </div>
              <Settings className="w-3.5 h-3.5 ml-1 text-slate-500" />
            </button>

            {/* Logout button — danger tokens */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-danger hover:bg-danger-strong text-white px-2 lg:px-3 py-2 rounded-card font-medium text-sm shadow-card hover:shadow-card-hover transform hover:-translate-y-0.5 transition-all duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
              title="יציאה מהמערכת"
              aria-label="יציאה מהמערכת"
            >
              <LogOut className="w-3.5 h-3.5 ml-1" />
              <span className="hidden lg:inline">יציאה</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="bg-slate-100 text-slate-600 p-2 rounded-card hover:bg-slate-200 transition-colors duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-expanded={isMobileMenuOpen}
              aria-label="תפריט ניווט"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation sheet */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md animate-fadeIn motion-reduce:animate-none">
            <div className="px-2 pt-2 pb-3 space-y-2" dir="rtl">

              {/* User info (clickable → profile) */}
              <button
                onClick={() => {
                  handleUserNameClick();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 rounded-card px-4 py-3 mb-4 transition-all duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${isActivePage('/profile')
                    ? 'bg-slate-100'
                    : 'bg-slate-50 hover:bg-slate-100'
                  }`}
              >
                <div className={`rounded-full p-2 ${user?.user?.role === 'admin' ? 'bg-accent-lecturer' : 'bg-slate-600'}`}>
                  {user?.user?.role === 'admin' ? (
                    <Shield className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="text-right mr-3 flex-1">
                  <span className={`font-medium block ${isActivePage('/profile') ? 'text-slate-900' : 'text-slate-700'
                    }`}>
                    שלום, {user?.user?.fullName || user?.fullName || user?.name || 'משתמש'}
                  </span>
                  {user?.user?.role === 'admin' && (
                    <span className="text-accent-lecturer text-sm font-medium">מנהל מערכת</span>
                  )}
                </div>
                <Settings className="w-4 h-4 text-slate-600" />
              </button>

              {/* Navigation items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActivePage(item.path) ? "page" : undefined}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-card font-medium transition-all duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${linkClass(item.path)}`}
                  >
                    <Icon className="w-5 h-5 ml-3" />
                    <span>{item.fullLabel}</span>
                  </Link>
                );
              })}

              {/* Contact and logout — separate rows */}
              <div className="w-full space-y-2 mt-4">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="flex items-center space-x-3 bg-accent-info hover:bg-accent-info-strong text-white px-4 py-3 rounded-card font-medium shadow-card w-full justify-center transition-colors duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-info"
                >
                  <HelpCircle className="w-5 h-5 ml-3" />
                  <span>פתח פנייה</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 bg-danger hover:bg-danger-strong text-white px-4 py-3 rounded-card font-medium shadow-card w-full justify-center transition-colors duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                >
                  <LogOut className="w-5 h-5 ml-3" />
                  <span>יציאה</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        user={user}
      />
    </nav>
  );
};

export default Navbar;
