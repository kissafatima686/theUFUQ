import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2, ShoppingBag, Heart, ShoppingCart } from "lucide-react";
import "./CartDrawer.css";

export function CartDrawer({ lang = "en" }) {
  const isRtl = lang === "ar";
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("cart"); // 'cart' or 'wishlist'
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const loadCart = () => {
    const items = localStorage.getItem("alufuq-cart");
    setCartItems(items ? JSON.parse(items) : []);
  };

  const loadWishlist = () => {
    const items = localStorage.getItem("alufuq-wishlist");
    setWishlistItems(items ? JSON.parse(items) : []);
  };

  useEffect(() => {
    loadCart();
    loadWishlist();

    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleUpdateCart = () => loadCart();
    const handleUpdateWishlist = () => loadWishlist();
    const handleOpenWishlist = () => {
      setActiveTab("wishlist");
      setIsOpen(true);
    };

    window.addEventListener("toggle-cart", handleToggle);
    window.addEventListener("cart-updated", handleUpdateCart);
    window.addEventListener("wishlist-updated", handleUpdateWishlist);
    window.addEventListener("open-wishlist", handleOpenWishlist);

    return () => {
      window.removeEventListener("toggle-cart", handleToggle);
      window.removeEventListener("cart-updated", handleUpdateCart);
      window.removeEventListener("wishlist-updated", handleUpdateWishlist);
      window.removeEventListener("open-wishlist", handleOpenWishlist);
    };
  }, []);

  const updateQuantity = (index, delta) => {
    const updated = [...cartItems];
    updated[index].qty = Math.max(1, updated[index].qty + delta);
    localStorage.setItem("alufuq-cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    localStorage.setItem("alufuq-cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeWishlistItem = (index) => {
    const updated = wishlistItems.filter((_, i) => i !== index);
    localStorage.setItem("alufuq-wishlist", JSON.stringify(updated));
    setWishlistItems(updated);
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  const moveWishlistToCart = (item, index) => {
    // Add item to cart with default specifications
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
    
    // Remove from wishlist
    const updatedWishlist = wishlistItems.filter((_, i) => i !== index);
    localStorage.setItem("alufuq-wishlist", JSON.stringify(updatedWishlist));
    
    // Dispatch events
    window.dispatchEvent(new Event("cart-updated"));
    window.dispatchEvent(new Event("wishlist-updated"));
    
    // Switch active tab to cart so they see it
    setActiveTab("cart");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const priceVal = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      return acc + priceVal * item.qty;
    }, 0);
  };

  const handleWhatsAppOrder = () => {
    const user = localStorage.getItem("alufuq-user");

    let messageText = isRtl 
      ? `مرحباً فريق الوفق! أود تقديم طلب شراء الأخشاب التالي:\n\n`
      : `Hi Al Ufuq Team! I would like to place an order for the following timber products:\n\n`;

    cartItems.forEach((item, idx) => {
      const itemSize = item.size === "Customizable Size" ? item.customSize : item.size;
      messageText += `${idx + 1}. ${item.name}\n`;
      messageText += `   ${isRtl ? "الكمية:" : "Qty:"} ${item.qty}\n`;
      messageText += `   ${isRtl ? "المقاس:" : "Size:"} ${itemSize || "Standard"}\n`;
      messageText += `   ${isRtl ? "السماكة:" : "Thickness:"} ${item.thickness || "N/A"}\n`;
      if (item.grade) {
        messageText += `   ${isRtl ? "درجة الغراء:" : "Glue Grade:"} ${item.grade}\n`;
      }
      messageText += `   ${isRtl ? "السعر:" : "Price:"} ${item.price}\n\n`;
    });

    const subtotal = calculateSubtotal();
    messageText += `-------------------\n`;
    messageText += `${isRtl ? "المجموع الكلي المقدر:" : "Estimated Total:"} $${subtotal.toFixed(2)}\n\n`;
    messageText += isRtl ? `الرجاء تأكيد الطلب وحساب كلفة الشحن.` : `Please confirm my order details and delivery rates.`;

    const encodedText = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/971555406013?text=${encodedText}`;

    // Save order history to user account
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser && parsedUser.email) {
        const orderEmail = parsedUser.email.toLowerCase();
        const existingOrders = JSON.parse(localStorage.getItem(`orders-${orderEmail}`) || "[]");
        const newOrder = {
          orderId: `ALU-${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date().toLocaleDateString(),
          items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            qty: item.qty,
            size: item.size === "Customizable Size" ? item.customSize : item.size,
            thickness: item.thickness,
            grade: item.grade
          })),
          subtotal: calculateSubtotal()
        };
        existingOrders.unshift(newOrder);
        localStorage.setItem(`orders-${orderEmail}`, JSON.stringify(existingOrders));
      }
    }

    localStorage.removeItem("alufuq-cart");
    setCartItems([]);
    window.dispatchEvent(new Event("cart-updated"));
    setIsOpen(false);

    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Slide-out Drawer */}
      <div 
        className={`fixed top-0 bottom-0 z-[60] w-full max-w-md bg-[#181614] border-zinc-800 shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : isRtl ? "-translate-x-full" : "translate-x-full"
        } ${isRtl ? "left-0 border-r" : "right-0 border-l"}`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header Drawer */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-tan" />
            <h3 className="font-display tracking-widest text-tan uppercase text-base font-bold">
              {isRtl ? "سلة وأمنيات" : "Cart & Wishlist"}
            </h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white transition p-1"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-800/80 bg-zinc-950/40 text-sm font-display tracking-wider font-semibold">
          <button
            onClick={() => setActiveTab("cart")}
            className={`flex-1 py-3 text-center border-b-2 transition flex items-center justify-center gap-2 ${
              activeTab === "cart" 
                ? "border-tan text-tan bg-[#1c1a18]" 
                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
            }`}
          >
            <ShoppingCart className="size-4" />
            <span>{isRtl ? "سلتي" : "My Cart"}</span>
            {cartItems.length > 0 && (
              <span className="bg-tan text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                {cartItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex-1 py-3 text-center border-b-2 transition flex items-center justify-center gap-2 ${
              activeTab === "wishlist" 
                ? "border-tan text-tan bg-[#1c1a18]" 
                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
            }`}
          >
            <Heart className="size-4" />
            <span>{isRtl ? "أمنياتي" : "Wishlist"}</span>
            {wishlistItems.length > 0 && (
              <span className="bg-tan text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                {wishlistItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Dynamic Tab Content rendering */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* CART TAB DISPLAY */}
          {activeTab === "cart" && (
            cartItems.length > 0 ? (
              cartItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-4 bg-zinc-950 p-4 border border-zinc-900 rounded-sm relative group`}
                >
                  <button
                    onClick={() => removeItem(idx)}
                    className={`absolute top-2 text-zinc-500 hover:text-rose-500 transition p-1 ${
                      isRtl ? "left-2" : "right-2"
                    }`}
                    aria-label="Remove item"
                  >
                    <Trash2 className="size-4" />
                  </button>

                  <div className="size-16 rounded-sm overflow-hidden bg-zinc-900 shrink-0">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-1 min-w-0 pr-6 flex-1">
                    <h4 className="text-sm font-display font-semibold uppercase text-white truncate">
                      {item.name}
                    </h4>
                    <div className="text-[11px] text-zinc-400 space-y-0.5">
                      <p>
                        {isRtl ? "المقاس:" : "Size:"}{" "}
                        <span className="text-zinc-200">
                          {item.size === "Customizable Size" ? item.customSize : item.size}
                        </span>
                      </p>
                      <p>
                        {isRtl ? "السماكة:" : "Thickness:"} <span className="text-zinc-200">{item.thickness}</span>
                      </p>
                      {item.grade && (
                        <p>
                          {isRtl ? "الفئة:" : "Grade:"} <span className="text-zinc-200">{item.grade}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-zinc-800 bg-zinc-900 rounded-sm h-7 overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(idx, -1)}
                          className="px-2 h-full text-zinc-400 hover:bg-zinc-800 font-bold transition text-xs"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-semibold text-white">{item.qty}</span>
                        <button 
                          onClick={() => updateQuantity(idx, 1)}
                          className="px-2 h-full text-zinc-400 hover:bg-zinc-800 font-bold transition text-xs"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-display font-bold text-tan">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-12">
                <ShoppingBag className="size-12 text-zinc-700 mb-3" />
                <p className="text-sm font-display uppercase tracking-wider">
                  {isRtl ? "سلتك فارغة" : "Your cart is empty"}
                </p>
              </div>
            )
          )}

          {/* WISHLIST TAB DISPLAY */}
          {activeTab === "wishlist" && (
            wishlistItems.length > 0 ? (
              wishlistItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-4 bg-zinc-950 p-4 border border-zinc-900 rounded-sm relative group`}
                >
                  <button
                    onClick={() => removeWishlistItem(idx)}
                    className={`absolute top-2 text-zinc-500 hover:text-rose-500 transition p-1 ${
                      isRtl ? "left-2" : "right-2"
                    }`}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="size-4" />
                  </button>

                  <div className="size-16 rounded-sm overflow-hidden bg-zinc-900 shrink-0">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-1 min-w-0 pr-6 flex-1">
                    <h4 className="text-sm font-display font-semibold uppercase text-white truncate">
                      {item.name}
                    </h4>
                    <span className="text-sm font-display font-bold text-tan block">{item.price}</span>
                    
                    {/* Add to Cart button from wishlist */}
                    <div className="pt-2">
                      <button
                        onClick={() => moveWishlistToCart(item, idx)}
                        className="text-[10px] uppercase font-display font-bold tracking-widest bg-tan/10 text-tan hover:bg-tan hover:text-zinc-950 transition border border-tan/30 py-1.5 px-3 rounded-sm flex items-center gap-1.5"
                      >
                        <ShoppingCart className="size-3" />
                        {isRtl ? "نقل إلى السلة" : "Move to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-12">
                <Heart className="size-12 text-zinc-700 mb-3" />
                <p className="text-sm font-display uppercase tracking-wider">
                  {isRtl ? "قائمة أمنياتك فارغة" : "Your wishlist is empty"}
                </p>
              </div>
            )
          )}

        </div>

        {/* Footer Checkout Summary */}
        {activeTab === "cart" && cartItems.length > 0 && (
          <div className="p-6 border-t border-zinc-800 bg-zinc-950/80 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-zinc-400 font-display uppercase tracking-wider">
                {isRtl ? "المجموع المقدر:" : "Subtotal:"}
              </span>
              <span className="text-2xl font-display font-bold text-tan">
                ${calculateSubtotal().toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-display font-bold tracking-widest text-xs uppercase h-12 flex items-center justify-center gap-2 transition duration-300 rounded-sm shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="size-4">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
              {isRtl ? "تأكيد الطلب عبر الواتساب" : "Confirm Order on WhatsApp"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
