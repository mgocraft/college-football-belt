import React from "react";

const FALLBACK_IMAGE = "/images/book-placeholder.svg";

function Badge({ team, badgeColor, badgeTextColor }) {
  if (!team) return null;

  const style = {
    backgroundColor: badgeColor || "rgba(16, 185, 129, 0.12)",
    color: badgeTextColor || "#065f46",
  };

  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide"
      style={style}
    >
      {team}
    </span>
  );
}

function BookCard({ book }) {
  const {
    title,
    author,
    team,
    description,
    link,
    image,
    imageAlt,
    badgeColor,
    badgeTextColor,
    cta,
    note,
  } = book;

  const imageSrc = image || FALLBACK_IMAGE;
  const altText = image
    ? imageAlt || `Cover of ${title}`
    : `Placeholder book cover for ${title}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 shadow-sm">
      <div className="flex gap-3">
        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-emerald-100">
          <img
            src={imageSrc}
            alt={altText}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <Badge team={team} badgeColor={badgeColor} badgeTextColor={badgeTextColor} />
          <h3 className="mt-1 text-base font-semibold text-slate-900">{title}</h3>
          {author && <p className="text-sm text-slate-600">{author}</p>}
          {description && (
            <p className="mt-2 text-sm leading-snug text-slate-700">{description}</p>
          )}
          {note && (
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-emerald-700">
              {note}
            </p>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
              aria-label={`View ${title} on Amazon (opens in a new tab)`}
            >
              {cta || "View on Amazon"}
              <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BeltBookBanner({
  title = "Belt Book of the Week",
  subtitle,
  description,
  books = [],
  disclosure,
}) {
  const hasBooks = Array.isArray(books) && books.length > 0;

  return (
    <div className="lg:sticky lg:top-6">
      <div className="rounded-3xl border border-emerald-200 bg-white/90 p-5 shadow-md backdrop-blur">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Weekly Spotlight
          </p>
          {title && <h2 className="text-xl font-bold text-emerald-900">{title}</h2>}
          {subtitle && <p className="text-sm font-semibold text-emerald-700">{subtitle}</p>}
        </div>

        {description && (
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{description}</p>
        )}

        <div className="mt-4 space-y-4">
          {hasBooks ? (
            books.map((book, index) => (
              <BookCard key={`${book.title}-${index}`} book={book} />
            ))
          ) : (
            <p className="text-sm text-slate-600">
              Add this week&apos;s selections in
              <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700">
                data/beltBookSpotlight.js
              </code>
              to feature matchup-specific reads.
            </p>
          )}
        </div>

        {disclosure && (
          <p className="mt-5 text-xs leading-relaxed text-slate-500">{disclosure}</p>
        )}
      </div>
    </div>
  );
}
