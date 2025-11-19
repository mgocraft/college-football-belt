import { getAdsTxtEntry } from "../utils/adsense";

export async function getServerSideProps({ res }) {
  const adsTxtContents = `${getAdsTxtEntry()}\n`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600");
  res.write(adsTxtContents);
  res.end();

  return {
    props: {},
  };
}

export default function AdsTxt() {
  return null;
}
