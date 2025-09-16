import React, { useEffect, useState } from "react";
import amazonProducts from "../data/amazonProducts";

const asinPattern = /^[A-Z0-9]{10}$/;

function deriveAsin(product) {
  if (!product) {
    return undefined;
  }
  if (typeof product.asin === "string") {
    const trimmed = product.asin.trim().toUpperCase();
    if (asinPattern.test(trimmed)) {
      return trimmed;
    }
  }
  if (typeof product.link === "string") {
    const match = product.link.match(/\/dp\/([A-Z0-9]{10})/i);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  return undefined;
}

function buildProductMap(items) {
  const map = Object.create(null);
  for (const item of Array.isArray(items) ? items : []) {
    const asin = item?.asin ? item.asin.toUpperCase() : undefined;
    if (asin) {
      map[asin] = item;
    }
  }
  return map;
}

/**
 * Renders curated Amazon affiliate products with live details from
 * the Product Advertising API. Pricing and imagery refresh on every
 * request to comply with Amazon's 24-hour freshness policy.
 */
export default function AmazonBanner() {
  const [productMap, setProductMap] = useState(() => Object.create(null));
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const asins = amazonProducts.map(deriveAsin).filter(Boolean);

    if (asins.length === 0) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let isActive = true;

    async function load() {
      try {
        const params = new URLSearchParams({
          asins: asins.join(","),
        });
        const response = await fetch(`/api/amazon-ads?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Amazon ads request failed (${response.status})`);
        }
        const data = await response.json();
        if (!isActive) {
          return;
        }
        setProductMap(buildProductMap(data?.items));
        setHasError(false);
      } catch (error) {
        if (!isActive || error?.name === "AbortError") {
          return;
        }
        console.error(error);
        setHasError(true);
        setProductMap(Object.create(null));
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const cards = amazonProducts
    .map((product, index) => {
      const asin = deriveAsin(product);
      const details = asin ? productMap[asin] : undefined;
      const link = product.link || details?.link;
      const title =
        details?.title ||
        product.fallbackTitle ||
        product.tagline ||
        "Amazon pick";
      const image = details?.image || product.fallbackImage || null;
      const price = details?.price;
      const tagline = product.tagline;
      const cta = product.cta || "See it on Amazon →";
      const key = asin || `${link || "amazon-product"}-${index}`;

      if (!link || !title) {
        return null;
      }

      return {
        key,
        link,
        title,
        image,
        price,
        tagline,
        cta,
      };
    })
    .filter(Boolean);

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 mb-4">
      {hasError && (
        <p className="mb-4 text-center text-sm text-red-600">
          We couldn&apos;t refresh today&apos;s Amazon picks. Tap through to see the
          latest price on Amazon.
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {cards.map((card) => (
          <a
            key={card.key}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-72 transition-shadow hover:shadow-md"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="block h-36 w-full object-cover"
                />
              ) : (
                <div className="flex h-36 w-full items-center justify-center bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  View on Amazon
                </div>
              )}
              <div className="flex h-full flex-col p-3">
                <p className="text-sm font-semibold leading-snug text-gray-900">
                  {card.title}
                </p>
                <p className="mt-2 text-sm font-bold text-emerald-700">
                  {card.price
                    ? card.price
                    : loading
                    ? "Checking today's price..."
                    : "See today's price on Amazon"}
                </p>
                {card.tagline && (
                  <p className="mt-3 text-sm text-gray-700">{card.tagline}</p>
                )}
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700">
                  {card.cta}
                  <svg
                    className="ml-1 h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
