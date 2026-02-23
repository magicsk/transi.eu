"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "100%", label: "Native", sub: "Kotlin & SwiftUI" },
  { value: "21+", label: "Releases", sub: "Android" },
  { value: "14+", label: "Releases", sub: "iOS" },
  { value: "Free", label: "Forever", sub: "Open-source GPL-3.0" },
];

export default function Stats() {
  return (
    <section className="relative py-16 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/3 to-transparent pointer-events-none" />
      <div className="absolute inset-0 border-y border-[var(--border)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label + stat.sub}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center py-4"
            >
              <div className="text-4xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-[var(--text)] font-medium text-sm">{stat.label}</div>
              <div className="text-[var(--text-faint)] text-xs mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
