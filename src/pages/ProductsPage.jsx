import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Eye, Link2 } from "lucide-react";
import { siteCopy } from "@/siteCopy";

const categoriesConfig = {
  en: ["All", "OSB", "MDF", "Film Faced Plywood", "Commercial Plywood", "Panels", "Premium Quality Wood and Timber"],
  ar: ["الكل", "OSB", "MDF", "خشب رقائقي مغطى بالفلم", "خشب أبلاكاش تجاري", "ألواح", "أخشاب وخشب عالي الجودة"]
};

const getCategoryKey = (itemName) => {
  const n = itemName.toLowerCase();
  if (n.includes("osb")) return "OSB";
  if (n.includes("melamine mdf") || n.includes("mdf")) return "MDF";
  if (n.includes("film faced")) return "Film Faced Plywood";
  if (n.includes("birch") || n.includes("commercial")) return "Commercial Plywood";
  if (n.includes("panels") || n.includes("ألواح")) return "Panels";
  return "Premium Quality Wood and Timber";
};

export default function ProductsPage({ lang }) {
  const copy = siteCopy[lang] ?? siteCopy.en;
  const navigate = useNavigate();
  const location = useLocation();
  const allItems = copy.products.items;
  
  const currentCategories = categoriesConfig[lang] || categoriesConfig.en;
  const [selectedCategory, setSelectedCategory] = useState(currentCategories[0]);
  const [likedNames, setLikedNames] = useState([]);

  const loadWishlist = () => {
    const list = JSON.parse(localStorage.getItem("alufuq-wishlist") || "[]");
    setLikedNames(list.map(w => w.name));
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener("wishlist-updated", loadWishlist);
    return () => window.removeEventListener("wishlist-updated", loadWishlist);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catQuery = params.get("category");
    if (catQuery) {
      const queryLower = catQuery.toLowerCase();
      let targetCat = "";
      if (queryLower.includes("mdf")) {
        targetCat = "MDF";
      } else if (queryLower.includes("film faced") || queryLower.includes("رقائقي مغطى")) {
        targetCat = lang === "ar" ? "خشب رقائقي مغطى بالفلم" : "Film Faced Plywood";
      } else if (queryLower.includes("commercial") || queryLower.includes("أبلاكاش تجاري") || queryLower.includes("birch")) {
        targetCat = lang === "ar" ? "خشب أبلاكاش تجاري" : "Commercial Plywood";
      } else if (queryLower.includes("osb")) {
        targetCat = "OSB";
      } else if (queryLower.includes("panel") || queryLower.includes("ألواح")) {
        targetCat = lang === "ar" ? "ألواح" : "Panels";
      } else if (queryLower.includes("quality") || queryLower.includes("timber")) {
        targetCat = lang === "ar" ? "أخشاب وخشب عالي الجودة" : "Premium Quality Wood and Timber";
      }

      if (targetCat) {
        setSelectedCategory(targetCat);
      }
    }
  }, [location.search, lang]);

  const getSelectedCategoryKey = () => {
    const idx = currentCategories.indexOf(selectedCategory);
    if (idx <= 0) return "All";
    return categoriesConfig.en[idx];
  };

  const filterCategoryKey = getSelectedCategoryKey();
  const itemsWithIds = allItems.map((item, idx) => ({ ...item, id: idx }));

  const filteredItems = filterCategoryKey === "All" 
    ? itemsWithIds 
    : itemsWithIds.filter(item => getCategoryKey(item.name) === filterCategoryKey);

  const textAlignClass = lang === "ar" ? "text-right" : "text-left";
  const filterLabel = lang === "ar" ? "تصفية حسب الفئة:" : "Filter by Category:";

  const handleWishlistToggleDirect = (e, item, itemId) => {
    e.preventDefault();
    e.stopPropagation();

    let wishlist = JSON.parse(localStorage.getItem("alufuq-wishlist") || "[]");
    const isLiked = wishlist.some(w => w.name === item.name);

    if (isLiked) {
      wishlist = wishlist.filter(w => w.name !== item.name);
    } else {
      wishlist.push({
        id: itemId,
        name: item.name,
        price: item.price,
        img: item.img
      });
    }

    localStorage.setItem("alufuq-wishlist", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  const handleAddToCartDirect = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    // Add item to cart
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

    // Global events
    window.dispatchEvent(new Event("cart-updated"));
    window.dispatchEvent(new Event("toggle-cart"));
  };

  const handleWhatsAppInquiry = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const isRtl = lang === "ar";
    const text = encodeURIComponent(
      isRtl
        ? `مرحباً فريق الوفق! أود الاستفسار عن المنتج: ${item.name}`
        : `Hi Al Ufuq Team! I would like to inquire about the product: ${item.name}`
    );
    const url = `https://wa.me/971555406013?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="pt-20 pb-12 min-h-screen bg-[#181614]">
      {/* Mini Hero Section */}
      <div 
        className="py-20 border-b border-zinc-900 text-center relative overflow-hidden flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(24, 22, 20, 0.75), rgba(24, 22, 20, 0.8)), url('/cabin2.jpg')" }}
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground uppercase tracking-widest mb-3 z-10 relative">
          {lang === "ar" ? "منتجاتنا" : "Our Products"}
        </h1>
        <div className="flex items-center gap-2 text-xs font-display tracking-widest uppercase text-zinc-300 z-10 relative">
          <Link to="/" className="hover:text-tan transition text-white/95">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
          <span>/</span>
          <span className="text-tan">{lang === "ar" ? "المنتجات" : "Products"}</span>
        </div>
      </div>

      <div className="container-x py-8">
        {/* Responsive Flex layout */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-white/10 pb-6 gap-4">
          <h2 className="text-2xl font-display font-bold text-foreground uppercase tracking-wider text-center md:text-left">
            {lang === "ar" ? "فئات الخشب" : "Timber Categories"}
          </h2>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <label className="text-white text-sm font-display tracking-widest uppercase">{filterLabel}</label>
            <div className="relative">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-zinc-900 border border-zinc-700 hover:border-tan transition text-white px-4 py-2.5 pr-10 rounded-sm outline-none cursor-pointer font-display text-sm tracking-wider"
              >
                {currentCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-tan">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Centering on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((p) => (
            <article key={p.id} className="group product-card flex flex-col">
              <div className="relative overflow-hidden aspect-square rounded-sm w-full bg-zinc-900 mx-auto max-w-[340px] sm:max-w-none">
                <Link to={`/product/${p.id}`}>
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 pointer-events-none" />
                
                {/* Hover actions menu bar */}
                <div className="absolute bottom-0 left-0 w-full h-14 bg-tan text-white flex items-center transition-transform duration-300 translate-y-full group-hover:translate-y-0 z-10">
                  <div className="flex items-center w-full h-full">
                    <Link to={`/product/${p.id}`} aria-label="Quick View" className="h-full w-12 flex items-center justify-center hover:bg-black/15 transition text-white">
                      <Eye className="size-5" />
                    </Link>
                    <div className="h-8 w-px bg-white/20" />
                    <button 
                      onClick={(e) => handleWishlistToggleDirect(e, p, p.id)}
                      aria-label="Add to Wishlist" 
                      className="h-full w-12 flex items-center justify-center hover:bg-black/15 transition text-white"
                    >
                      <Heart className={`size-5 ${likedNames.includes(p.name) ? "fill-white text-white" : ""}`} />
                    </button>
                    <div className="h-8 w-px bg-white/20" />
                    <button 
                      onClick={(e) => handleAddToCartDirect(e, p)}
                      className="flex-1 h-full text-center hover:bg-black/15 transition text-[11px] font-display font-bold tracking-widest uppercase text-white"
                    >
                      {copy.products.addToCart}
                    </button>
                    <div className="h-8 w-px bg-white/20" />
                    <button 
                      onClick={(e) => handleWhatsAppInquiry(e, p)}
                      aria-label="Inquire on WhatsApp"
                      className="h-full w-12 flex items-center justify-center hover:bg-black/15 transition text-white"
                    >
                      <svg className="size-5" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className={`mt-4 space-y-1.5 px-1 text-center sm:${textAlignClass}`}>
                <Link to={`/product/${p.id}`}>
                  <h3 className="font-display font-bold uppercase tracking-wider text-white text-base hover:text-tan transition line-clamp-1">
                    {p.name}
                  </h3>
                </Link>
                <p className="text-tan/90 font-display font-semibold text-sm">{p.price}</p>
              </div>
            </article>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center text-white mt-12 py-12 border border-zinc-800 rounded-sm font-display tracking-wider">
            {lang === "ar" ? "لم يتم العثور على منتجات في هذه الفئة." : "No products found in this category."}
          </div>
        )}
      </div>
    </main>
  );
}
