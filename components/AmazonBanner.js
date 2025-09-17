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
export default function AmazonBanner({ count = 3, startIndex = 0 } = {}) {
  const normalizedCount = Number.isFinite(count) && count > 0
    ? Math.floor(count)
    : 3;
  const normalizedStart = Number.isFinite(startIndex) && startIndex > 0
    ? Math.floor(startIndex)
    : 0;

  const [productMap, setProductMap] = useState(() => Object.create(null));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const asins = amazonProducts.map(deriveAsin).filter(Boolean);

    if (asins.length === 0) {
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
      const asin = deriveAsin(product);
      const details = asin ? productMap[asin] : undefined;
      const link = product.link || details?.link;
      const fallbackTitle =
        product.fallbackTitle ||
        "Amazon pick";
      const title = details?.title || fallbackTitle;
      const image = details?.image || product.fallbackImage || null;
      const displayTitle =
        details?.title ||
        product.fallbackTitle ||
        fallbackTitle;
      const price = details?.price || null;
      const key = asin || `${link || "amazon-product"}-${index}`;

      if (!link || !title) {
        return null;
      }

      return {
        key,
        link,
        title,
        image,
        displayTitle,
        price,
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
              <p className={styles.cardTitle}>{card.displayTitle}</p>
              {card.price && (
                <p className={styles.cardPrice}>{card.price}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
