import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Heart, Ruler, ShieldCheck, Truck, RefreshCw, ShoppingCart } from "lucide-react";
import { siteCopy } from "@/siteCopy";

// Interactive Image Zoom Component
function ImageZoom({ src, alt }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div 
      className="relative overflow-hidden aspect-[4/3] w-full rounded-sm border border-zinc-800 bg-zinc-900 cursor-zoom-in group"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-150 ${showMagnifier ? 'scale-[2.2]' : 'scale-100'}`}
        style={showMagnifier ? { transformOrigin: `${position.x}% ${position.y}%` } : undefined}
      />
      {!showMagnifier && (
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-display pointer-events-none">
          Hover to Zoom
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage({ lang }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const copy = siteCopy[lang] ?? siteCopy.en;
  const items = copy.products.items;
  const moreItem = copy.products.moreItem;
  
  // Combine all items to find by ID
  const allItems = [...items, moreItem];
  const productIndex = parseInt(id) || 0;
  const p = allItems[productIndex] || allItems[0];

  // Specific timber variations
  const thicknessOptions = ["9mm", "12mm", "15mm", "18mm", "21mm"];
  const sizeOptions = ["1220x2440mm", "1250x2500mm", "Customizable Size"];
  const glueGrades = ["E1 Grade (Standard)", "E2 Grade (Economy)", "E0 Grade (Premium)"];

  const [selectedThickness, setSelectedThickness] = useState(thicknessOptions[3]); // Default 18mm
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]); // Default 1220x2440
  const [customSize, setCustomSize] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(glueGrades[0]);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(p.img);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setActiveImage(p.img);
    // Check wishlist status
    const wishlist = JSON.parse(localStorage.getItem("alufuq-wishlist") || "[]");
    setWishlisted(wishlist.some(item => item.name === p.name));
  }, [p]);

  const cleanPrice = parseFloat(p.price.replace(/[^0-9.]/g, "")) || 500;
  const getCalculatedPrice = () => {
    let priceNum = cleanPrice;
    if (selectedGrade.includes("Premium") || selectedGrade.includes("E0")) {
      priceNum = cleanPrice * 1.15; // +15%
    } else if (selectedGrade.includes("Economy") || selectedGrade.includes("E2")) {
      priceNum = cleanPrice * 0.90; // -10%
    }
    return priceNum;
  };

  const calculatedPrice = getCalculatedPrice();
  const calculatedPriceFormatted = p.price.startsWith("$") ? `$${calculatedPrice.toFixed(2)}` : `${calculatedPrice.toFixed(2)} USD`;
  
  const originalPriceCalculated = (calculatedPrice * 1.25).toFixed(2);
  const originalPriceFormatted = p.price.startsWith("$") ? `$${originalPriceCalculated}` : `${originalPriceCalculated} USD`;

  // Check Auth Helper
  const requireAuth = () => {
    const user = localStorage.getItem("alufuq-user");
    if (!user) {
      navigate("/my-account");
      return false;
    }
    return true;
  };

  // Add to Cart Action
  const handleAddToCart = () => {
    if (selectedSize === "Customizable Size" && !customSize.trim()) {
      alert(isRtl ? "الرجاء إدخال المقاس المطلوب أولاً." : "Please enter your custom size.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("alufuq-cart") || "[]");
    
    const cartItem = {
      name: p.name,
      price: calculatedPriceFormatted,
      img: activeImage,
      qty: qty,
      size: selectedSize,
      customSize: selectedSize === "Customizable Size" ? customSize : "",
      thickness: selectedThickness,
      grade: selectedGrade
    };

    const existingIndex = cart.findIndex(item => 
      item.name === cartItem.name &&
      item.size === cartItem.size &&
      item.customSize === cartItem.customSize &&
      item.thickness === cartItem.thickness &&
      item.grade === cartItem.grade
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty += cartItem.qty;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("alufuq-cart", JSON.stringify(cart));
    
    // Sync cart globally
    window.dispatchEvent(new Event("cart-updated"));
    window.dispatchEvent(new Event("toggle-cart")); // Slide cart drawer open
  };

  // Wishlist Action
  const handleWishlistToggle = () => {
    let wishlist = JSON.parse(localStorage.getItem("alufuq-wishlist") || "[]");
    const isLiked = wishlist.some(item => item.name === p.name);

    if (isLiked) {
      wishlist = wishlist.filter(item => item.name !== p.name);
      setWishlisted(false);
    } else {
      wishlist.push({
        id: productIndex,
        name: p.name,
        price: p.price,
        img: activeImage
      });
      setWishlisted(true);
    }

    localStorage.setItem("alufuq-wishlist", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlist-updated"));
    window.dispatchEvent(new Event("open-wishlist")); // open drawer direct to wishlist
  };

  const handleCustomQuoteClick = (e) => {
    // No login restriction for WhatsApp custom quotes
  };

  const getCustomQuoteLink = () => {
    const text = encodeURIComponent(
      `Hi Al-Ufuq Team! I need a custom design quote for:\n\n` +
      `Product: ${p.name}\n` +
      `Details: [Specify Custom Dimensions / Project Specifications here]\n`
    );
    return `https://wa.me/971555406013?text=${text}`;
  };

  const thumbnails = [
    p.img,
    "/mdf.jpg",
    "/melamine.jpg",
    "/film.jpg"
  ].filter((src, idx, self) => self.indexOf(src) === idx).slice(0, 3);

  const isRtl = lang === "ar";
  const textAlignClass = isRtl ? "text-right" : "text-left";
  const directionClass = isRtl ? "rtl" : "ltr";

  const getDynamicWhatsAppLink = () => {
    const itemSize = selectedSize === "Customizable Size" ? customSize : selectedSize;
    const text = encodeURIComponent(
      isRtl
        ? `مرحباً فريق الوفق! أود الاستفسار عن منتج الأخشاب التالي:\n\n` +
          `المنتج: ${p.name}\n` +
          `السماكة: ${selectedThickness}\n` +
          `المقاس: ${itemSize || "قياسي"}\n` +
          `الفئة: ${selectedGrade}\n` +
          `الكمية المطلوبة: ${qty}\n`
        : `Hi Al Ufuq Team! I would like to inquire about the following timber product:\n\n` +
          `Product: ${p.name}\n` +
          `Thickness: ${selectedThickness}\n` +
          `Size: ${itemSize || "Standard"}\n` +
          `Grade: ${selectedGrade}\n` +
          `Quantity: ${qty}\n`
    );
    return `https://wa.me/971555406013?text=${text}`;
  };

  return (
    <main className="pt-28 pb-12 bg-[#181614] min-h-screen text-white font-roboto" dir={directionClass}>
      <div className="container-x">
        {/* Breadcrumbs */}
        <div className={`flex items-center gap-2 text-zinc-400 text-sm mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <Link to="/" className="hover:text-tan transition">{isRtl ? "الرئيسية" : "Home"}</Link>
          <ChevronRight className="size-4 shrink-0 text-zinc-600" />
          <Link to="/products" className="hover:text-tan transition">{isRtl ? "المنتجات" : "Products"}</Link>
          <ChevronRight className="size-4 shrink-0 text-zinc-600" />
          <span className="text-zinc-200 truncate">{p.name}</span>
        </div>

        {/* Product Detail Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Images */}
          <div className="lg:col-span-6 space-y-4">
            <ImageZoom src={activeImage} alt={p.name} />
            
            {/* Thumbnails */}
            <div className={`flex gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              {thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(thumb)}
                  className={`relative aspect-[4/3] w-24 overflow-hidden rounded-sm border transition bg-zinc-900 ${
                    activeImage === thumb ? "border-tan ring-1 ring-tan" : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <img src={thumb} alt={`${p.name} thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Details */}
          <div className="lg:col-span-6 space-y-4">
            <div className={textAlignClass}>
              <span className="inline-block text-xs font-display tracking-widest text-tan uppercase border border-tan/30 px-2.5 py-1 rounded-sm mb-3">
                {isRtl ? "خشب فاخر" : "Premium Timber"}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-wider text-white">
                {p.name}
              </h1>
              <p className="text-sm text-zinc-400 mt-1 font-mono">
                {isRtl ? "رمز المنتج:" : "Product Code:"} <span className="text-zinc-200">ALU-{p.name.slice(0,3).toUpperCase()}-{100 + productIndex}</span>
              </p>
            </div>

            {/* Price section */}
            <div className={`border-y border-zinc-800 py-4 flex items-baseline gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="text-3xl font-display font-bold text-tan">{calculatedPriceFormatted}</span>
              <span className="text-lg text-zinc-500 line-through font-display font-semibold">
                {originalPriceFormatted}
              </span>
              <span className="bg-emerald-950 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-display font-semibold uppercase tracking-wider">
                {isRtl ? "وفر 20%" : "Save 20%"}
              </span>
            </div>

            <p className={`text-zinc-400 text-sm ${textAlignClass}`}>
              {isRtl 
                ? "الأسعار تشمل الضرائب المحلية. يتم احتساب تكلفة الشحن والتسليم عند تأكيد الطلب."
                : "Taxes included. Shipping and delivery rates calculated upon order confirmation."}
            </p>

            {/* Configurable Specifications */}
            <div className="space-y-4 pt-2">
              {/* Size Select */}
              <div className={textAlignClass}>
                <label className="block text-xs text-zinc-400 font-display tracking-widest uppercase mb-2">
                  {isRtl ? "المقاس القياسي" : "Standard Dimension"}
                </label>
                <div className="relative inline-block w-full max-w-xs">
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 hover:border-tan focus:border-tan transition text-white px-4 py-2.5 pr-10 rounded-sm outline-none cursor-pointer text-sm"
                  >
                    {sizeOptions.map(sz => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Size Text Input */}
              {selectedSize === "Customizable Size" && (
                <div className={`space-y-1.5 animate-fade-in ${textAlignClass}`}>
                  <label className="block text-xs text-zinc-400 font-display tracking-widest uppercase">
                    {isRtl ? "أدخل المقاس المخصص (مثال: 1200x2000 مم)" : "Specify Custom Size (e.g. 1200x2000mm)"}
                  </label>
                  <input
                    type="text"
                    required
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    className="w-full max-w-xs bg-zinc-900 border border-zinc-800 focus:border-tan text-white px-4 py-2.5 rounded-sm outline-none text-sm transition"
                    placeholder="e.g. 1000 x 2200 mm"
                  />
                </div>
              )}

              {/* Thickness Select */}
              <div className={textAlignClass}>
                <label className="block text-xs text-zinc-400 font-display tracking-widest uppercase mb-2">
                  {isRtl ? "السماكة" : "Thickness"}
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {thicknessOptions.map(thk => (
                    <button
                      key={thk}
                      onClick={() => setSelectedThickness(thk)}
                      className={`px-4 py-2 text-sm font-semibold border rounded-sm transition ${
                        selectedThickness === thk 
                          ? "bg-tan border-tan text-white font-bold" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      {thk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glue Grade Select */}
              <div className={textAlignClass}>
                <label className="block text-xs text-zinc-400 font-display tracking-widest uppercase mb-2">
                  {isRtl ? "فئة الغراء والاستدامة" : "Glue & Eco Grade"}
                </label>
                <div className="relative inline-block w-full max-w-xs">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 hover:border-tan focus:border-tan transition text-white px-4 py-2.5 pr-10 rounded-sm outline-none cursor-pointer text-sm"
                  >
                    {glueGrades.map(grd => (
                      <option key={grd} value={grd}>{grd}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className={`flex flex-wrap items-center gap-4 pt-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              {/* Stepper Quantity Counter */}
              <div className="h-12 bg-white text-zinc-950 border border-zinc-200 flex items-center rounded-sm overflow-hidden shrink-0">
                <button 
                  onClick={() => setQty(v => Math.max(1, v - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-full flex items-center justify-center hover:bg-zinc-100 font-bold transition duration-200 select-none text-zinc-700 text-lg"
                >
                  -
                </button>
                <input 
                  type="number"
                  value={qty}
                  min="1"
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 h-full text-center font-display font-bold bg-transparent focus:outline-none border-x border-zinc-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-base"
                />
                <button 
                  onClick={() => setQty(v => v + 1)}
                  aria-label="Increase quantity"
                  className="w-10 h-full flex items-center justify-center hover:bg-zinc-100 font-bold transition duration-200 select-none text-zinc-700 text-lg"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="bg-tan text-white hover:bg-tan/95 font-display font-bold tracking-widest text-xs uppercase px-8 h-12 flex items-center justify-center gap-2 transition duration-300 rounded-sm flex-1 min-w-[200px]"
              >
                <ShoppingCart className="size-4 shrink-0" />
                {isRtl ? "أضف إلى السلة" : "Add to Cart"}
              </button>

              {/* WhatsApp Inquiry Button */}
              <a
                href={getDynamicWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-display font-bold tracking-widest text-xs uppercase px-8 h-12 flex items-center justify-center gap-2 transition duration-300 rounded-sm flex-1 min-w-[200px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="size-4 shrink-0">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                {isRtl ? "استفسار عبر الواتساب" : "Inquire on WhatsApp"}
              </a>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                aria-label="Toggle Wishlist"
                className={`size-12 grid place-items-center rounded-sm border transition shrink-0 ${
                  wishlisted 
                    ? "border-rose-600 bg-rose-950/20 text-rose-500" 
                    : "border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
                }`}
              >
                <Heart className={`size-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Custom Quote Link */}
            <div className={textAlignClass}>
              <a
                href={getCustomQuoteLink()}
                onClick={handleCustomQuoteClick}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-display tracking-widest uppercase text-tan hover:text-white transition"
              >
                <Ruler className="size-4" />
                {isRtl ? "طلب تصميمات مخصصة" : "Request Custom Quote / Design Orders"}
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-400">
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="size-5 text-tan" />
                <span>{isRtl ? "جودة مضمونة 100%" : "100% Certified Wood"}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="size-5 text-tan" />
                <span>{isRtl ? "توصيل سريع بالإمارات" : "Fast UAE-wide Delivery"}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RefreshCw className="size-5 text-tan" />
                <span>{isRtl ? "دعم وتخصيص مرن" : "Flexible Specifications"}</span>
              </div>
            </div>

            {/* Important / Details */}
            <div className={`bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-sm space-y-2 text-sm text-zinc-300 ${textAlignClass}`}>
              <h4 className="font-display tracking-widest uppercase font-bold text-tan">
                {isRtl ? "ملاحظة هامة" : "Important Information"}
              </h4>
              <ul className="list-disc list-inside space-y-1 text-zinc-400 leading-relaxed">
                <li>{isRtl ? "الحد الأدنى لطلب الجملة يختلف حسب فئة المنتج" : "Minimum wholesale quantity varies by product category."}</li>
                <li>{isRtl ? "جميع منتجاتنا مستدامة وصديقة للبيئة" : "All timber sourced from certified sustainable forestry operations."}</li>
                <li>{isRtl ? "تتوفر مستندات الفحص وشهادة المنشأ بناءً على الطلب" : "Inspection certificates and origin reports available upon inquiry."}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
