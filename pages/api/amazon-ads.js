import { getItems } from "../../utils/amazon.js";

const MAX_ITEMS = 6;

function parseAsins(value) {
  if (!value) {
    return [];
  }
  const rawValues = Array.isArray(value) ? value : [value];
  const seen = new Set();
  const parsed = [];
  for (const entry of rawValues) {
    if (typeof entry !== "string") {
      continue;
    }
    for (const candidate of entry.split(/[\s,]+/)) {
      const asin = candidate.trim().toUpperCase();
      if (!asin || seen.has(asin)) {
        continue;
      }
      seen.add(asin);
      parsed.push(asin);
      if (parsed.length === MAX_ITEMS) {
        return parsed;
      }
    }
  }
  return parsed;
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
  return {
    asin: item?.ASIN?.toUpperCase(),
    title: item?.ItemInfo?.Title?.DisplayValue,
    image:
      item?.Images?.Primary?.Large?.URL ||
      item?.Images?.Primary?.Medium?.URL ||
      item?.Images?.Primary?.Small?.URL,
    link: item?.DetailPageURL,
    price: formatPrice(listing, summary),
  };
}

export default async function handler(req, res) {
  let asinList = parseAsins(req.query.asins);
  if (asinList.length === 0) {
    asinList = parseAsins(process.env.AMAZON_ASINS || "");
  }
  try {
    if (asinList.length === 0) {
      res.status(200).json({ items: [] });
      return;
    }

    const data = await getItems(asinList);
    if (Array.isArray(data?.Errors) && data.Errors.length > 0) {
      const errorMessage = data.Errors.map((error) => error.Message || error.Code)
        .filter(Boolean)
        .join("; ");
      throw new Error(errorMessage || "Amazon GetItems response contained errors");
    }
    const mapped = new Map(
      (data.ItemsResult?.Items || []).map((item) => [
        item?.ASIN?.toUpperCase(),
        mapAmazonItem(item),
      ])
    );
    const items = asinList
      .map((asin) => mapped.get(asin))
      .filter((item) => item && item.image && item.link && item.title);

    res.status(200).json({ items });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch Amazon products";
    console.error("Amazon ads API error:", err);
    res.status(500).json({ error: message });
  }
}
