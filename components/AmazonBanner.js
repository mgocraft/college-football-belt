import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_ASSOCIATE_TAG = "cfbbelt-20";

const fallbackProducts = [
  {
    asin: "B0D8KTKMQW",
    href: "https://www.amazon.com/PILOYINDE-Basketball-gators-Bedroom-Florida/dp/B0D8KTKMQW?crid=AHXD6SCISDXA&dib=eyJ2IjoiMSJ9.pk6LKRJrWyC7tifXE2tQbN2UHnVHAwrlI4IPwD53yX2X4rStgfTuv1E_gHFBJRWrYYNyzek8UgroFTHJ2qfBC9oFmhWiy6wCjPYdM_XIc9ixmGdf9mpDyNYY6kFC2lvq9Q-RouPS3N-7afPhlf5A8xbgqwmjs6dGSCNuwfl6LoHCn4NcQk-KFNeveGhubv6-mgtvtFedK9ZOKUEb78pPxg-PyAS1yWzmtKb2Cgn0K0PxHLRP3ELlvTId2RxRFpUWmn2XddGhIf56XIk9eMrKX-Nzb6rvOrDJpD8Tt9d6Ncw.c6dWX31Ia5o_cu0xK9xQRP160sau0_kFYXJ94CuoEl4&dib_tag=se&keywords=florida%2Bgators%2Bgear&qid=1758030266&sprefix=florida%2Bgators%2Bgrea%2Caps%2C196&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll1&tag=cfbbelt-20&linkId=038c37e92c6cfc6ad877d0ab0bbdf5d0&language=en_US&ref_=as_li_ss_tl",
    title: "Florida Gators LED Basketball Wall Art",
    description: "Neon-style LED glow to light up your Gators game room or office.",
    price: "Tap to see today's price",
  },
  {
    asin: "B00W5VNB80",
    href: "https://www.amazon.com/Siskiyou-Miami-Hurricanes-Necklace-Pendant/dp/B00W5VNB80?crid=2JFJ68NWBB0NX&dib=eyJ2IjoiMSJ9.8JZNSm2ose3w2zaLqSd3PBZhCJ-vKRa68bFQC3LPRjgyVZ1NXG-QHYgY8kWt1ATtbrGSzEaY9IuZgACKQMgCy0La7mQzsa9ePeLeJm_YJ3S19do2X48i5kgFKqabrgPsWFjtv7XfN649imR0HHbahJWZLMi_kIaq-vr9papqFqiQZEQVP0dCljv6GgCHPehr5_9ufKPHbB-gzzq_3VOS9yDq44haNznBuNq8TRCYTK61npO2iEG_cQRDsS6HiwKf.0oqJ84BnenLzEa1sL8JwWJfu10NveksJa9PeMblZyRc&dib_tag=se&keywords=umiami%2Bgear&qid=1758030358&sprefix=umiami%2Bgear%2Caps%2C134&sr=8-8&th=1&linkCode=ll1&tag=cfbbelt-20&linkId=d5d97882d4d124be5d5f50200f486d04&language=en_US&ref_=as_li_ss_tl",
    title: "Miami Hurricanes Script Necklace",
    description: "Show off the U with an officially licensed enamel pendant.",
    price: "Usually under $20 — check the latest",
  },
  {
    asin: "B07QYCVT29",
    href: "https://www.amazon.com/Fantasy-Football-Championship-Belt-Customizable/dp/B07QYCVT29?crid=Q7YY7RE6H763&dib=eyJ2IjoiMSJ9.kwrLnnk6Djg0nFGBOv06n0Po5_hZjoaR-8Y3eBKS7At15wfR7JVGcdnuA6wg0jRDuePBB0gd9Dq77v8rHb5UDF2qnY3U6rcPLJLDg27HDzgPVC9Uq_4yIDLX_YALbnAdPF9Tstf-XS2QrqQyZQa63iY4x8rPVXA2tSdvlzYTLsZBye6JsR_aWH7q3HVWWqlhzP7ZlqDvzxXAe4OccreHLGt_eurivWY6pZB8MYscCOJMjAwgWG5GzBBtWwCdu79pBkcsOfvSbo8NRGxdjvDk8GqCtxQpxS3jLelakOPrgAs.FzhlfvbA3ygxTp0pooYXuj378S2he05Y6CjQoZgls-I&dib_tag=se&keywords=fantasy%2Bfootball%2Bbelt&qid=1758030444&sprefix=fantasy%2Bfootball%2Bbelt%2Caps%2C136&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll1&tag=cfbbelt-20&linkId=6fab320414a8b06b3008c4b4df84b9a9&language=en_US&ref_=as_li_ss_tl",
    title: "Customizable Fantasy Football Championship Belt",
    description: "Crown your league champ with a heavyweight belt and engraved plates.",
    price: "Premium gift — see current price",
  },
  {
    href: "https://amzn.to/3IaxStf",
    title: "Featured Amazon Fan Gear Pick",
    description: "A rotating bestseller hand-picked for college football diehards.",
    price: "Limited-time offer — view price",
    image:
      "https://images-na.ssl-images-amazon.com/images/G/01/social/api-share/amazon-logo._CB1540815460_.png",
  },
];

