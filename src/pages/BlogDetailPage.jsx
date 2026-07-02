import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, UserRound, ArrowLeft, ArrowRight } from "lucide-react";
import { siteCopy } from "@/siteCopy";

export default function BlogDetailPage({ lang = "en" }) {
  const { id } = useParams();
  const copy = siteCopy[lang] ?? siteCopy.en;
  const isRtl = lang === "ar";
  
  const posts = copy.blog.posts || [];
  const post = posts.find((p) => p.id === parseInt(id)) || posts[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <main className="pt-28 pb-12 bg-[#181614] min-h-screen text-center text-white">
        <div className="container-x">
          <p>{isRtl ? "لم يتم العثور على المدونة." : "Blog post not found."}</p>
          <Link to="/blog" className="btn-tan mt-6">
            {isRtl ? "العودة للمدونة" : "Back to Blog"}
          </Link>
        </div>
      </main>
    );
  }

  const directionClass = isRtl ? "rtl" : "ltr";
  const textAlignClass = isRtl ? "text-right" : "text-left";
  const backText = isRtl ? "العودة للمدونة" : "Back to Blog";

  return (
    <main className="pt-20 pb-16 bg-[#181614] min-h-screen text-white font-roboto" dir={directionClass}>
      {/* Mini Hero Section */}
      <div className="bg-zinc-950 py-16 border-b border-zinc-900 text-center relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.08)_0%,transparent_70%)] pointer-events-none" />
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground uppercase tracking-widest mb-3 z-10 relative px-4 max-w-4xl leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-2 text-xs font-display tracking-widest uppercase text-zinc-500 z-10 relative">
          <Link to="/" className="hover:text-tan transition">{isRtl ? "الرئيسية" : "Home"}</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-tan transition">{isRtl ? "المدونة" : "Blog"}</Link>
          <span>/</span>
          <span className="text-tan truncate max-w-[200px]">{post.title}</span>
        </div>
      </div>

      <div className="container-x py-10 max-w-3xl">
        {/* Back Link */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-xs font-display tracking-widest uppercase text-tan hover:text-white transition mb-8"
        >
          {isRtl ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
          {backText}
        </Link>

        {/* Blog Article */}
        <article className="space-y-6">
          {/* Main image banner with hover glow and border */}
          <div className="w-full aspect-video overflow-hidden rounded-sm border border-zinc-800 shadow-2xl relative bg-zinc-900 group">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-[6000ms] group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Meta Info */}
          <div className={`flex flex-wrap items-center gap-4 text-xs text-zinc-500 border-b border-zinc-850 pb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="flex items-center gap-1.5">
              <UserRound className="size-4 text-tan" /> 
              <a 
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${post.author}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-tan transition text-zinc-400 font-semibold"
              >
                {post.author}
              </a>
            </span>
            <span className="h-3 w-px bg-zinc-800" />
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4 text-tan" /> {post.date}
            </span>
          </div>

          {/* Blog Content */}
          <div className={`space-y-6 text-zinc-300 leading-relaxed text-base font-roboto ${textAlignClass}`}>
            {post.content.split("\n\n").map((para, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
