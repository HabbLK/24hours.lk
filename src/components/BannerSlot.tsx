"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface BannerSlotProps {
  slot: "homepage" | "category" | "search";
  categorySlug?: string;
}

export default function BannerSlot({ slot, categorySlug }: BannerSlotProps) {
  const [banner, setBanner] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams({ slot });
    if (categorySlug) params.set("category", categorySlug);

    fetch(`/api/banners?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data._id) setBanner(data);
      })
      .catch(() => {});
  }, [slot, categorySlug]);

  if (!banner) return null;

  return (
    <div className="animate-fade-in">
      <a
        href={`/api/banners/track/${banner._id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
      >
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-auto max-h-48 object-cover"
        />
      </a>
    </div>
  );
}
