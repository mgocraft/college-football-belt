import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const beltHistoryPath = path.join(dataDir, 'belt-history.csv');
    const stat = await fs.promises.stat(beltHistoryPath);
    res.status(200).json({ lastUpdated: stat.mtime.toISOString() });
  } catch (err) {
    console.error('Failed to determine last updated time', err);
    res.status(500).json({ error: 'Unable to determine last updated time' });
  }
}
