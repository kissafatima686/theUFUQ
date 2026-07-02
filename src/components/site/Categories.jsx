import React from "react";
import { Link } from "react-router-dom";
import "./Categories.css";
import { siteCopy } from "@/siteCopy";

export function Categories({ lang = "en" }) {
  const copy = siteCopy[lang] ?? siteCopy.en;
  const cats = copy.categories.items;
  const textAlignClass = lang === "ar" ? "text-right" : "text-left";

  const isRtl = lang === "ar";

  return (
    <section className="py-10" style={{ background: "var(--tan)" }}>
      <div className="container-x">
        <h2 className={`text-4xl md:text-5xl text-tan-foreground mb-6 text-center ${isRtl ? "md:text-right" : "md:text-left"}`}>{copy.categories.title}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {cats.map((c) => (
            <Link
              key={c.name}
              to={`/products?category=${encodeURIComponent(c.name)}`}
              className="group block overflow-hidden rounded-sm bg-white shadow-md"
            >
              <div className="w-full aspect-square overflow-hidden bg-zinc-900">
                <img
                  src={c.img}
                  alt={c.name}
                  className="block w-full h-full object-cover"
                  style={{ aspectRatio: "auto 300 / 300" }}
                />
              </div>

              <div className={`bg-white px-4 py-3 border border-zinc-200 border-t-0 ${textAlignClass}`}>
                <h2 className="woocommerce-loop-category__title inline-block font-display font-bold text-zinc-900 tracking-wider text-[13px] sm:text-sm uppercase leading-none transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2">
                  {c.name} <mark className="count bg-transparent text-inherit">({c.count})</mark>
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
