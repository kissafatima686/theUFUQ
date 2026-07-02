import React from "react";
import { Hero } from "@/components/site/Hero";
import { Products } from "@/components/site/Products";
import { VisionMission } from "@/components/site/VisionMission";
import { Categories } from "@/components/site/Categories";
import { About } from "@/components/site/About";
import { Newsletter } from "@/components/site/Newsletter";
import { StatsSection } from "@/components/site/StatsSection";

export default function Home({ lang }) {
  return (
    <main>
      <Hero lang={lang} />
      <div className="reveal" id="featured-products">
        <Products lang={lang} />
      </div>
      <div className="reveal">
        <VisionMission lang={lang} />
      </div>
      <div className="reveal" id="categories">
        <Categories lang={lang} />
      </div>
      <div className="reveal">
        <About lang={lang} />
      </div>
      <div className="reveal">
        <Newsletter lang={lang} />
      </div>
      <div className="reveal">
        <StatsSection lang={lang} />
      </div>
    </main>
  );
}
