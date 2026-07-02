import React from "react";
import { Eye, Target } from "lucide-react";
import "./VisionMission.css";

const copy = {
  en: {
    visionTitle: "Our Vision",
    visionText: "To be the leading global supplier of premium timber and sustainable wood panels, recognized for exceptional quality, client trust, and environmental stewardship in the GCC region.",
    missionTitle: "Our Mission",
    missionText: "To source, process, and deliver high-strength wood products that empower builders, designers, and manufacturers, while maintaining strict eco-friendly forestry standards and reliable customer care."
  },
  ar: {
    visionTitle: "رؤيتنا",
    visionText: "أن نكون المورد العالمي الرائد للأخشاب الممتازة والألواح الخشبية المستدامة، والمعروفين بالجودة الاستثنائية وثقة العملاء والإشراف البيئي في منطقة الخليج العربي.",
    missionTitle: "رسالتنا",
    missionText: "توفير ومعالجة وتسليم منتجات خشبية عالية القوة تمكن البنائين والمصممين والمصنعين، مع الحفاظ على معايير الغابات الصارمة الصديقة للبيئة ورعاية العملاء الموثوقة."
  }
};

export function VisionMission({ lang = "en" }) {
  const isRtl = lang === "ar";
  const s = copy[lang] ?? copy.en;
  const textAlignClass = isRtl ? "text-right" : "text-left";
  const alignClass = isRtl ? "items-center md:items-end text-right" : "items-center md:items-start text-left";

  return (
    <section className="py-14 vision-mission-section relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.04)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="container-x relative">
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {/* Vision Card */}
          <div className={`p-8 vision-mission-card border rounded-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(197,160,89,0.1)] relative group flex flex-col ${alignClass}`}>
            <div className="size-14 rounded-full vision-mission-icon-container flex items-center justify-center border group-hover:scale-110 transition-all duration-300 mb-5 shadow-inner">
              <Eye className="size-6 text-tan vision-mission-icon transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-display tracking-wider uppercase font-bold text-tan group-hover:text-white transition-colors duration-300 mb-3">
              {s.visionTitle}
            </h3>
            <p className="text-zinc-250 leading-relaxed text-sm md:text-base font-roboto">
              {s.visionText}
            </p>
          </div>

          {/* Mission Card */}
          <div className={`p-8 vision-mission-card border rounded-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(197,160,89,0.1)] relative group flex flex-col ${alignClass}`}>
            <div className="size-14 rounded-full vision-mission-icon-container flex items-center justify-center border group-hover:scale-110 transition-all duration-300 mb-5 shadow-inner">
              <Target className="size-6 text-tan vision-mission-icon transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-display tracking-wider uppercase font-bold text-tan group-hover:text-white transition-colors duration-300 mb-3">
              {s.missionTitle}
            </h3>
            <p className="text-zinc-250 leading-relaxed text-sm md:text-base font-roboto">
              {s.missionText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
