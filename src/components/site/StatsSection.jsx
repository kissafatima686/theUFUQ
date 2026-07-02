import React from "react";
import { Award, Trees, Users, Truck } from "lucide-react";

export function StatsSection({ lang }) {
  const isRtl = lang === "ar";
  
  const stats = [
    {
      icon: <Award className="size-8 text-tan" />,
      number: "5+",
      label: isRtl ? "سنوات من التميز" : "Years of Excellence",
      desc: isRtl ? "تأسست في عام 2021 ونمت بثبات" : "Established in 2021 with steady growth"
    },
    {
      icon: <Trees className="size-8 text-tan" />,
      number: "150+",
      label: isRtl ? "أخشاب معتمدة" : "Certified Wood Products",
      desc: isRtl ? "ألواح، MDF، وأخشاب عالية الجودة" : "MDF, Plywood, OSB & solid panels"
    },
    {
      icon: <Users className="size-8 text-tan" />,
      number: "500+",
      label: isRtl ? "عميل سعيد ومقاول" : "Satisfied Clients",
      desc: isRtl ? "نخدم المطورين والمقاولين في الإمارات" : "Serving builders & contractors in UAE"
    },
    {
      icon: <Truck className="size-8 text-tan" />,
      number: "10k+",
      label: isRtl ? "طن خشب مورد" : "Tons of Timber Supplied",
      desc: isRtl ? "قدرة توريد سنوية ومخزون ضخم" : "Massive inventory & annual supply capacity"
    }
  ];

  return (
    <section className="py-16 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,160,89,0.04)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="container-x relative">
        <div className="text-center space-y-2 mb-12">
          <p className="text-tan font-display tracking-[0.3em] text-xs uppercase">
            {isRtl ? "إنجازاتنا بالأرقام" : "Our Track Record"}
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground font-display font-bold uppercase">
            {isRtl ? "أرقام تدل على جودتنا" : "Numbers That Define Us"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="group p-6 bg-zinc-900/40 border border-zinc-850 hover:border-tan/30 transition-all duration-300 rounded-sm hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(197,160,89,0.05)] text-center flex flex-col items-center"
            >
              <div className="size-16 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-800 group-hover:border-tan/30 group-hover:scale-110 transition duration-300 mb-4 shadow-inner">
                {stat.icon}
              </div>
              <span className="font-bebas text-4xl sm:text-5xl font-[600] text-tan tracking-wide mb-1 select-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {stat.number}
              </span>
              <h3 className="text-sm font-display tracking-widest uppercase font-bold text-white mb-2">
                {stat.label}
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
