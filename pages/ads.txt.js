import { getAdsTxtEntry } from "../utils/adsense";

export default function handler(req, res) {
  const lines = [
    "# Authorized digital sellers",
    getAdsTxtEntry(),
  ];

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(`${lines.join("\n")}\n`);
}
