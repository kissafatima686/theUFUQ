import React from "react";
import "./Newsletter.css";
import { siteCopy } from "@/siteCopy";

export function Newsletter({ lang = "en" }) {
  const copy = siteCopy[lang] ?? siteCopy.en;
  const isRtl = lang === "ar";

  return (
    <>
      <section className="py-8 bg-card border-y-4 border-border">
        <div className="container-x grid md:grid-cols-2 gap-8 items-center">
          <h2 className={`text-lg md:text-xl font-display font-bold uppercase tracking-wider text-tan text-center ${isRtl ? "md:text-right" : "md:text-left"}`}>{copy.newsletter.title}</h2>
          <form className="flex gap-2.5 flex-col sm:flex-row">
            <input
              type="email"
              placeholder={copy.newsletter.placeholder}
              className="flex-1 bg-zinc-950 border border-zinc-850 px-4 py-2.5 text-sm text-foreground placeholder:text-zinc-500 focus:outline-none focus:border-tan transition rounded-sm"
            />
            <button type="submit" className="btn-tan px-6 h-10 uppercase tracking-widest text-[11px] font-bold font-display">{copy.newsletter.button}</button>
          </form>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4">
        {["/cabin1.jpg", "/cabin2.jpg", "/cabin3.jpg", "/cabin4.jpg"].map((src, i) => (
          <div key={i} className="aspect-square overflow-hidden">
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover hover-scale"
            />
          </div>
        ))}
      </section>
    </>
  );
}
