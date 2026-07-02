import React from "react";
import { Products } from "@/components/site/Products";

export default function ShopPage({ lang }) {
  return (
    <main className="pt-28 min-h-screen">
      <Products lang={lang} />
    </main>
  );
}
