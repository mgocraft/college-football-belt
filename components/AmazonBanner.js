import React, { useEffect, useState } from "react";
import amazonProducts from "../data/amazonProducts";
import styles from "./AmazonBanner.module.css";

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

function deriveAssociateTag(product) {
  if (!product) {
    return undefined;
  }
  if (typeof product.associateTag === "string") {
    const trimmed = product.associateTag.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  if (typeof product.link === "string") {
    try {
      const url = new URL(product.link);
      const tag = url.searchParams.get("tag");
      if (tag) {
        const trimmed = tag.trim();
        if (trimmed.length > 0) {
          return trimmed;
        }
      }
    } catch (error) {
      // Ignore invalid URLs.
    }
  }
  return undefined;
}

function deriveFallbackImage(asin, product) {
  if (product?.fallbackImage) {
    return product.fallbackImage;
  }
  if (!asin) {
    return null;
  }
  const params = new URLSearchParams({
    _encoding: "UTF8",
    ASIN: asin,
    ServiceVersion: "20070822",
    WS: "1",
    Format: "SL250",
    ID: "AsinImage",
    MarketPlace: "US",
  });
  const tag = deriveAssociateTag(product);
  if (tag) {
    params.set("tag", tag);
  }
  return `https://ws-na.amazon-adsystem.com/widgets/q?${params.toString()}`;
}

/**
 * Renders curated Amazon affiliate products with live details from
 * the Product Advertising API. Pricing and imagery refresh on every
 * request to comply with Amazon's 24-hour freshness policy.
 */
export default function AmazonBanner({ count = 3, startIndex = 0 } = {}) {
  const normalizedCount = Number.isFinite(count) && count > 0
    ? Math.floor(count)
    : 3;
  const normalizedStart = Number.isFinite(startIndex) && startIndex > 0
    ? Math.floor(startIndex)
    : 0;

  const [productDetails, setProductDetails] = useState(() => []);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (amazonProducts.length === 0) {
      return undefined;
    }

    const controller = new AbortController();
    let isActive = true;

    async function load() {
      try {
        const payload = {
          products: amazonProducts.map((product) => ({
            asin:
              typeof product.asin === "string"
                ? product.asin.trim()
                : undefined,
            link:
              typeof product.link === "string"
                ? product.link.trim()
                : undefined,
          })),
        };
        const response = await fetch(`/api/amazon-ads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Amazon ads request failed (${response.status})`);
        }
        const data = await response.json();
        if (!isActive) {
          return;
        }
        const items = Array.isArray(data?.items) ? data.items : [];
        setProductDetails(items);
        setHasError(false);
      } catch (error) {
        if (!isActive || error?.name === "AbortError") {
          return;
        }
        console.error(error);
        setHasError(true);
        setProductDetails([]);
      }
    }

    load();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const mappedCards = amazonProducts
    .map((product, index) => {
      const details = productDetails[index] || null;
      const link = details?.link || product.link;
      const fallbackTitle =
        product.fallbackTitle ||
        "Amazon pick";
      const title = details?.title || fallbackTitle;
      const asin = details?.asin || deriveAsin(product);
      const image =
        details?.image || deriveFallbackImage(asin, product);
      const key = asin || `${link || "amazon-product"}-${index}`;

      if (!link || !title) {
        return null;
      }

      return {
        key,
        link,
        title,
        image,
      };
    })
    .filter(Boolean);

  let cards = mappedCards.slice(
    normalizedStart,
    normalizedStart + normalizedCount
  );

  if (cards.length === 0 && normalizedStart !== 0) {
    cards = mappedCards.slice(0, normalizedCount);
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {hasError && (
        <p className={styles.errorMessage}>
          We couldn&apos;t refresh today&apos;s Amazon picks. Tap through to see the
          latest price on Amazon.
        </p>
      )}
      <div className={styles.grid}>
        {cards.map((card) => (
          <a
            key={card.key}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
            title={card.title}
          >
            {card.image ? (
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                className={styles.cardImage}
              />
            ) : (
              <div className={styles.cardPlaceholder}>
                View on Amazon
              </div>
            )}
            <div className={styles.cardBody}>
              <p className={styles.cardTitle}>{card.title}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
