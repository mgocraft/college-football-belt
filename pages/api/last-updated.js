import { execSync } from 'child_process';

export default function handler(req, res) {
  try {
    const date = execSync('git log -1 --format=%cI', {
      encoding: 'utf-8',
      cwd: process.cwd(),
    }).trim();
    res.status(200).json({ lastUpdated: date });
  } catch (err) {
    res.status(500).json({ error: 'Unable to determine last updated time' });
  }
}
