import React, { useEffect, useState } from "react";

/**
 * Renders Amazon affiliate ads using the Product Advertising API.
 * Falls back to static SVG panels when the API is unavailable.
 */
export default function AmazonBanner() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "/api/amazon-ads?keywords=college%20football%20gear"
        );
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
        <a
          href="https://amzn.to/4gmUa7I"
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
            <rect width="300" height="100" fill="#006747" />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontFamily="Arial"
              fontSize="20"
              fill="#ffffff"
            >
              USF Bulls Gear
            </text>
          </svg>
        </a>

        <a
          href="https://amzn.to/4nrJHu1"
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
            <rect width="300" height="100" fill="#c0a16b" />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontFamily="Arial"
              fontSize="20"
              fill="#000000"
            >
              Fantasy Football Belts
            </text>
          </svg>
        </a>

        <a
          href="https://amzn.to/4nrJHu1"
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
            <rect width="300" height="100" fill="#f47321" />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontFamily="Arial"
              fontSize="20"
              fill="#ffffff"
            >
              Miami Hurricanes Gear
            </text>
          </svg>
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-8 mb-4">
      {items.map((item) => (
        <a
          key={item.asin}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={item.image}
            alt={item.title}
            className="block max-w-full w-72 h-24 object-cover"
          />
        </a>
      ))}
    </div>
  );
}
