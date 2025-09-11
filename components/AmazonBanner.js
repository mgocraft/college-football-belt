import React from "react";

/**
 * Simple Amazon affiliate banner composed of three ad panels.
 * Replace the SVG graphics with real images when available.
 */
export default function AmazonBanner() {
  return (
    <div className="flex flex-wrap justify-center gap-2 my-2">
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

