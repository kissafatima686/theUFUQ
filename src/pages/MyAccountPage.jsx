import React, { useState, useEffect } from "react";
import { Mail, Lock, User, LogOut, ShoppingBag, Eye, EyeOff, ShoppingCart, Heart, Award, ShieldCheck } from "lucide-react";

export default function MyAccountPage({ lang = "en" }) {
  const isRtl = lang === "ar";
  
  // Auth states: 'login', 'signup', 'dashboard'
  const [authState, setAuthState] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [user, setUser] = useState(null);

  // Dashboard Active Tab: 'profile', 'orders', 'cart', 'wishlist'
  const [activeTab, setActiveTab] = useState("profile");

  // Dashboard data details
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("alufuq-user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setAuthState("dashboard");
    }
  }, []);

  const loadDashboardData = () => {
    const storedUser = localStorage.getItem("alufuq-user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed && parsed.email) {
        const emailKey = parsed.email.toLowerCase();
        const storedOrders = localStorage.getItem(`orders-${emailKey}`);
        setOrders(storedOrders ? JSON.parse(storedOrders) : []);
      }
    } else {
      setOrders([]);
    }

    const storedCart = localStorage.getItem("alufuq-cart");
    setCartItems(storedCart ? JSON.parse(storedCart) : []);

    const storedWishlist = localStorage.getItem("alufuq-wishlist");
    setWishlistItems(storedWishlist ? JSON.parse(storedWishlist) : []);
  };

  useEffect(() => {
    if (authState === "dashboard" && user) {
      loadDashboardData();

      // Hook up storage triggers
      window.addEventListener("cart-updated", loadDashboardData);
      window.addEventListener("wishlist-updated", loadDashboardData);

      return () => {
        window.removeEventListener("cart-updated", loadDashboardData);
        window.removeEventListener("wishlist-updated", loadDashboardData);
      };
    }
  }, [authState, user]);

  const validateEmail = (emailStr) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(emailStr)) return false;
    
    const parts = emailStr.split('@');
    if (parts.length === 2) {
      const domain = parts[1].toLowerCase();
      const blockedDomains = ["example.com", "test.com", "dummy.com", "invalid.com", "mail.com"];
      if (blockedDomains.includes(domain)) return false;
      
      const typos = ["gamil.com", "gmail.con", "gmial.com", "gmaill.com", "yaho.com", "outlok.com"];
      if (typos.includes(domain)) return false;
    }
    return true;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError(isRtl ? "الرجاء إدخال بريد إلكتروني صالح." : "Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError(isRtl ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل." : "Password must be at least 6 characters.");
      return;
    }

    const storedUser = localStorage.getItem(`user-${email.toLowerCase()}`);
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.password === password) {
        localStorage.setItem("alufuq-user", JSON.stringify(parsed));
        setUser(parsed);
        setAuthState("dashboard");
        setActiveTab("profile");
        setEmail("");
        setPassword("");
        
        window.dispatchEvent(new Event("auth-changed"));
      } else {
        setError(isRtl ? "كلمة المرور غير صحيحة." : "Incorrect password.");
      }
    } else {
      setError(isRtl ? "البريد الإلكتروني غير مسجل." : "Email is not registered.");
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!validateEmail(email)) {
      setError(isRtl ? "الرجاء إدخال بريد إلكتروني صالح وحقيقي." : "Please enter a correct, valid email address.");
      return;
    }
    if (password.length < 6) {
      setError(isRtl ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل." : "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError(isRtl ? "كلمات المرور غير متطابقة." : "Passwords do not match.");
      return;
    }

    const exists = localStorage.getItem(`user-${email.toLowerCase()}`);
    if (exists) {
      setError(isRtl ? "البريد الإلكتروني مسجل بالفعل." : "Email is already registered.");
      return;
    }

    const newUser = { email, password, joinedDate: new Date().toLocaleDateString() };
    localStorage.setItem(`user-${email.toLowerCase()}`, JSON.stringify(newUser));
    localStorage.setItem("alufuq-user", JSON.stringify(newUser));
    
    setUser(newUser);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAuthState("dashboard");
    setActiveTab("profile");
    setSuccessMsg(
      isRtl
        ? "تم إنشاء الحساب بنجاح وتفعيل تسجيل الدخول!"
        : "Account created successfully! You are now logged in."
    );

    window.dispatchEvent(new Event("auth-changed"));
  };

  const handleLogout = () => {
    localStorage.removeItem("alufuq-user");
    setUser(null);
    setAuthState("login");

    window.dispatchEvent(new Event("auth-changed"));
  };

  const moveWishlistToCart = (item, index) => {
    const cart = JSON.parse(localStorage.getItem("alufuq-cart") || "[]");
    const cartItem = {
      name: item.name,
      price: item.price,
      img: item.img,
      qty: 1,
      size: "1220x2440mm",
      customSize: "",
      thickness: "18mm",
      grade: "E1 Grade (Standard)"
    };

    const existingIndex = cart.findIndex(cItem => 
      cItem.name === cartItem.name &&
      cItem.size === cartItem.size &&
      cItem.customSize === cartItem.customSize &&
      cItem.thickness === cartItem.thickness &&
      cItem.grade === cartItem.grade
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty += cartItem.qty;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("alufuq-cart", JSON.stringify(cart));
    
    const updatedWishlist = wishlistItems.filter((_, i) => i !== index);
    localStorage.setItem("alufuq-wishlist", JSON.stringify(updatedWishlist));
    
    window.dispatchEvent(new Event("cart-updated"));
    window.dispatchEvent(new Event("wishlist-updated"));
    loadDashboardData();
  };

  const textConfig = {
    login: {
      title: isRtl ? "تسجيل الدخول" : "Login to Your Account",
      subtitle: isRtl ? "أدخل بياناتك للمتابعة" : "Enter your credentials to manage your account",
      btn: isRtl ? "تسجيل الدخول" : "Login",
      switch: isRtl ? "ليس لديك حساب؟ سجل الآن" : "Don't have an account? Sign Up",
    },
    signup: {
      title: isRtl ? "إنشاء حساب جديد" : "Create a New Account",
      subtitle: isRtl ? "سجل بريدك الإلكتروني وكلمة المرور للمتابعة" : "Register your email and password to manage your account",
      btn: isRtl ? "إنشاء حساب" : "Create Account",
      switch: isRtl ? "لديك حساب بالفعل؟ سجل دخولك" : "Already have an account? Login",
    }
  };

  const t = textConfig[authState] || textConfig.login;
  const directionClass = isRtl ? "rtl" : "ltr";
  const textAlignClass = isRtl ? "text-right" : "text-left";

  return (
    <main className="pt-28 pb-16 min-h-screen bg-[#181614] flex items-center justify-center font-roboto" dir={directionClass}>
      <div className="container-x w-full flex justify-center">
        
        {authState !== "dashboard" ? (
          /* Premium Login/Signup Form Card */
          <div className="w-full max-w-md bg-zinc-900/30 border border-zinc-800 p-8 sm:p-10 rounded-sm shadow-2xl backdrop-blur-md relative overflow-hidden group">
            {/* Soft decorative glow */}
            <div className="absolute -top-24 -right-24 size-48 bg-tan/10 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 size-48 bg-tan/5 rounded-full filter blur-3xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-display font-bold uppercase tracking-wider text-tan">
                  {t.title}
                </h2>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  {t.subtitle}
                </p>
              </div>

              {error && (
                <div className="bg-rose-950/20 border border-rose-800/60 text-rose-450 py-2.5 px-4 rounded-sm text-xs text-center font-medium leading-relaxed">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="bg-emerald-950/20 border border-emerald-800/60 text-emerald-400 py-2.5 px-4 rounded-sm text-xs text-center font-medium leading-relaxed">
                  {successMsg}
                </div>
              )}

              {authState === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className={textAlignClass}>
                    <label className="block text-[11px] uppercase tracking-widest text-zinc-400 mb-1.5 font-display font-semibold">
                      {isRtl ? "البريد الإلكتروني" : "Email Address"}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full bg-zinc-950/80 border border-zinc-850 focus:border-tan/70 focus:ring-1 focus:ring-tan/30 outline-none py-2.5 text-sm text-white rounded-sm transition ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                        placeholder="name@example.com"
                      />
                      <Mail className={`absolute top-3 size-4 text-zinc-500 ${isRtl ? 'right-3' : 'left-3'}`} />
                    </div>
                  </div>

                  <div className={textAlignClass}>
                    <label className="block text-[11px] uppercase tracking-widest text-zinc-400 mb-1.5 font-display font-semibold">
                      {isRtl ? "كلمة المرور" : "Password"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full bg-zinc-950/80 border border-zinc-850 focus:border-tan/70 focus:ring-1 focus:ring-tan/30 outline-none py-2.5 text-sm text-white rounded-sm transition ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                        placeholder="••••••••"
                      />
                      <Lock className={`absolute top-3 size-4 text-zinc-500 ${isRtl ? 'right-3' : 'left-3'}`} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute top-3 text-zinc-500 hover:text-zinc-300 transition ${isRtl ? 'left-3' : 'right-3'}`}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-tan w-full h-11 flex items-center justify-center font-display font-bold uppercase tracking-widest text-xs mt-6">
                    {t.btn}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthState("signup");
                      setError("");
                      setSuccessMsg("");
                      setEmail("");
                      setPassword("");
                    }}
                    className="w-full text-center text-xs text-zinc-400 hover:text-tan transition font-medium pt-2"
                  >
                    {t.switch}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className={textAlignClass}>
                    <label className="block text-[11px] uppercase tracking-widest text-zinc-400 mb-1.5 font-display font-semibold">
                      {isRtl ? "البريد الإلكتروني" : "Email Address"}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full bg-zinc-950/80 border border-zinc-850 focus:border-tan/70 focus:ring-1 focus:ring-tan/30 outline-none py-2.5 text-sm text-white rounded-sm transition ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                        placeholder="name@example.com"
                      />
                      <Mail className={`absolute top-3 size-4 text-zinc-500 ${isRtl ? 'right-3' : 'left-3'}`} />
                    </div>
                  </div>

                  <div className={textAlignClass}>
                    <label className="block text-[11px] uppercase tracking-widest text-zinc-400 mb-1.5 font-display font-semibold">
                      {isRtl ? "كلمة المرور" : "Password"}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full bg-zinc-950/80 border border-zinc-850 focus:border-tan/70 focus:ring-1 focus:ring-tan/30 outline-none py-2.5 text-sm text-white rounded-sm transition ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                        placeholder="•••••••• (Min 6 characters)"
                      />
                      <Lock className={`absolute top-3 size-4 text-zinc-500 ${isRtl ? 'right-3' : 'left-3'}`} />
                    </div>
                  </div>

                  <div className={textAlignClass}>
                    <label className="block text-[11px] uppercase tracking-widest text-zinc-400 mb-1.5 font-display font-semibold">
                      {isRtl ? "تأكيد كلمة المرور" : "Confirm Password"}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full bg-zinc-950/80 border border-zinc-850 focus:border-tan/70 focus:ring-1 focus:ring-tan/30 outline-none py-2.5 text-sm text-white rounded-sm transition ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                        placeholder="••••••••"
                      />
                      <Lock className={`absolute top-3 size-4 text-zinc-500 ${isRtl ? 'right-3' : 'left-3'}`} />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-tan w-full h-11 flex items-center justify-center font-display font-bold uppercase tracking-widest text-xs mt-6"
                  >
                    {t.btn}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthState("login");
                      setError("");
                      setSuccessMsg("");
                      setEmail("");
                      setPassword("");
                    }}
                    className="w-full text-center text-xs text-zinc-400 hover:text-tan transition font-medium pt-2"
                  >
                    {t.switch}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* Premium Tabbed Dashboard Layout */
          <div className="w-full max-w-5xl space-y-6">
            
            {/* Header section with avatar welcome */}
            <div className="bg-zinc-900/20 border border-zinc-800 p-6 rounded-sm shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="size-16 bg-tan/10 border border-tan/30 text-tan rounded-full flex items-center justify-center font-display font-bold text-2xl shadow-inner">
                  {user?.email ? user.email.slice(0, 1).toUpperCase() : "U"}
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-display font-bold uppercase tracking-wider text-white">
                    {isRtl ? "مرحباً بك،" : "Welcome Back,"} <span className="text-tan">{user?.email?.split('@')[0]}</span>
                  </h2>
                  <p className="text-xs text-zinc-450 flex items-center gap-1.5 justify-center md:justify-start">
                    <Mail className="size-3.5" /> {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900 px-3 py-1.5 rounded-sm">
                  <ShieldCheck className="size-4" /> {isRtl ? "حساب موثق" : "Verified Account"}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-zinc-800 hover:border-rose-900/50 hover:bg-rose-950/10 text-zinc-450 hover:text-rose-450 transition text-xs font-display tracking-widest uppercase flex items-center gap-1.5 rounded-sm"
                >
                  <LogOut className="size-3.5" />
                  {isRtl ? "خروج" : "Log Out"}
                </button>
              </div>
            </div>

            {/* Dashboard Workspace Grid */}
            <div className="grid md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Navigation Sidebar */}
              <div className="md:col-span-3 bg-zinc-900/20 border border-zinc-800 p-4 rounded-sm space-y-1 backdrop-blur-sm">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full py-3 px-4 rounded-sm text-xs font-display tracking-widest uppercase font-bold flex items-center gap-3 transition ${
                    activeTab === "profile" 
                      ? "bg-tan text-tan-foreground shadow-md" 
                      : "text-zinc-400 hover:bg-zinc-950/60 hover:text-white"
                  }`}
                >
                  <User className="size-4 shrink-0" />
                  <span>{isRtl ? "الملف الشخصي" : "Profile Details"}</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full py-3 px-4 rounded-sm text-xs font-display tracking-widest uppercase font-bold flex items-center gap-3 transition ${
                    activeTab === "orders" 
                      ? "bg-tan text-tan-foreground shadow-md" 
                      : "text-zinc-400 hover:bg-zinc-950/60 hover:text-white"
                  }`}
                >
                  <ShoppingBag className="size-4 shrink-0" />
                  <span>{isRtl ? "طلباتي الأخيرة" : "Order History"}</span>
                  {orders.length > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ml-auto ${activeTab === "orders" ? "bg-zinc-950 text-white" : "bg-zinc-900 text-zinc-400"}`}>
                      {orders.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("cart")}
                  className={`w-full py-3 px-4 rounded-sm text-xs font-display tracking-widest uppercase font-bold flex items-center gap-3 transition ${
                    activeTab === "cart" 
                      ? "bg-tan text-tan-foreground shadow-md" 
                      : "text-zinc-400 hover:bg-zinc-950/60 hover:text-white"
                  }`}
                >
                  <ShoppingCart className="size-4 shrink-0" />
                  <span>{isRtl ? "سلة التسوق" : "Shopping Cart"}</span>
                  {cartItems.length > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ml-auto ${activeTab === "cart" ? "bg-zinc-950 text-white" : "bg-zinc-900 text-zinc-400"}`}>
                      {cartItems.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`w-full py-3 px-4 rounded-sm text-xs font-display tracking-widest uppercase font-bold flex items-center gap-3 transition ${
                    activeTab === "wishlist" 
                      ? "bg-tan text-tan-foreground shadow-md" 
                      : "text-zinc-400 hover:bg-zinc-950/60 hover:text-white"
                  }`}
                >
                  <Heart className="size-4 shrink-0" />
                  <span>{isRtl ? "قائمة أمنياتي" : "Wishlist"}</span>
                  {wishlistItems.length > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ml-auto ${activeTab === "wishlist" ? "bg-zinc-950 text-white" : "bg-zinc-900 text-zinc-400"}`}>
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Right Column: Tab Content */}
              <div className="md:col-span-9 bg-zinc-900/20 border border-zinc-800 p-6 sm:p-8 rounded-sm shadow-xl backdrop-blur-sm min-h-[300px]">
                
                {/* 1. Profile Details Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-display uppercase tracking-wider text-tan border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <User className="size-5" />
                      {isRtl ? "بيانات الحساب الأساسية" : "Profile Details"}
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                      <div className="bg-zinc-950/60 p-4 border border-zinc-850 rounded-sm">
                        <span className="text-zinc-550 text-xs block mb-1 font-display tracking-widest uppercase">{isRtl ? "البريد الإلكتروني" : "Email Address"}</span>
                        <span className="text-white text-sm font-semibold">{user?.email}</span>
                      </div>

                      <div className="bg-zinc-950/60 p-4 border border-zinc-850 rounded-sm">
                        <span className="text-zinc-550 text-xs block mb-1 font-display tracking-widest uppercase">{isRtl ? "تاريخ الانضمام" : "Joined Date"}</span>
                        <span className="text-white text-sm font-semibold">{user?.joinedDate || "N/A"}</span>
                      </div>

                      <div className="bg-zinc-950/60 p-4 border border-zinc-850 rounded-sm">
                        <span className="text-zinc-550 text-xs block mb-1 font-display tracking-widest uppercase">{isRtl ? "نوع الحساب" : "Account Type"}</span>
                        <span className="text-tan text-sm font-display font-semibold uppercase tracking-wider">{isRtl ? "عميل جملة" : "Wholesale Buyer"}</span>
                      </div>

                      <div className="bg-zinc-950/60 p-4 border border-zinc-850 rounded-sm">
                        <span className="text-zinc-550 text-xs block mb-1 font-display tracking-widest uppercase">{isRtl ? "حالة التحقق" : "Verification Status"}</span>
                        <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="size-4" /> {isRtl ? "موثق" : "Verified"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 bg-zinc-950/30 border border-zinc-850/50 rounded-sm space-y-3 max-w-2xl mt-4">
                      <h4 className="font-display font-bold uppercase tracking-wider text-tan text-sm flex items-center gap-1.5">
                        <Award className="size-4 text-tan" />
                        {isRtl ? "بوابة الأخشاب والجملة" : "Wholesale Timber Desk"}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-roboto">
                        {isRtl 
                          ? "بصفتك عضواً في شركة الأفق، تتوفر لك مواصفات مخصصة وسماكات متعددة من MDF والألواح والخشب الرقائقي. يمكنك إضافة المنتجات إلى السلة وتأكيد الطلب لتلقي عرض سعر شحن مخصص إلى موقع البناء الخاص بك."
                          : "As an Al Ufuq registered buyer, you receive wholesale pricing and customizable options on MDF, OSB, and Plywood panels. Add items to your cart and place an order to automatically receive customized shipping quotes to your job site via WhatsApp."}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. Order History Tab */}
                {activeTab === "orders" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-display uppercase tracking-wider text-tan border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <ShoppingBag className="size-5" />
                      {isRtl ? "سجل طلباتي الأخيرة" : "Recent Orders"}
                    </h3>

                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((ord) => (
                          <div key={ord.orderId} className="bg-zinc-950/50 border border-zinc-850 p-5 rounded-sm space-y-3 relative group">
                            {/* Order Status Badge */}
                            <span className="absolute top-5 right-5 text-[10px] font-display font-bold tracking-widest uppercase bg-amber-950/40 border border-amber-800/50 text-amber-400 px-2.5 py-1 rounded-sm">
                              {isRtl ? "قيد المراجعة" : "In Review"}
                            </span>

                            <div className="space-y-1">
                              <h4 className="text-sm font-display font-bold text-white tracking-wider uppercase">
                                {ord.orderId}
                              </h4>
                              <p className="text-zinc-500 text-[10px]">{ord.date}</p>
                            </div>

                            <div className="border-t border-zinc-900 pt-3 space-y-2.5 text-xs text-zinc-300">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-baseline">
                                  <div className="space-y-0.5">
                                    <span className="text-white font-medium">{item.qty}x {item.name}</span>
                                    <span className="text-zinc-550 block text-[10px]">
                                      {item.thickness && `${item.thickness} | `}{item.size || "Standard"}
                                    </span>
                                  </div>
                                  <span className="text-tan font-display font-bold shrink-0">{item.price}</span>
                                </div>
                              ))}
                            </div>

                            <div className="border-t border-zinc-900 pt-3 flex justify-between items-baseline">
                              <span className="text-xs text-zinc-500 font-display uppercase tracking-widest">{isRtl ? "المجموع المقدر" : "Estimated Total"}</span>
                              <span className="text-base font-display font-bold text-tan">${ord.subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-zinc-850/50 rounded-sm p-8 text-center text-zinc-500 text-sm font-display tracking-wide">
                        {isRtl ? "لا توجد طلبات سابقة مسجلة حتى الآن." : "No orders placed yet."}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Shopping Cart Tab */}
                {activeTab === "cart" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-display uppercase tracking-wider text-tan border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <ShoppingCart className="size-5" />
                      {isRtl ? "عناصر السلة الحالية" : "Current Cart Summary"}
                    </h3>

                    {cartItems.length > 0 ? (
                      <div className="space-y-4">
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {cartItems.map((item, idx) => (
                            <div key={idx} className="flex gap-4 bg-zinc-950/60 p-4 border border-zinc-850 rounded-sm items-center relative">
                              <img src={item.img} alt={item.name} className="size-12 object-cover rounded-sm bg-zinc-900 shrink-0 border border-zinc-850" />
                              <div className="min-w-0 flex-1 space-y-0.5">
                                <p className="text-xs font-semibold text-white truncate uppercase">{item.name}</p>
                                <p className="text-[10px] text-zinc-500">
                                  {isRtl ? "الكمية:" : "Qty:"} <span className="text-zinc-300 font-semibold">{item.qty}</span> | {item.thickness} | {item.size}
                                </p>
                              </div>
                              <span className="text-sm font-display font-bold text-tan shrink-0">{item.price}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-zinc-850 flex flex-wrap gap-4 items-center justify-between">
                          <span className="text-xs text-zinc-550 font-display uppercase tracking-widest">{isRtl ? "هل ترغب في تعديل أو تأكيد الطلب؟" : "Want to adjust quantity or order?"}</span>
                          <button
                            onClick={() => window.dispatchEvent(new Event("toggle-cart"))}
                            className="btn-tan px-6 h-10 text-[11px] font-display font-bold uppercase tracking-widest"
                          >
                            {isRtl ? "عرض تفاصيل السلة الكاملة" : "Open Cart Drawer"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-zinc-850/50 rounded-sm p-8 text-center text-zinc-500 text-sm font-display tracking-wide space-y-3">
                        <p>{isRtl ? "سلة التسوق فارغة حالياً." : "Your cart is currently empty."}</p>
                        <Link to="/products" className="btn-tan inline-block px-5 py-2.5 text-xs font-display tracking-widest">
                          {isRtl ? "تصفح المنتجات" : "Browse Products"}
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Wishlist Tab */}
                {activeTab === "wishlist" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-display uppercase tracking-wider text-tan border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <Heart className="size-5" />
                      {isRtl ? "قائمة رغباتك وأمنياتك" : "My Wishlist"}
                    </h3>

                    {wishlistItems.length > 0 ? (
                      <div className="space-y-3">
                        {wishlistItems.map((item, idx) => (
                          <div key={idx} className="flex gap-4 bg-zinc-950/60 p-4 border border-zinc-850 rounded-sm items-center">
                            <img src={item.img} alt={item.name} className="size-12 object-cover rounded-sm bg-zinc-900 shrink-0 border border-zinc-850" />
                            <div className="min-w-0 flex-1 space-y-1">
                              <p className="text-xs font-semibold text-white truncate uppercase">{item.name}</p>
                              <p className="text-xs text-tan font-bold">{item.price}</p>
                            </div>
                            <button
                              onClick={() => moveWishlistToCart(item, idx)}
                              className="text-[10px] uppercase font-display font-bold tracking-widest bg-tan/10 text-tan hover:bg-tan hover:text-zinc-950 transition border border-tan/30 py-2 px-3.5 rounded-sm flex items-center gap-1.5"
                            >
                              <ShoppingCart className="size-3" />
                              {isRtl ? "نقل للسلة" : "Move to Cart"}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-zinc-850/50 rounded-sm p-8 text-center text-zinc-500 text-sm font-display tracking-wide">
                        {isRtl ? "لا توجد أمنيات مضافة حالياً." : "No items in your wishlist."}
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>

          </div>
        )}
      </div>
    </main>
  );
}
