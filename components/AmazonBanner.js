import React, { useEffect, useState } from "react";
import amazonProducts from "../data/amazonProducts";
import styles from "./AmazonBanner.module.css";

const asinPattern = /^[A-Z0-9]{10}$/;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

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
  const explicitTag = sanitizeAssociateTag(product?.associateTag);
  if (explicitTag) {
    return explicitTag;
  }
  return extractAssociateTag(product?.link);
}

function deriveFallbackImage(asin, product) {
  const explicitImage = [product?.fallbackImage, product?.image]
    .find((value) => typeof value === "string" && value.trim().length > 0);
  if (explicitImage) {
    return explicitImage.trim();
  }
  if (!asin) {
    return null;
  }

  const tag = deriveAssociateTag(product);
  if (tag) {
    const url = new URL("https://ws-na.amazon-adsystem.com/widgets/q");
    url.searchParams.set("_encoding", "UTF8");
    url.searchParams.set("ASIN", asin);
    url.searchParams.set("Format", "_SL500_");
    url.searchParams.set("ID", "AsinImage");
    url.searchParams.set("MarketPlace", "US");
    url.searchParams.set("ServiceVersion", "20070822");
    url.searchParams.set("WS", "1");
    url.searchParams.set("tag", tag);
    return url.toString();
  }

  return `https://m.media-amazon.com/images/I/${asin}._SL500_.jpg`;
}

function sanitizeAssociateTag(value) {
  if (!isNonEmptyString(value)) {
    return undefined;
  }
  const trimmed = value.trim();
  return /[^a-zA-Z0-9-]/.test(trimmed) ? undefined : trimmed;
}

function extractAssociateTag(link) {
  if (!isNonEmptyString(link)) {
    return undefined;
  }
  try {
    const url = new URL(link);
    const tag = url.searchParams.get("tag");
    return sanitizeAssociateTag(tag);
  } catch (error) {
    return undefined;
  }
}

function buildAffiliateLink({ asin, rawLink, associateTag }) {
  const normalizedAsin =
    typeof asin === "string" && asinPattern.test(asin.trim().toUpperCase())
      ? asin.trim().toUpperCase()
      : undefined;
  const sanitizedTag = sanitizeAssociateTag(associateTag);
  const fallbackTag = sanitizedTag || extractAssociateTag(rawLink);
  if (!isNonEmptyString(rawLink)) {
    if (normalizedAsin) {
      if (fallbackTag) {
        return `https://www.amazon.com/dp/${normalizedAsin}?linkCode=ogi&tag=${fallbackTag}&language=en_US&ref_=as_li_ss_tl`;
      }
      return `https://www.amazon.com/dp/${normalizedAsin}`;
    }
    return rawLink || null;
  }

  let url;
  try {
    url = new URL(rawLink);
  } catch (error) {
    if (normalizedAsin) {
      if (fallbackTag) {
        return `https://www.amazon.com/dp/${normalizedAsin}?linkCode=ogi&tag=${fallbackTag}&language=en_US&ref_=as_li_ss_tl`;
      }
      return `https://www.amazon.com/dp/${normalizedAsin}`;
    }
    return rawLink;
  }

  const hostname = url.hostname.toLowerCase();
  const isAmazonDomain =
    hostname === "amzn.to" || /(^|\.)amazon\.[a-z.]+$/.test(hostname);
  if (!isAmazonDomain) {
    return rawLink;
  }

  const tag = fallbackTag;

  if (hostname === "amzn.to") {
    if (normalizedAsin) {
      if (tag) {
        return `https://www.amazon.com/dp/${normalizedAsin}?linkCode=ogi&tag=${tag}&language=en_US&ref_=as_li_ss_tl`;
      }
      return `https://www.amazon.com/dp/${normalizedAsin}`;
    }
    return rawLink;
  }

  if (normalizedAsin && !url.pathname.match(/\/dp\//i)) {
    url.pathname = `/dp/${normalizedAsin}`;
  }

  if (tag) {
    url.searchParams.set("tag", tag);
  }

  if (normalizedAsin) {
    url.searchParams.set("psc", "1");
  }

  if (!url.searchParams.has("linkCode")) {
    url.searchParams.set("linkCode", "ogi");
  }

  if (!url.searchParams.has("language")) {
    url.searchParams.set("language", "en_US");
  }

  if (!url.searchParams.has("ref_")) {
    url.searchParams.set("ref_", "as_li_ss_tl");
  }

  return url.toString();
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
  const [errorMessage, setErrorMessage] = useState("");

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
        const message =
          typeof data?.error === "string" ? data.error.trim() : "";
        const fallbackActive = data?.fallback === true;
        setProductDetails(items);
        setHasError(message.length > 0 && !fallbackActive);
        setErrorMessage(message);
      } catch (error) {
        if (!isActive || error?.name === "AbortError") {
          return;
        }
        console.error(error);
        setHasError(true);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to refresh Amazon picks."
        );
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
      const asin = details?.asin || deriveAsin(product);
      const link = buildAffiliateLink({
        asin,
        rawLink: details?.link || product.link,
        associateTag: product.associateTag,
      });
      const fallbackTitle =
        product.fallbackTitle ||
        "Amazon pick";
      const title = details?.title || fallbackTitle;
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
          {errorMessage ||
            "We couldn&apos;t refresh today&apos;s Amazon picks. Tap through to see the latest price on Amazon."}
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
