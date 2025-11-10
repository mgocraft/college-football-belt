import {
  getItems,
  searchItems,
  hasAmazonCredentials,
} from "../../utils/amazon.js";

const asinPattern = /^[A-Z0-9]{10}$/;

function parseAsins(value) {
  if (!value) {
    return [];
  }
  const rawValues = Array.isArray(value) ? value : [value];
  return rawValues
    .flatMap((entry) =>
      typeof entry === "string" ? entry.split(/[\s,]+/) : []
    )
    .map((asin) => asin.trim().toUpperCase())
    .filter(Boolean);
}

function normalizeAsin(value) {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim().toUpperCase();
  return asinPattern.test(trimmed) ? trimmed : undefined;
}

function extractAsinFromString(value) {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.toUpperCase();
  const patterns = [
    /\/DP\/([A-Z0-9]{10})/,
    /\/GP\/PRODUCT\/([A-Z0-9]{10})/,
    /[?&]ASIN=([A-Z0-9]{10})/,
    /\/PRODUCT\/([A-Z0-9]{10})/,
  ];
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return asinPattern.test(normalized) ? normalized : undefined;
}

async function resolveAsinFromLink(link) {
  if (typeof link !== "string" || link.trim().length === 0) {
    return undefined;
  }
  const direct = extractAsinFromString(link);
  if (direct) {
    return direct;
  }
  let url;
  try {
    url = new URL(link);
  } catch (err) {
    return undefined;
  }

  const immediate = extractAsinFromString(
    `${url.pathname}${url.search}${url.hash}`
  );
  if (immediate) {
    return immediate;
  }

  const hostname = url.hostname.toLowerCase();
  const shouldResolve =
    hostname.endsWith("amzn.to") || hostname.endsWith("amazon.com");
  if (!shouldResolve) {
    return undefined;
  }

  const attempts = [
    { method: "HEAD", redirect: "follow" },
    { method: "GET", redirect: "manual" },
  ];

  for (const attempt of attempts) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(link, {
        method: attempt.method,
        redirect: attempt.redirect,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (attempt.redirect === "manual") {
        const location = response.headers.get("location");
        const asin = extractAsinFromString(location || "");
        if (asin) {
          return asin;
        }
      } else if (response.url) {
        const asin = extractAsinFromString(response.url);
        if (asin) {
          return asin;
        }
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.warn("Failed to resolve Amazon link", error);
      }
    }
  }

  return undefined;
}

async function deriveAsinFromProduct(product) {
  const asin = normalizeAsin(product?.asin);
  if (asin) {
    return asin;
  }
  return resolveAsinFromLink(product?.link);
}

function normalizeProducts(input) {
  if (!input) {
    return [];
  }
  const list = Array.isArray(input)
    ? input
    : Array.isArray(input.products)
      ? input.products
      : [];
  return list
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const asin =
        typeof entry.asin === "string" && entry.asin.trim().length > 0
          ? entry.asin
          : undefined;
      const link =
        typeof entry.link === "string" && entry.link.trim().length > 0
          ? entry.link
          : undefined;
      if (!asin && !link) {
        return null;
      }
      return { asin, link };
    })
    .filter(Boolean);
}

function buildPlaceholderItems(products) {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }
  return products.map((product) => {
    const asin = normalizeAsin(product?.asin);
    if (asin) {
      return { asin };
    }
    const derived = extractAsinFromString(
      typeof product?.link === "string" ? product.link : ""
    );
    return derived ? { asin: derived } : null;
  });
}

function respondWithFallback(res, products, message, reason) {
  const response = {
    items: buildPlaceholderItems(products),
    fallback: true,
  };
  if (typeof message === "string" && message.trim().length > 0) {
    response.error = message.trim();
  }
  if (typeof reason === "string" && reason.trim().length > 0) {
    response.reason = reason.trim();
  }
  res.status(200).json(response);
}

