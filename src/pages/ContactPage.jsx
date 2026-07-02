import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export default function ContactPage({ lang }) {
  const isRtl = lang === "ar";
  
  const labelName = isRtl ? "الاسم" : "Name";
  const labelEmail = isRtl ? "البريد الإلكتروني" : "Email";
  const labelMessage = isRtl ? "الرسالة" : "Message";
  const btnText = isRtl ? "إرسال الرسالة" : "Send Message";

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productItem, setProductItem] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const productOptions = isRtl
    ? [
        { value: "general", label: "استفسار عام" },
        { value: "mdf", label: "أخشاب MDF (ألواح ألياف متوسطة الكثافة)" },
        { value: "osb", label: "أخشاب OSB (ألواح رقائقية موجهة)" },
        { value: "film-faced", label: "خشب رقائقي مغطى بطبقة فيلم" },
        { value: "commercial-plywood", label: "الخشب الرقائقي التجاري" },
        { value: "panels", label: "الألواح الخشبية" },
        { value: "timber", label: "أخشاب طبيعية ممتازة" }
      ]
    : [
        { value: "general", label: "General Inquiry" },
        { value: "mdf", label: "MDF (Medium Density Fiberboard)" },
        { value: "osb", label: "OSB (Oriented Strand Board)" },
        { value: "film-faced", label: "Film Faced Plywood" },
        { value: "commercial-plywood", label: "Commercial Plywood" },
        { value: "panels", label: "Wood Panels" },
        { value: "timber", label: "Premium Timber" }
      ];

  React.useEffect(() => {
    setProductItem(isRtl ? "استفسار عام" : "General Inquiry");
  }, [isRtl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const subject = `Website Inquiry from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nProduct Interest: ${productItem}\n\nMessage:\n${message}`;
      const mailtoUrl = `mailto:info@theufuq.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      window.location.href = mailtoUrl;

      setLoading(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setProductItem(isRtl ? "استفسار عام" : "General Inquiry");
      setMessage("");
    } catch (err) {
      setLoading(false);
      setError(
        isRtl
          ? "فشل فتح برنامج البريد الإلكتروني. يرجى إرسال بريد إلكتروني مباشر إلى info@theufuq.com"
          : "Failed to open email client. Please send a direct email to info@theufuq.com"
      );
    }
  };

  const textAlignClass = isRtl ? "text-right" : "text-left";

  return (
    <main className="pt-20 pb-12 min-h-screen text-white bg-[#181614]">
      {/* Mini Hero Section */}
      <div 
        className="py-20 border-b border-zinc-900 text-center relative overflow-hidden flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(24, 22, 20, 0.75), rgba(24, 22, 20, 0.8)), url('/cabin4.jpg')" }}
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground uppercase tracking-widest mb-3 z-10 relative">
          {isRtl ? "تواصل معنا" : "Contact Us"}
        </h1>
        <div className="flex items-center gap-2 text-xs font-display tracking-widest uppercase text-zinc-300 z-10 relative">
          <Link to="/" className="hover:text-tan transition text-white/95">{isRtl ? "الرئيسية" : "Home"}</Link>
          <span>/</span>
          <span className="text-tan">{isRtl ? "تواصل معنا" : "Contact Us"}</span>
        </div>
      </div>

      <div className="container-x py-12">
        {/* Grid: flows natively RTL/LTR with browser engine, centered on mobile */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Contact Info */}
          <div className={`space-y-8 text-center md:${textAlignClass}`}>
            <div>
              <h2 className="text-2xl text-tan mb-4 uppercase font-display tracking-wider">
                {isRtl ? "كن على اتصال" : "Get in Touch"}
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-6 max-w-lg mx-auto md:mx-0">
                {isRtl 
                  ? "يسعدنا دائماً الاستماع إليكم ومناقشة متطلبات مشاريعكم الإنشائية والتجارية. تواصل معنا مباشرة للحصول على الاستشارة الفورية."
                  : "We would love to hear from you. Please fill out the form or reach us directly using our contact credentials below."}
              </p>
            </div>

            <div className="space-y-5 max-w-md mx-auto md:mx-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <div className="size-10 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center shrink-0 text-tan">
                  <Mail className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-display mb-1">{isRtl ? "البريد الإلكتروني" : "Email"}</h4>
                  <a 
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=info@theufuq.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-tan transition text-base font-semibold block truncate"
                  >
                    info@theufuq.com
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <div className="size-10 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center shrink-0 text-tan">
                  <Phone className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-display mb-1">{isRtl ? "الهاتف" : "Phone"}</h4>
                  <a 
                    href="tel:+971555406013" 
                    className="text-white hover:text-tan transition text-base font-semibold"
                  >
                    +971 55 5406013
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <div className="size-10 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center shrink-0 text-tan">
                  <MapPin className="size-5" />
                </div>
                <div className={`sm:${textAlignClass}`}>
                  <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-display mb-1">{isRtl ? "الموقع" : "Location"}</h4>
                  <p className="text-zinc-300 leading-relaxed text-sm">
                    {isRtl 
                      ? "ميدان جراندستاند، الطابق السادس، غرفة 603، طريق ميدان، ند الشبا، دبي، الإمارات العربية المتحدة"
                      : "Meydan Grandstand, 6th Floor, Room 603, Meydan Road, Nad Al Sheba, Dubai, U.A.E."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <div className="size-10 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center shrink-0 text-tan">
                  <Globe className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-display mb-1">{isRtl ? "الموقع الإلكتروني" : "Website"}</h4>
                  <a 
                    href="https://www.theufuq.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-tan transition text-base font-semibold"
                  >
                    www.theufuq.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-4 bg-zinc-900/30 border border-zinc-850 p-6 sm:p-8 rounded-sm w-full max-w-md mx-auto md:max-w-none" onSubmit={handleSubmit}>
            {success && (
              <div className="bg-emerald-950/20 border border-emerald-800 text-emerald-400 p-3.5 rounded-sm text-sm text-center">
                {isRtl ? "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً." : "Your message has been sent successfully! We will contact you soon."}
              </div>
            )}
            {error && (
              <div className="bg-rose-950/20 border border-rose-800 text-rose-400 p-3.5 rounded-sm text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2 font-display">
                {labelName}
              </label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-sm p-3 text-white outline-none focus:border-tan transition text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2 font-display">
                {labelEmail}
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-sm p-3 text-white outline-none focus:border-tan transition text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2 font-display">
                {isRtl ? "رقم الهاتف" : "Phone Number"}
              </label>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-sm p-3 text-white outline-none focus:border-tan transition text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2 font-display">
                {isRtl ? "المنتج المطلوب" : "Product of Interest"}
              </label>
              <select
                value={productItem}
                onChange={(e) => setProductItem(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-sm p-3 text-white outline-none focus:border-tan transition text-sm cursor-pointer"
              >
                {productOptions.map((opt) => (
                  <option key={opt.value} value={opt.label} className="bg-zinc-950 text-white font-sans">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2 font-display">
                {labelMessage}
              </label>
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-sm p-3 text-white h-36 outline-none focus:border-tan transition text-sm resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="btn-tan w-full h-12 flex items-center justify-center font-display font-bold uppercase tracking-widest text-xs disabled:opacity-55"
            >
              {loading ? (isRtl ? "جاري الإرسال..." : "Sending...") : btnText}
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div className="mt-16 w-full h-[300px] sm:h-[400px] border border-zinc-800 rounded-sm overflow-hidden shadow-2xl">
          <iframe
            src="https://maps.google.com/maps?q=Meydan%20Grandstand,%20Nad%20Al%20Sheba,%20Dubai,%20United%20Arab%20Emirates&t=&z=15&ie=UTF8&iwloc=B&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Al Ufuq Location Map"
          ></iframe>
        </div>
      </div>
    </main>
  );
}
