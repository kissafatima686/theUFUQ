import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, Globe, MapPin } from "lucide-react";
import "./Footer.css";
import { siteCopy } from "@/siteCopy";

export function Footer({ lang = "en" }) {
  const copy = siteCopy[lang] ?? siteCopy.en;

  const getPath = (label) => {
    const l = label.toLowerCase();
    if (l === "home" || l === "الرئيسية") return "/";
    if (l === "shop" || l === "المتجر") return "/#featured-products";
    if (l === "products" || l === "المنتجات") return "/products";
    if (l === "blog" || l === "المدونة") return "/blog";
    if (l === "about us" || l === "من نحن") return "/about";
    if (l === "contact us" || l === "contact" || l === "تواصل معنا" || l === "تواصل") return "/contact";
    if (l === "checkout" || l === "الدفع") return "/#featured-products";
    if (l === "my account" || l === "account" || l === "حسابي") return "/my-account";
    return "/";
  };

  const isRtl = lang === "ar";
  const responsiveTextAlign = isRtl ? "text-center md:text-right" : "text-center md:text-left";

  return (
    <footer className="bg-card border-t-4 border-border text-white font-roboto">
      <div className="container-x py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className={`space-y-4 ${responsiveTextAlign}`}>
          <h3 className="font-display tracking-widest text-tan uppercase text-lg font-bold">{copy.footer.company}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto md:mx-0">{copy.footer.description}</p>
        </div>

        <div className={`space-y-4 ${responsiveTextAlign}`}>
          <h3 className="font-display tracking-widest text-tan uppercase text-lg font-bold">{copy.footer.linksTitle}</h3>
          <ul className="space-y-3 text-sm">
            {copy.footer.links.map((l) => (
              <li key={l}>
                <Link to={getPath(l)} className="text-zinc-300 hover:text-tan transition font-medium">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={`space-y-4 ${responsiveTextAlign}`}>
          <h3 className="font-display tracking-widest text-tan uppercase text-lg font-bold">{copy.footer.locationTitle}</h3>
          <ul className="space-y-3.5 text-sm text-zinc-300">
            <li className={`flex flex-col md:flex-row items-center md:items-start gap-2 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
              <Mail className="size-4 text-tan shrink-0 mt-0.5" /> 
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=info@theufuq.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-tan transition font-semibold truncate block"
                >
                  info@theufuq.com
                </a>
              </div>
            </li>
            <li className={`flex flex-col md:flex-row items-center md:items-start gap-2 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
              <Phone className="size-4 text-tan shrink-0 mt-0.5" /> 
              <a href="tel:+971555406013" className="hover:text-tan transition font-semibold">UAE +971 55 5406013</a>
            </li>
            <li className={`flex flex-col md:flex-row items-center md:items-start gap-2 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
              <Globe className="size-4 text-tan shrink-0 mt-0.5" /> 
              <a href="https://www.theufuq.com" target="_blank" rel="noopener noreferrer" className="hover:text-tan transition font-semibold">www.theufuq.com</a>
            </li>
            <li className={`flex flex-col md:flex-row items-center md:items-start gap-2 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
              <MapPin className="size-4 text-tan shrink-0 mt-0.5" />
              <span className="leading-relaxed text-sm max-w-xs md:max-w-none text-center md:text-left">
                {isRtl 
                  ? "ميدان جراندستاند، الطابق السادس، غرفة 603، طريق ميدان، ند الشبا، دبي، الإمارات العربية المتحدة"
                  : "Meydan Grandstand, 6th Floor, Room 603, Meydan Road, Nad Al Sheba, Dubai, U.A.E."}
              </span>
            </li>
          </ul>
        </div>

        <div className={`space-y-4 ${responsiveTextAlign}`}>
          <h3 className="font-display tracking-widest text-tan uppercase text-lg font-bold">{copy.footer.getInTouchTitle}</h3>
          <div className={`flex gap-3 justify-center ${isRtl ? 'md:justify-end' : 'md:justify-start'}`}>
            {[Facebook, Youtube, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="size-10 grid place-items-center border border-tan/50 text-tan hover:bg-tan hover:text-zinc-950 transition"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-tan">
        <div className="container-x py-5 text-center text-sm text-zinc-500 font-display flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>{copy.footer.copyright}</span>
          <span className="hidden sm:inline text-zinc-650">|</span>
          <span className="text-zinc-500 text-xs">
            Powered by{" "}
            <a 
              href="https://it.swiftsignbm.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-tan hover:text-white transition font-medium underline underline-offset-4"
            >
              itswiftsign
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
