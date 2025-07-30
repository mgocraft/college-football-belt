import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'belt-history.csv');
  const fileContent = fs.readFileSync(filePath);

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  const beltData = records.map((row) => {
    const defenses = Object.keys(row)
      .filter((key) => key.startsWith('Defense') && row[key])
      .map((key) => row[key]);

    return {
      reign: parseInt(row['Overall Reign #']),
      beltHolder: row['BeltHolder'],
      teamReign: parseInt(row['TeamReign']),
      startOfReign: row['StartofReign'],
      endOfReign: row['EndofReign'],
      numberOfDefenses: parseInt(row['# of Defenses']),
      beltWon: row['BeltWon'],
      defenses
    };
  });

  res.status(200).json(beltData);
}
