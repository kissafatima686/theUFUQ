import React from "react";
import { Link } from "react-router-dom";
import { Blog } from "@/components/site/Blog";

export default function BlogPage({ lang }) {
  const isRtl = lang === "ar";
  
  return (
    <main className="pt-20 min-h-screen bg-[#181614]">
      {/* Mini Hero Section */}
      <div 
        className="py-20 border-b border-zinc-900 text-center relative overflow-hidden flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(24, 22, 20, 0.75), rgba(24, 22, 20, 0.8)), url('/cabin3.jpg')" }}
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground uppercase tracking-widest mb-3 z-10 relative">
          {isRtl ? "المدونة" : "Our Blog"}
        </h1>
        <div className="flex items-center gap-2 text-xs font-display tracking-widest uppercase text-zinc-300 z-10 relative">
          <Link to="/" className="hover:text-tan transition text-white/95">{isRtl ? "الرئيسية" : "Home"}</Link>
          <span>/</span>
          <span className="text-tan">{isRtl ? "المدونة" : "Blog"}</span>
        </div>
      </div>

      <div className="py-6">
        <Blog lang={lang} />
      </div>
    </main>
  );
}
