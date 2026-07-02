import React from "react";
import { Link } from "react-router-dom";
import { About } from "@/components/site/About";
import { Award, Trees, Users } from "lucide-react";
import { StatsSection } from "@/components/site/StatsSection";

function CoreValuesSection({ lang }) {
  const isRtl = lang === "ar";
  
  const values = [
    {
      icon: <Award className="size-6 text-tan" />,
      title: isRtl ? "جودة ممتازة" : "Premium Quality",
      desc: isRtl 
        ? "نوفر فقط أفضل منتجات الأخشاب والألواح المعتمدة عالمياً والتي تتميز بالقوة والمتانة القصوى." 
        : "We source and process only the finest wood panels and logs certified to meet global architectural standards."
    },
    {
      icon: <Trees className="size-6 text-tan" />,
      title: isRtl ? "الاستدامة والبيئة" : "Eco-Sustainability",
      desc: isRtl 
        ? "جميع منتجاتنا مستدامة بنسبة 100% ومصنوعة ومستوردة من مصادر تدعم إعادة التشجير الصديق للبيئة." 
        : "100% of our products come from certified eco-friendly sources committed to reforestation cycles."
    },
    {
      icon: <Users className="size-6 text-tan" />,
      title: isRtl ? "التركيز على العميل" : "Customer Focus",
      desc: isRtl 
        ? "نهتم بتفاصيل كل طلب وتقديم دعم مرن واستشارات تسعير وتخصيص دقيق لضمان نجاح مشروعك." 
        : "Dedicated logistics, customized sizing, and responsive support ensure your projects finish successfully and on time."
    }
  ];

  return (
    <section className="py-16 bg-[#181614] border-t border-zinc-900 relative overflow-hidden">
      <div className="container-x relative">
        <div className="text-center space-y-2 mb-12">
          <p className="text-tan font-display tracking-[0.3em] text-xs uppercase">
            {isRtl ? "قيمنا الأساسية" : "Our Core Values"}
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground font-display font-bold uppercase">
            {isRtl ? "لماذا تختار شركة الوفق؟" : "Why Choose Al Ufuq?"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, idx) => (
            <div 
              key={idx} 
              className="p-6 bg-zinc-900/20 border border-zinc-850 hover:border-tan/30 transition-all duration-300 rounded-sm hover:-translate-y-1 hover:shadow-2xl flex flex-col"
            >
              <div className="size-12 rounded-sm bg-zinc-950 flex items-center justify-center border border-zinc-800 mb-4">
                {v.icon}
              </div>
              <h3 className="text-lg font-display tracking-widest uppercase font-bold text-white mb-2">
                {v.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-roboto">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage({ lang }) {
  const isRtl = lang === "ar";
  
  return (
    <main className="pt-20 min-h-screen bg-[#181614]">
      {/* Mini Hero Section */}
      <div 
        className="py-20 border-b border-zinc-900 text-center relative overflow-hidden flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(24, 22, 20, 0.75), rgba(24, 22, 20, 0.8)), url('/cabin1.jpg')" }}
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground uppercase tracking-widest mb-3 z-10 relative">
          {isRtl ? "من نحن" : "About Us"}
        </h1>
        <div className="flex items-center gap-2 text-xs font-display tracking-widest uppercase text-zinc-300 z-10 relative">
          <Link to="/" className="hover:text-tan transition text-white/95">{isRtl ? "الرئيسية" : "Home"}</Link>
          <span>/</span>
          <span className="text-tan">{isRtl ? "من نحن" : "About Us"}</span>
        </div>
      </div>

      <div className="py-6">
        <About lang={lang} />
      </div>
      <StatsSection lang={lang} />
      <CoreValuesSection lang={lang} />
    </main>
  );
}
