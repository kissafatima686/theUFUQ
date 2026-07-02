import React from "react";
import { Link } from "react-router-dom";
import "./About.css";
import { siteCopy } from "@/siteCopy";

export function About({ lang = "en" }) {
  const copy = siteCopy[lang] ?? siteCopy.en;
  const isRtl = lang === "ar";

  return (
    <section className="py-12 bg-background">
      <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
        <div
          className={`overflow-hidden max-w-[480px] w-full mx-auto rounded-sm border border-zinc-800 shadow-2xl ${
            isRtl ? "lg:mr-0 lg:ml-auto" : "lg:ml-0 lg:mr-auto"
          }`}
        >
          <img
            src="/house.jpg"
            alt="Wooden house construction model"
            className="w-full h-full object-cover hover-scale"
          />
        </div>
        <div
  className={`flex flex-col justify-center h-full space-y-6 text-center ${
    isRtl ? "lg:text-right" : "lg:text-left"
  }`}
>
          <h2 className="text-4xl md:text-5xl text-foreground font-display font-bold uppercase">{copy.about.title}</h2>
          <p className="text-zinc-400 leading-relaxed text-sm md:text-base">{copy.about.paragraphs[0]}</p>
          <p className="text-zinc-400 leading-relaxed text-sm md:text-base">{copy.about.paragraphs[1]}</p>
          <Link 
            to="/contact" 
            className={`btn-tan mx-auto block w-fit ${isRtl ? "lg:mr-0 lg:ml-auto" : "lg:ml-0 lg:mr-auto"}`}
          >
            {copy.about.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
