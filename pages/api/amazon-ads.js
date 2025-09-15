import { searchItems } from "../../utils/amazon.js";

export default async function handler(req, res) {
  const { keywords = "college football gear" } = req.query;
  try {
    const data = await searchItems(keywords);
    const items = (data.SearchResult?.Items || []).slice(0, 3).map((item) => ({
      asin: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue,
      image: item.Images?.Primary?.Large?.URL,
      link: item.DetailPageURL,
    }));
    res.status(200).json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Amazon products" });
  }
}
