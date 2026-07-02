import React, { useEffect, useState, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { ChevronUp } from "lucide-react";
import { siteCopy } from "@/siteCopy";

import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ShopPage from "./pages/ShopPage";
import ProductsPage from "./pages/ProductsPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ContactPage from "./pages/ContactPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import MyAccountPage from "./pages/MyAccountPage";
import { CartDrawer } from "./components/site/CartDrawer";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && window.history && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);

      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });

      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.search, location.key]);

  return null;
}

function RevealObserver() {
  const { pathname } = useLocation();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -20px 0px",
      threshold: 0.01,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll(".reveal");
      revealElements.forEach((el) => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

function App() {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("site-lang") === "ar" ? "ar" : "en";
    }

    return "en";
  });

  useEffect(() => {
    window.localStorage.setItem("site-lang", lang);
    document.documentElement.lang = lang === "ar" ? "ar" : "en-GB";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    const loader = document.getElementById("preloader");
    if (loader) {
      // Fade out after a small buffer to let styles load
      const timer = setTimeout(() => {
        loader.classList.add("loaded");
        const hideTimer = setTimeout(() => {
          loader.style.display = "none";
        }, 650); // slightly longer than the 0.6s CSS transition
        return () => clearTimeout(hideTimer);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      dir={lang === "ar" ? "rtl" : "ltr"}
      lang={lang === "ar" ? "ar" : "en-GB"}
    >
      <BrowserRouter>
        <ScrollToTop />
        <SEOWatcher lang={lang} />
        <RevealObserver />
        <Header lang={lang} onLangChange={setLang} />
        <Routes>
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/shop" element={<ShopPage lang={lang} />} />
          <Route path="/products" element={<ProductsPage lang={lang} />} />
          <Route path="/product/:id" element={<ProductDetailPage lang={lang} />} />
          <Route path="/blog" element={<BlogPage lang={lang} />} />
          <Route path="/blog/:id" element={<BlogDetailPage lang={lang} />} />
          <Route path="/about" element={<AboutPage lang={lang} />} />
          <Route path="/contact" element={<ContactPage lang={lang} />} />
          <Route path="/my-account" element={<MyAccountPage lang={lang} />} />
        </Routes>
        <Footer lang={lang} />
        <FloatingWhatsApp lang={lang} />
        <ScrollToTopButton lang={lang} />
        <CartDrawer lang={lang} />
      </BrowserRouter>
    </div>
  );
}

function ScrollToTopButton({ lang }) {
  const [visible, setVisible] = useState(false);
  const isRtl = lang === "ar";

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed z-50 size-11 rounded-full bg-zinc-950 border border-zinc-800 hover:border-tan/85 text-tan hover:text-white transition-all duration-300 shadow-2xl flex items-center justify-center hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(197,160,89,0.25)] bottom-24 ${
        isRtl ? "left-7" : "right-7"
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="size-5" />
    </button>
  );
}

function SEOWatcher({ lang }) {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const isAr = lang === "ar";
    const copy = siteCopy[lang] ?? siteCopy.en;

    let title = isAr
      ? "شركة الأفق | أخشاب ممتازة وألواح خشبية مستدامة دبي"
      : "Al Ufuq | Premium Timber & Sustainable Wood Panels Dubai";

    let desc = isAr
      ? "شركة الأفق هي المورد الرائد لألواح MDF وOSB والخشب الرقائقي التجاري في منطقة الخليج العربي. نوفر أخشاباً مستدامة ومعتمدة."
      : "Al Ufuq is a leading supplier of high-strength MDF, OSB, commercial plywood, and film-faced panels in the GCC region. Source premium wood panels sustainably.";

    if (path === "/products") {
      title = isAr
        ? "كتالوج المنتجات الخشبية والألواح | شركة الأفق"
        : "Premium Wood Products & Timber Catalog | Al Ufuq";
      desc = isAr
        ? "تصفح كتالوج الأخشاب المتاح لدينا بالجملة. يتوفر لدينا MDF وOSB والخشب الرقائقي بمقاسات وسماكات مخصصة للمقاولين في الإمارات."
        : "Browse our extensive catalog of wholesale timber, MDF, OSB, and commercial plywood. Customized sizes and thicknesses available for UAE builders.";
    } else if (path.startsWith("/product/")) {
      const idStr = path.split("/").pop();
      const productIndex = parseInt(idStr) || 0;
      const allItems = [...copy.products.items, copy.products.moreItem];
      const p = allItems[productIndex];
      if (p) {
        title = isAr
          ? `${p.name} | شركة الأفق لتوريد الأخشاب`
          : `${p.name} | Al Ufuq Wholesale Timber`;
        desc = isAr
          ? `احصل على المواصفات والأسعار لمنتج ${p.name}. نوفر خيارات تخصيص وسماكات متنوعة مع توصيل سريع في الإمارات.`
          : `Get specifications, thickness options, and custom quotes for ${p.name}. Premium certified timber delivered UAE-wide.`;
      }
    } else if (path === "/blog") {
      title = isAr
        ? "مدونة الأفق للأخشاب وأخبار قطاع البناء"
        : "Timber Industry Insights & Wood Panel Blog | Al Ufuq";
      desc = isAr
        ? "اقرأ آخر أخبار صناعة الأخشاب ونصائح الخبراء حول ألواح MDF وOSB والخشب الرقائقي من مهندسي شركة الأفق."
        : "Read industry news, sustainable forestry insights, and builders guides on MDF, OSB, and plywood panels from Al Ufuq timber experts.";
    } else if (path.startsWith("/blog/")) {
      const idStr = path.split("/").pop();
      const blogId = parseInt(idStr) || 0;
      const p = (copy.blog.posts || []).find((post) => post.id === blogId);
      if (p) {
        title = isAr ? `${p.title} | مدونة شركة الأفق` : `${p.title} | Al Ufuq Blog`;
        desc = p.excerpt || p.content?.slice(0, 150) || "";
      }
    } else if (path === "/about") {
      title = isAr
        ? "من نحن | شركة الأفق لتوريد الأخشاب في الإمارات"
        : "About Al Ufuq | Sustainable Wood Supplier in UAE";
      desc = isAr
        ? "تعرف على رؤية ورسالة شركة الأفق وقيمنا الأساسية في توريد المنتجات الخشبية والألواح الصديقة للبيئة في دبي والخليج."
        : "Learn about Al Ufuq's mission, vision, and core values. Leading the GCC region in premium timber distribution and eco-friendly wood sourcing.";
    } else if (path === "/contact") {
      title = isAr
        ? "اتصل بنا | شركة الأفق لتوريد الأخشاب دبي"
        : "Contact Al Ufuq | Wholesale Timber & Wood Panels Dubai";
      desc = isAr
        ? "تواصل مع خبراء الأخشاب في شركة الأفق. استفسر عن الأسعار والمواصفات المخصصة وتوصيل الشحنات إلى موقعك."
        : "Get in touch with Al Ufuq timber experts. Inquire about pricing, custom dimensions, and shipping quotes to Nad Al Sheba, Dubai, UAE.";
    } else if (path === "/my-account") {
      title = isAr
        ? "بوابة حسابي | شركة الأفق للأخشاب"
        : "My Account Portal | Al Ufuq Wood Supplier";
      desc = isAr
        ? "سجل دخولك أو أنشئ حساباً جديداً لإدارة طلباتك وسلة المشتريات وقائمة الأمنيات الخاصة بك لدى شركة الأفق."
        : "Login or register to manage your Al Ufuq wholesale timber account. View recent orders, track shipping, and manage your wishlist.";
    }

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", desc);
  }, [location.pathname, lang]);

  return null;
}

export default App;
