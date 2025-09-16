import React, { useEffect, useState } from "react";

const MAX_PRODUCTS = 6;

function ProductCard({ href, image, price, title }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-72 transition-shadow hover:shadow-lg"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="block h-40 w-full object-cover"
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-emerald-50 text-sm font-semibold uppercase text-emerald-700">
            Amazon Deal
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-sm font-semibold leading-snug text-gray-900">{title}</p>
          <p className="text-sm font-semibold text-emerald-700">
            {price || "See today's price"}
          </p>
          <span className="mt-auto text-sm font-medium text-emerald-600">
            Shop now on Amazon →
          </span>
        </div>
      </div>
    </a>
  );
}

/**
 * Renders Amazon affiliate ads using the Product Advertising API.
 * Shows a notice when the curated ASIN list cannot be loaded.
 */
export default function AmazonBanner() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/amazon-ads");
        if (!res.ok) {
          throw new Error(`Amazon banner request failed with ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) {
          const normalized = Array.isArray(data.items) ? data.items : [];
          setItems(normalized.slice(0, MAX_PRODUCTS));
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setItems([]);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (items === null) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 mb-4 text-center text-sm text-gray-600">
        Check back soon for this week's Belt matchup picks.
      </div>
    );
  }

  return (
    <div className="mt-8 mb-4 flex flex-wrap justify-center gap-4">
      {items.map((item) => (
        <ProductCard
          key={item.asin || item.link}
          href={item.link}
          image={item.image}
          price={item.price}
          title={item.title}
        />
      ))}
    </div>
  );
}