function formatPrice(listing, summary) {
  const display =
    listing?.Price?.DisplayAmount || summary?.LowestPrice?.DisplayAmount;
  if (display) {
    return display;
  }
  const amount =
    listing?.Price?.Amount ?? summary?.LowestPrice?.Amount ?? undefined;
  const currency =
    listing?.Price?.Currency ?? summary?.LowestPrice?.Currency ?? undefined;
  if (typeof amount === "number" && currency) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(amount);
    } catch (err) {
      return `${currency} ${amount.toFixed(2)}`;
    }
  }
  return undefined;
}

function mapAmazonItem(item) {
  const listing = item?.Offers?.Listings?.[0];
  const summary = item?.Offers?.Summaries?.[0];
  const features = item?.ItemInfo?.Features?.DisplayValues;
  const description = Array.isArray(features)
    ? features
        .map((value) =>
          typeof value === "string" ? value.trim() : ""
        )
        .find((value) => value.length > 0)
    : undefined;
  return {
    asin: item?.ASIN?.toUpperCase(),
    title: item?.ItemInfo?.Title?.DisplayValue,
    image:
      item?.Images?.Primary?.Large?.URL ||
      item?.Images?.Primary?.Medium?.URL ||
      item?.Images?.Primary?.Small?.URL,
    link: item?.DetailPageURL,
    price: formatPrice(listing, summary),
    description,
  };
}

export default async function handler(req, res) {
  const { keywords } = req.query;
  let products = [];

  if (req.method === "POST") {
    products = normalizeProducts(req.body);
  } else {
    let asinList = parseAsins(req.query.asins);
    if (asinList.length === 0) {
      asinList = parseAsins(process.env.AMAZON_ASINS || "");
    }
    products = asinList.map((asin) => ({ asin }));
  }

  if (!hasAmazonCredentials()) {
    respondWithFallback(
      res,
      products,
      "Live Amazon pricing is disabled until affiliate credentials are configured. Showing curated picks instead.",
      "missing-credentials"
    );
    return;
  }

  try {
    if (products.length === 0) {
      const fallbackKeywords =
        typeof keywords === "string" && keywords.trim().length > 0
          ? keywords
          : "college football gear";
      const data = await searchItems(fallbackKeywords);
      if (Array.isArray(data?.Errors) && data.Errors.length > 0) {
        const errorMessage = data.Errors.map((error) => error.Message || error.Code)
          .filter(Boolean)
          .join("; ");
        throw new Error(errorMessage || "Amazon SearchItems response contained errors");
      }
      const items = (data.SearchResult?.Items || [])
        .map(mapAmazonItem)
        .filter((item) => item && item.image && item.link && item.title)
        .slice(0, 3);
      res.status(200).json({ items });
      return;
    }

    const asinResults = await Promise.all(
      products.map((product) => deriveAsinFromProduct(product))
    );

    const uniqueAsins = Array.from(
      new Set(
        asinResults
          .filter(Boolean)
          .map((asin) => normalizeAsin(asin))
          .filter(Boolean)
      )
    );

    let detailsByAsin = new Map();
    if (uniqueAsins.length > 0) {
      const data = await getItems(uniqueAsins);
      if (Array.isArray(data?.Errors) && data.Errors.length > 0) {
        const errorMessage = data.Errors.map((error) => error.Message || error.Code)
          .filter(Boolean)
          .join("; ");
        throw new Error(errorMessage || "Amazon GetItems response contained errors");
      }
      detailsByAsin = new Map(
        (data.ItemsResult?.Items || []).map((item) => {
          const mapped = mapAmazonItem(item);
          return [mapped.asin, mapped];
        })
      );
    }

    const items = products.map((product, index) => {
      const asin = normalizeAsin(asinResults[index]);
      if (!asin) {
        return null;
      }
      const details = detailsByAsin.get(asin);
      if (details) {
        return details;
      }
      return { asin };
    });

    res.status(200).json({ items });
  } catch (err) {
    console.error("Amazon ads API error:", err);
    respondWithFallback(
      res,
      products,
      "Live Amazon pricing is currently unavailable. Showing curated picks instead.",
      "api-error"
    );
  }
}
