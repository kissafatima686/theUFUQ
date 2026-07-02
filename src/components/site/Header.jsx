import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import "./Header.css";
import { siteCopy } from "@/siteCopy";

export function Header({ lang = "en", onLangChange = () => {} }) {
  const copy = siteCopy[lang] ?? siteCopy.en;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  // Search option states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCartCount = () => {
    const items = localStorage.getItem("alufuq-cart");
    if (items) {
      const parsed = JSON.parse(items);
      const count = parsed.reduce((acc, item) => acc + item.qty, 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    
    loadCartCount();
    window.addEventListener("cart-updated", loadCartCount);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("cart-updated", loadCartCount);
    };
  }, []);

  const getPath = (label) => {
    const l = label.toLowerCase();
    if (l === "home" || l === "الرئيسية") return "/";
    if (l === "shop" || l === "المتجر") return "/#categories";
    if (l === "products" || l === "المنتجات") return "/products";
    if (l === "blog" || l === "المدونة") return "/blog";
    if (l === "about us" || l === "من نحن") return "/about";
    if (l === "contact us" || l === "contact" || l === "تواصل معنا" || l === "تواصل") return "/contact";
    return "/";
  };

  const isRtl = lang === "ar";

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, [location]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-header ${
        scrolled ? "shadow-lg py-1.5" : "py-2.5"
      }`}
    >
      <div className="container-x flex items-center justify-between gap-4 md:gap-6">
        {/* Brand logo - naturally aligns left in LTR, right in RTL */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="Al Ufuq" className="h-14 w-14 md:h-18 md:w-18 object-contain transition-all duration-300" />
          <span className="hidden sm:inline font-display tracking-widest text-sm md:text-base text-white font-bold uppercase">
            {copy.header.brand}
          </span>
        </Link>

        {/* Center Nav - naturally centered and flows RTL/LTR natively */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 mx-auto">
          {copy.header.nav.map((label, i) => {
            const path = getPath(label);
            const isHome = path === "/";
            const isShop = path === "/#categories";
            
            let isActive = false;
            if (isHome) {
              isActive = location.pathname === "/" && !location.hash;
            } else if (isShop) {
              isActive = location.pathname === "/" && location.hash === "#categories";
            } else {
              isActive = location.pathname === path;
            }
            
            const handleLinkClick = () => {
              if (location.pathname === path) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            };

            return (
              <Link
                key={label}
                to={path}
                onClick={handleLinkClick}
                className={`nav-link flex items-center gap-1.5 text-sm xl:text-base font-medium ${
                  isActive ? "active-link" : ""
                }`}
              >
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions - naturally aligns right in LTR, left in RTL */}
        <div className="flex flex-col items-end gap-1.5 pt-1 shrink-0">
          {/* Top row: Cart, Search, User, Hamburger */}
          <div className="flex items-center gap-4 sm:gap-5">
            <button 
              onClick={() => window.dispatchEvent(new Event("toggle-cart"))}
              className="flex items-center gap-2 text-xs sm:text-sm font-display tracking-wider text-white hover:text-tan transition font-bold relative"
            >
              <div className="relative">
                <ShoppingCart className="size-4 sm:size-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-tan text-white text-[9px] font-bold size-4 rounded-full flex items-center justify-center border border-[#181614]">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
            {/* Inline search bar next to the search option */}
            <div className="relative flex items-center">
              <div className={`flex items-center transition-all duration-300 ${searchOpen ? "w-32 sm:w-56 opacity-100 mx-2" : "w-0 opacity-0 overflow-hidden pointer-events-none"}`}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRtl ? "ابحث عن المنتجات..." : "Search products..."}
                  className="bg-zinc-900 border border-zinc-800 focus:border-tan outline-none py-1.5 px-3 text-white rounded-sm text-xs sm:text-sm w-full"
                  autoFocus={searchOpen}
                />
              </div>
              <button 
                aria-label="Search" 
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  if (searchOpen) setSearchQuery("");
                }} 
                className={`text-white hover:text-tan transition shrink-0 ${searchOpen ? "text-tan" : ""}`}
              >
                {searchOpen ? <X className="size-4 sm:size-5" /> : <Search className="size-4 sm:size-5" />}
              </button>

              {/* Compact Floating Results Dropdown Card */}
              {searchOpen && searchQuery.trim() && (
                <div className={`absolute top-full mt-2 w-64 sm:w-72 bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden divide-y divide-zinc-900 max-h-[250px] overflow-y-auto z-50 shadow-2xl ${isRtl ? "left-0" : "right-0"}`}>
                  {copy.products.items
                    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item, idx) => {
                      const masterIdx = copy.products.items.findIndex(p => p.name === item.name);
                      return (
                        <Link
                          key={idx}
                          to={`/product/${masterIdx !== -1 ? masterIdx : 0}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-zinc-900/60 transition"
                        >
                          <img src={item.img} alt={item.name} className="size-8 object-cover rounded-sm bg-zinc-900 shrink-0" />
                          <div className="flex-1 min-w-0 text-left">
                            <p className={`text-xs font-semibold text-white truncate uppercase ${isRtl ? "text-right" : "text-left"}`}>{item.name}</p>
                            <p className={`text-[10px] text-tan font-display font-semibold ${isRtl ? "text-right" : "text-left"}`}>{item.price}</p>
                          </div>
                        </Link>
                      );
                    })}
                  {copy.products.items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="p-3 text-center text-zinc-500 text-[11px] font-display tracking-wider">
                      {isRtl ? "لا توجد نتائج." : "No matching products found."}
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link to="/my-account" aria-label="Account" className="text-white hover:text-tan transition">
              <User className="size-4 sm:size-5" />
            </Link>

            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white hover:text-tan transition"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>

          {/* Languages Selector */}
          <div className="flex items-center gap-1.5">
            <button
              aria-label={copy.headerActions.arabic}
              onClick={() => onLangChange("ar")}
              className={`overflow-hidden rounded-sm transition ${lang === "ar" ? "border border-tan" : "border border-white/10 hover:border-tan"}`}
            >
              <img
                src="https://flagcdn.com/w40/sa.png"
                alt={copy.headerActions.arabic}
                className="block h-3 w-4.5 sm:h-3.5 sm:w-5.5 object-cover"
              />
            </button>
            <button
              aria-label={copy.headerActions.english}
              onClick={() => onLangChange("en")}
              className={`overflow-hidden rounded-sm transition ${lang === "en" ? "border border-tan" : "border border-white/10 hover:border-tan"}`}
            >
              <img
                src="https://flagcdn.com/w40/gb.png"
                alt={copy.headerActions.english}
                className="block h-3 w-4.5 sm:h-3.5 sm:w-5.5 object-cover"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-header border-t border-white/10 py-6 px-8 flex flex-col gap-4 shadow-2xl animate-fade-in">
          {copy.header.nav.map((label, i) => {
            const path = getPath(label);
            const isHome = path === "/";
            const isShop = path === "/#categories";
            
            let isActive = false;
            if (isHome) {
              isActive = location.pathname === "/" && !location.hash;
            } else if (isShop) {
              isActive = location.pathname === "/" && location.hash === "#categories";
            } else {
              isActive = location.pathname === path;
            }
            
            const handleMobileClick = () => {
              setMenuOpen(false);
              if (location.pathname === path) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            };

            return (
              <Link
                key={label}
                to={path}
                onClick={handleMobileClick}
                className={`font-display text-base uppercase tracking-widest py-2 border-b border-white/5 hover:text-tan transition flex items-center justify-between ${
                  isActive ? "text-tan font-bold" : "text-white"
                }`}
              >
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      )}

    </header>
  );
}
