"use client";

import { useState, useEffect } from "react";

interface BannerSlotProps {
  slot: "homepage" | "category" | "search";
  categorySlug?: string;
}

const ROTATE_INTERVAL_MS = 5000;

export default function BannerSlot({ slot, categorySlug }: BannerSlotProps) {
  const [banners, setBanners] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams({ slot });
    if (categorySlug) params.set("category", categorySlug);

    fetch(`/api/banners?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBanners(data);
      })
      .catch(() => {});
  }, [slot, categorySlug]);

  useEffect(() => {
    if (banners.length < 2 || paused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [banners.length, paused]);

  if (banners.length === 0) return null;

  return (
    <div
      className="animate-fade-in relative rounded-xl overflow-hidden border border-gray-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full aspect-[4/1] max-h-48">
        {banners.map((banner, idx) => (
          <a
            key={banner._id}
            href={`/api/banners/track/${banner._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute inset-0 block transition-opacity duration-700 ${
              idx === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
          </a>
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {banners.map((banner, idx) => (
            <button
              key={banner._id}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Show banner ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
