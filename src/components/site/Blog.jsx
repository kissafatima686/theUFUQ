import React from "react";
import { Link } from "react-router-dom";
import { Calendar, UserRound } from "lucide-react";
import "./Blog.css";
import { siteCopy } from "@/siteCopy";

export function Blog({ lang = "en" }) {
  const copy = siteCopy[lang] ?? siteCopy.en;

  return (
    <section className="py-12 bg-background">
      <div className="container-x">
        <div className="text-center space-y-2 mb-6">
          <p className="text-tan font-display tracking-[0.3em] text-sm uppercase">{copy.blog.eyebrow}</p>
          <h2 className="text-3xl md:text-5xl text-foreground max-w-3xl mx-auto leading-tight">{copy.blog.title}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {copy.blog.posts && copy.blog.posts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`}
              className="group flex flex-col cursor-pointer"
            >
              <div className="overflow-hidden rounded-sm border border-zinc-900 shadow-xl relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="pt-5 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <UserRound className="size-3.5 text-tan" /> 
                      <span className="hover:text-tan transition">{post.author}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-tan" /> {post.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-tan transition leading-snug uppercase tracking-wide">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