function buildAffiliateImageUrl({ asin, href, image }) {
  if (image) {
    return image;
  }
  if (!asin) {
    return null;
  }
  let tag = DEFAULT_ASSOCIATE_TAG;
  if (href) {
    try {
      const url = new URL(href);
      const tagFromQuery = url.searchParams.get("tag");
      if (tagFromQuery) {
        tag = tagFromQuery;
      }
    } catch (err) {
      // ignore malformed URLs and fall back to the default tag
    }
  }
  const params = new URLSearchParams({
    _encoding: "UTF8",
    ASIN: asin,
    Format: "_SL400_",
    ID: "AsinImage",
    MarketPlace: "US",
    ServiceVersion: "20070822",
    WS: "1",
  });
  if (tag) {
    params.append("tag", tag);
  }
  return `https://ws-na.amazon-adsystem.com/widgets/q?${params.toString()}`;
}

function ProductCard({
  ctaLabel = "Shop now on Amazon",
  description,
  href,
  image,
  price,
  title,
}) {
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
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
          {price && (
            <p className="text-sm font-semibold text-emerald-700">{price}</p>
          )}
          <span className="mt-auto text-sm font-medium text-emerald-600">
            {ctaLabel} →
          </span>
        </div>
      </div>
    </a>
  );
}

/**
 * Renders Amazon affiliate ads using the Product Advertising API.
 * Falls back to rich static creatives when the API is unavailable.
 */
export default function AmazonBanner() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/amazon-ads");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setItems(Array.isArray(data.items) ? data.items : []);
          }
        } else if (!cancelled) {
          setItems([]);
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

  const fallbackCards = useMemo(
    () =>
      fallbackProducts.map((product) => ({
        ...product,
        image: buildAffiliateImageUrl(product),
        ctaLabel: product.ctaLabel || "Shop now on Amazon",
        price: product.price || "Check the latest price on Amazon",
      })),
    []
  );

  if (Array.isArray(items) && items.length > 0) {
    return (
      <div className="mt-8 mb-4 flex flex-wrap justify-center gap-4">
        {items.map((item) => (
          <ProductCard
            key={item.asin || item.link}
            href={item.link}
            image={item.image}
            price={item.price || "See today's price"}
            title={item.title}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 mb-4 flex flex-wrap justify-center gap-4">
      {fallbackCards.map((product) => (
        <ProductCard
          key={product.asin || product.href}
          href={product.href}
          image={product.image}
          price={product.price}
          title={product.title}
          description={product.description}
          ctaLabel={product.ctaLabel}
        />
      ))}
    </div>
  );
}
