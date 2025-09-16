import React from "react";
import styles from "./BeltBookBanner.module.css";

const FALLBACK_IMAGE = "/images/book-placeholder.svg";

function Badge({ team, badgeColor, badgeTextColor }) {
  if (!team) return null;

  const style = {
    backgroundColor: badgeColor || "rgba(16, 185, 129, 0.12)",
    color: badgeTextColor || "#065f46",
  };

  return (
    <span className={styles.badge} style={style}>
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
    <div className={styles.bookCard}>
      <div className={styles.bookCardContent}>
        <div className={styles.bookImageWrapper}>
          <img
            src={imageSrc}
            alt={altText}
            loading="lazy"
            className={styles.bookImage}
          />
        </div>
        <div className={styles.bookDetails}>
          <Badge team={team} badgeColor={badgeColor} badgeTextColor={badgeTextColor} />
          <h3 className={styles.bookTitle}>{title}</h3>
          {author && <p className={styles.bookAuthor}>{author}</p>}
          {description && (
            <p className={styles.bookDescription}>{description}</p>
          )}
          {note && (
            <p className={styles.bookNote}>
              {note}
            </p>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bookLink}
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
    <div className={styles.stickyWrapper}>
      <div className={styles.banner}>
        <div className={styles.header}>
          <p className={styles.headerLabel}>Weekly Spotlight</p>
          {title && <h2 className={styles.headerTitle}>{title}</h2>}
          {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
        </div>

        {description && (
          <p className={styles.description}>{description}</p>
        )}

        <div className={styles.bookList}>
          {hasBooks ? (
            books.map((book, index) => (
              <BookCard key={`${book.title}-${index}`} book={book} />
            ))
          ) : (
            <p className={styles.emptyMessage}>
              Add this week&apos;s selections in
              <code className={styles.codeInline}>
                data/beltBookSpotlight.js
              </code>
              to feature matchup-specific reads.
            </p>
          )}
        </div>

        {disclosure && (
          <p className={styles.disclosure}>{disclosure}</p>
        )}
      </div>
    </div>
  );
}
