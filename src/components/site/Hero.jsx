import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";
import "./Hero.css";
import { siteCopy } from "@/siteCopy";

export function Hero({ lang = "en" }) {
  const copy = siteCopy[lang] ?? siteCopy.en;
  const navigate = useNavigate();
  const isRtl = lang === "ar";
  const [i, setI] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, []);

  // Reset quantity when slide changes
  useEffect(() => {
    setQty(1);
  }, [i]);

  const prev = () => setI((v) => (v - 1 + slides.length) % slides.length);
  const next = () => setI((v) => (v + 1) % slides.length);
  const s = copy.hero.slides[i];
  const slides = copy.hero.slides;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("alufuq-cart") || "[]");
    const cartItem = {
      name: s.title,
      price: s.price,
      img: s.image,
      qty: qty,
      size: "1220x2440mm", // default standard
      customSize: "",
      thickness: "18mm",
      grade: "E1 Grade (Standard)"
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
    
    // Sync cart globally and slide open
    window.dispatchEvent(new Event("cart-updated"));
    window.dispatchEvent(new Event("toggle-cart"));
  };

  return (
    <section className="relative min-h-screen pt-28 pb-12 overflow-hidden flex items-center bg-[#181614]">
      <div className="container-x relative w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text content side */}
          <div className={`lg:col-span-6 space-y-4 md:space-y-6 lg:pr-6 text-center ${isRtl ? "lg:text-right" : "lg:text-left"}`}>
            <div key={i} className="space-y-4 md:space-y-6 animate-fade-up">
              <span className="inline-block bg-tan text-white px-4 py-1.5 text-xs font-display tracking-wider uppercase rounded-sm">
                {s.tag}
              </span>
              
              <h1 
                className="font-bebas text-[42px] sm:text-[50px] md:text-[70px] font-[600] text-white leading-none uppercase tracking-wide"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {s.title}
              </h1>
              
              <div
  className={`font-roboto text-[13px] md:text-[14px] font-[400] text-zinc-300 leading-relaxed space-y-1.5 max-w-2xl tracking-wide mx-auto h-[180px] flex flex-col justify-center overflow-hidden ${
    isRtl
      ? "lg:mr-0 lg:ml-auto items-center lg:items-end text-right"
      : "lg:ml-0 lg:mr-auto items-center lg:items-start text-left"
  }`}
>
                {s.description.map((line, idx) => (
                  <div key={idx} className={`flex items-start gap-2 text-zinc-350 text-sm ${isRtl ? "flex-row-reverse text-right" : "flex-row text-left"}`}>
                    <span className="text-tan select-none font-bold text-base leading-none">•</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-3xl font-display font-bold text-tan">
                {s.price}
              </p>
              
              <div className={`flex items-center gap-4 justify-center ${isRtl ? "lg:justify-end" : "lg:justify-start"}`}>
                <button 
                  onClick={handleAddToCart}
                  className="bg-tan text-white hover:bg-tan/90 font-display font-bold tracking-widest text-xs uppercase px-10 h-12 flex items-center justify-center transition duration-300 rounded-sm"
                >
                  {copy.hero.addToCart}
                </button>
                
                {/* Stepper Quantity Counter */}
                <div className="h-12 bg-white text-zinc-950 border border-zinc-200 flex items-center rounded-sm overflow-hidden">
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
              </div>
            </div>
          </div>

          {/* Image side with premium glow and Ken Burns zoom effect */}
          <div className="lg:col-span-6 relative w-full flex justify-center lg:justify-end">
            <div className="absolute -inset-4 bg-tan/10 rounded-full filter blur-3xl opacity-40 animate-pulse pointer-events-none" />
            <div className="w-full max-w-[620px] lg:max-w-none aspect-[4/3] overflow-hidden rounded-sm shadow-[0_20px_50px_rgba(197,160,89,0.15)] border border-zinc-800 relative group/img bg-zinc-950">
              {slides.map((slide, idx) => (
                <img
                  key={idx}
                  src={slide.image}
                  alt={slide.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                    i === idx 
                      ? "opacity-100 scale-100 pointer-events-auto" 
                      : "opacity-0 scale-105 pointer-events-none"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -inset-[1px] border border-tan/30 rounded-sm pointer-events-none group-hover/img:border-tan/60 transition duration-500" />
            </div>
          </div>
        </div>

        {/* Dynamic dots pagination indicator */}
        <div className="mt-16 flex items-center justify-center gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-350 ${
                i === idx ? "w-8 bg-tan" : "w-2.5 bg-zinc-700 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute right-6 bottom-8 hidden md:flex flex-col items-center gap-4 text-tan">
        <ArrowDown className="size-4 animate-bounce text-tan" />
        <span className="text-[10px] tracking-[0.4em] font-display font-bold uppercase [writing-mode:vertical-rl] text-tan">
          {copy.hero.scrollDown}
        </span>
      </div>
    </section>
  );
}
