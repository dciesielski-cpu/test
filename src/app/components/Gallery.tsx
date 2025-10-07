"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://picsum.photos/id/1015/800/600",
  "https://picsum.photos/id/1016/800/600",
  "https://picsum.photos/id/1018/800/600",
  "https://picsum.photos/id/1020/800/600",
  "https://picsum.photos/id/1024/800/600",
];

export default function Gallery() {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Galeria</h2>

      <div className="relative flex items-center justify-center h-[400px] md:h-[500px] overflow-hidden">
        {images.map((src, i) => {
          // różnica względem aktualnego indexu
          let offset = (i - index + images.length) % images.length;
          if (offset > Math.floor(images.length / 2)) {
            offset -= images.length; // skrócenie drogi
          }

          return (
            <motion.div
              key={i}
              animate={{
                x: offset * 250, // przesunięcie w bok
                scale: offset === 0 ? 1 : 0.8, // środkowy większy
                zIndex: -Math.abs(offset), // środkowy najwyżej
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute w-[90%] md:w-[662px] md:h-[100%] h-[80%] shadow-lg overflow-hidden cursor-pointer"
            >
              <Image
                src={src}
                alt={`gallery-${i}`}
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>
          );
        })}

        {/* Nawigacja strzałki */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-orange-500/60 hover:bg-orange-500/80 text-white p-3 transition"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-500/60 hover:bg-orange-500/80 text-white p-3 transition"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Dots navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              index === i ? "bg-gray-700" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
