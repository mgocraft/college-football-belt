import React, { useEffect, useState } from "react";

/**
 * Renders Amazon affiliate ads using the Product Advertising API.
 * Falls back to static SVG panels when the API is unavailable.
 */
export default function AmazonBanner() {
  const [items, setItems] = useState(null);
  const fallbackProducts = [
    {
      href: "https://www.amazon.com/PILOYINDE-Basketball-gators-Bedroom-Florida/dp/B0D8KTKMQW?crid=AHXD6SCISDXA&dib=eyJ2IjoiMSJ9.pk6LKRJrWyC7tifXE2tQbN2UHnVHAwrlI4IPwD53yX2X4rStgfTuv1E_gHFBJRWrYYNyzek8UgroFTHJ2qfBC9oFmhWiy6wCjPYdM_XIc9ixmGdf9mpDyNYY6kFC2lvq9Q-RouPS3N-7afPhlf5A8xbgqwmjs6dGSCNuwfl6LoHCn4NcQk-KFNeveGhubv6-mgtvtFedK9ZOKUEb78pPxg-PyAS1yWzmtKb2Cgn0K0PxHLRP3ELlvTId2RxRFpUWmn2XddGhIf56XIk9eMrKX-Nzb6rvOrDJpD8Tt9d6Ncw.c6dWX31Ia5o_cu0xK9xQRP160sau0_kFYXJ94CuoEl4&dib_tag=se&keywords=florida%2Bgators%2Bgear&qid=1758030266&sprefix=florida%2Bgators%2Bgrea%2Caps%2C196&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll1&tag=cfbbelt-20&linkId=038c37e92c6cfc6ad877d0ab0bbdf5d0&language=en_US&ref_=as_li_ss_tl",
      label: "Florida Gators Wall Art",
      fill: "#0021A5",
      textColor: "#ffffff",
    },
    {
      href: "https://www.amazon.com/Siskiyou-Miami-Hurricanes-Necklace-Pendant/dp/B00W5VNB80?crid=2JFJ68NWBB0NX&dib=eyJ2IjoiMSJ9.8JZNSm2ose3w2zaLqSd3PBZhCJ-vKRa68bFQC3LPRjgyVZ1NXG-QHYgY8kWt1ATtbrGSzEaY9IuZgACKQMgCy0La7mQzsa9ePeLeJm_YJ3S19do2X48i5kgFKqabrgPsWFjtv7XfN649imR0HHbahJWZLMi_kIaq-vr9papqFqiQZEQVP0dCljv6GgCHPehr5_9ufKPHbB-gzzq_3VOS9yDq44haNznBuNq8TRCYTK61npO2iEG_cQRDsS6HiwKf.0oqJ84BnenLzEa1sL8JwWJfu10NveksJa9PeMblZyRc&dib_tag=se&keywords=umiami%2Bgear&qid=1758030358&sprefix=umiami%2Bgear%2Caps%2C134&sr=8-8&th=1&linkCode=ll1&tag=cfbbelt-20&linkId=d5d97882d4d124be5d5f50200f486d04&language=en_US&ref_=as_li_ss_tl",
      label: "Miami Hurricanes Necklace",
      fill: "#F47321",
      textColor: "#ffffff",
    },
    {
      href: "https://www.amazon.com/Fantasy-Football-Championship-Belt-Customizable/dp/B07QYCVT29?crid=Q7YY7RE6H763&dib=eyJ2IjoiMSJ9.kwrLnnk6Djg0nFGBOv06n0Po5_hZjoaR-8Y3eBKS7At15wfR7JVGcdnuA6wg0jRDuePBB0gd9Dq77v8rHb5UDF2qnY3U6rcPLJLDg27HDzgPVC9Uq_4yIDLX_YALbnAdPF9Tstf-XS2QrqQyZQa63iY4x8rPVXA2tSdvlzYTLsZBye6JsR_aWH7q3HVWWqlhzP7ZlqDvzxXAe4OccreHLGt_eurivWY6pZB8MYscCOJMjAwgWG5GzBBtWwCdu79pBkcsOfvSbo8NRGxdjvDk8GqCtxQpxS3jLelakOPrgAs.FzhlfvbA3ygxTp0pooYXuj378S2he05Y6CjQoZgls-I&dib_tag=se&keywords=fantasy%2Bfootball%2Bbelt&qid=1758030444&sprefix=fantasy%2Bfootball%2Bbelt%2Caps%2C136&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll1&tag=cfbbelt-20&linkId=6fab320414a8b06b3008c4b4df84b9a9&language=en_US&ref_=as_li_ss_tl",
      label: "Fantasy Football Championship Belt",
      fill: "#C0A16B",
      textColor: "#000000",
    },
    {
      href: "https://amzn.to/3IaxStf",
      label: "Featured Amazon Pick",
      fill: "#006747",
      textColor: "#ffffff",
    },
  ];

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/amazon-ads");
        if (res.ok) {
          const data = await res.json();
          setItems(data.items);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-8 mb-4">
        {fallbackProducts.map((product) => (
          <a
            key={product.href}
            href={product.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <svg
              width="300"
              height="100"
              xmlns="http://www.w3.org/2000/svg"
              className="block max-w-full"
            >
              <rect width="300" height="100" fill={product.fill} />
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontFamily="Arial"
                fontSize="18"
                fill={product.textColor}
              >
                {product.label}
              </text>
            </svg>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8 mb-4">
      {items.map((item) => (
        <a
          key={item.asin}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-72 transition-shadow hover:shadow-md"
        >
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="block h-36 w-full object-cover"
              />
            )}
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-900 leading-snug">
                {item.title}
              </p>
              {item.price && (
                <p className="mt-2 text-sm font-bold text-emerald-700">
                  {item.price}
                </p>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
