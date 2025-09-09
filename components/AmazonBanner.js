import Image from 'next/image';

export default function AmazonBanner() {
  return (
    <a
      href="https://www.amazon.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Amazon affiliate link"
    >
      <Image
        src="/amazon-banner.svg"
        alt="Amazon Banner"
        width={728}
        height={90}
      />
    </a>
  );
}
