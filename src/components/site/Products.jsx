import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Eye, Link2 } from "lucide-react";
import "./Products.css";
import { siteCopy } from "@/siteCopy";

export function Products({ lang = "en" }) {
  const copy = siteCopy[lang] ?? siteCopy.en;
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [likedNames, setLikedNames] = useState([]);
  
  const items = copy.products.items;
  const moreItem = copy.products.moreItem;
  const textAlignClass = lang === "ar" ? "text-right" : "text-left";

  const loadWishlist = () => {
    const list = JSON.parse(localStorage.getItem("alufuq-wishlist") || "[]");
    setLikedNames(list.map(w => w.name));
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener("wishlist-updated", loadWishlist);
    return () => window.removeEventListener("wishlist-updated", loadWishlist);
  }, []);

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
    window.dispatchEvent(new Event("open-wishlist")); // open drawer direct to wishlist
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

    // Global dispatch events
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
    <section className="py-12 bg-[#181614]">
      <div className="container-x">
        {/* Title */}
        <div className="text-center space-y-2 mb-6">
          <p className="text-tan font-display tracking-[0.3em] text-sm uppercase">{copy.products.featureLabel}</p>
          <h2 className="text-4xl md:text-5xl text-foreground animate-fade-up">{copy.products.title}</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((p, idx) => (
            <article key={idx} className="group product-card flex flex-col">
              <div className="relative overflow-hidden aspect-square rounded-sm w-full bg-zinc-900">
                <Link to={`/product/${idx}`}>
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 pointer-events-none" />

                {/* Hover actions */}
                <div className="absolute bottom-0 left-0 w-full h-14 bg-tan text-white flex items-center transition-transform duration-300 translate-y-full group-hover:translate-y-0 z-10">
                  <div className="flex items-center w-full h-full">
                    <Link to={`/product/${idx}`} aria-label="Quick View" className="h-full w-12 flex items-center justify-center hover:bg-black/15 transition text-white">
                      <Eye className="size-5" />
                    </Link>
                    <div className="h-8 w-px bg-white/20" />
                    <button 
                      onClick={(e) => handleWishlistToggleDirect(e, p, idx)}
                      aria-label="Add to Wishlist" 
                      className={`h-full w-12 flex items-center justify-center hover:bg-black/15 transition text-white ${
                        likedNames.includes(p.name) ? "text-rose-500" : ""
                      }`}
                    >
                      <Heart className={`size-5 ${likedNames.includes(p.name) ? 'fill-current text-rose-500' : ''}`} />
                    </button>
                    <div className="h-8 w-px bg-white/20" />
                    <button 
                      onClick={(e) => handleWhatsAppInquiry(e, p)} 
                      aria-label="Inquire on WhatsApp" 
                      className="h-full w-12 flex items-center justify-center hover:bg-black/15 transition text-white"
                      title={lang === "ar" ? "استفسار عبر الواتساب" : "Inquire on WhatsApp"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="size-5 text-[#25D366]">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                      </svg>
                    </button>
                    <div className="h-8 w-px bg-white/20" />
                    <button 
                      onClick={(e) => handleAddToCartDirect(e, p)} 
                      className="flex-1 h-full flex items-center justify-center font-display font-bold tracking-widest text-[13px] hover:bg-black/15 transition text-white"
                    >
                      {copy.products.addToCart}
                    </button>
                  </div>
                </div>
              </div>

              {/* Title & Info */}
              <div className={`pt-4 space-y-1 ${textAlignClass}`}>
                <Link to={`/product/${idx}`}>
                  <h3 className="text-[17px] font-display font-bold text-tan tracking-wider uppercase transition-colors duration-300 group-hover:text-white">
                    {p.name}
                  </h3>
                </Link>
                <p className="text-tan/90 font-display font-semibold text-sm">{p.price}</p>
              </div>
            </article>
          ))}

          {showMore && (
            <article className="group product-card flex flex-col">
              <div className="relative overflow-hidden aspect-square rounded-sm w-full bg-zinc-900">
                <Link to={`/product/${items.length}`}>
                  <img
                    src={moreItem.img}
                    alt={moreItem.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-14 bg-tan text-white flex items-center transition-transform duration-300 translate-y-full group-hover:translate-y-0 z-10">
                  <div className="flex items-center w-full h-full">
                    <Link to={`/product/${items.length}`} aria-label="Quick View" className="h-full w-12 flex items-center justify-center hover:bg-black/15 transition text-white">
                      <Eye className="size-5" />
                    </Link>
                    <div className="h-8 w-px bg-white/20" />
                    <button 
                      onClick={(e) => handleWishlistToggleDirect(e, moreItem, items.length)}
                      aria-label="Add to Wishlist" 
                      className={`h-full w-12 flex items-center justify-center hover:bg-black/15 transition text-white ${
                        likedNames.includes(moreItem.name) ? "text-rose-500" : ""
                      }`}
                    >
                      <Heart className={`size-5 ${likedNames.includes(moreItem.name) ? 'fill-current text-rose-500' : ''}`} />
                    </button>
                    <div className="h-8 w-px bg-white/20" />
                    <button 
                      onClick={(e) => handleWhatsAppInquiry(e, moreItem)} 
                      aria-label="Inquire on WhatsApp" 
                      className="h-full w-12 flex items-center justify-center hover:bg-black/15 transition text-white"
                      title={lang === "ar" ? "استفسار عبر الواتساب" : "Inquire on WhatsApp"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="size-5 text-[#25D366]">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                      </svg>
                    </button>
                    <div className="h-8 w-px bg-white/20" />
                    <button 
                      onClick={(e) => handleAddToCartDirect(e, moreItem)} 
                      className="flex-1 h-full flex items-center justify-center font-display font-bold tracking-widest text-[13px] hover:bg-black/15 transition text-white"
                    >
                      {copy.products.addToCart}
                    </button>
                  </div>
                </div>
              </div>

              <div className={`pt-4 space-y-1 ${textAlignClass}`}>
                <Link to={`/product/${items.length}`}>
                  <h3 className="text-[17px] font-display font-bold text-tan tracking-wider uppercase transition-colors duration-300 group-hover:text-white">
                    {moreItem.name}
                  </h3>
                </Link>
                <p className="text-tan/90 font-display font-semibold text-sm">{moreItem.price}</p>
              </div>
            </article>
          )}
        </div>

        {!showMore && (
          <div className="mt-14 text-center">
            <button className="btn-tan" onClick={() => setShowMore(true)}>
              {copy.products.loadMore}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
