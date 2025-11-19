import { getAdsTxtEntry } from "../utils/adsense";

export default function handler(req, res) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(`${getAdsTxtEntry()}\n`);
}
