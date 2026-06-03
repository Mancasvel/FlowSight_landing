"use client";

import { motion } from "framer-motion";

const PARTNERS = [
  { name: "Xiji Incubator", src: "/logos/logo-xiji-incubator.jpg", className: "w-24 sm:w-28 md:w-32" },
  { name: "Universidad de Sevilla", src: "/logos/University-of-Seville-980x999.png", className: "w-24 sm:w-28 md:w-32" },
  { name: "Barner Brand", src: "/logos/barner_logo_mobile.svg", className: "w-24 sm:w-28 md:w-32" },
  { name: "MongoDB", src: "/logos/mongodb.svg", className: "w-24 sm:w-28 md:w-32" },
  { name: "Microsoft", src: "/logos/microsoft.svg", className: "w-24 sm:w-28 md:w-32" },
  { name: "Xiaomi", src: "/logos/xiaomi.svg", className: "w-28 sm:w-32 md:w-36" },
] as const;

export function PartnersBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.45 }}
      className="relative z-10 mx-auto mt-10 w-full max-w-5xl px-4"
    >
      <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
        Supported by
      </p>
      <div className="flex flex-nowrap items-center justify-center gap-6 opacity-80 transition-opacity duration-500 hover:opacity-100 sm:gap-10 md:gap-12">
        {PARTNERS.map((partner) => (
          <div
            key={partner.name}
            className={`flex h-14 shrink-0 items-center justify-center grayscale transition-all duration-300 hover:grayscale-0 sm:h-16 ${partner.className}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={partner.src}
              alt={partner.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
