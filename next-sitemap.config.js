const { readFileSync } = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const SITE_URL = 'https://collegefootballbelt.com';

const extractOpponent = (value) => {
  if (!value) return null;
  const match = value.match(/^(vs\.?|at)\s+(?:#\d+\s+)?(.*?)\s+\((?:W|L|T)\s+\d+[\-–]\d+\)/i);
  return match ? match[2].trim() : null;
};

const collectTeamPaths = () => {
  try {
    const csvPath = path.join(__dirname, 'data', 'belt-history.csv');
    const raw = readFileSync(csvPath, 'utf8');
    const records = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });
    const teams = new Set();

    records.forEach((record) => {
      const holder = (record.BeltHolder || '').trim();
      if (holder) teams.add(holder);

      const challenger = extractOpponent(record.BeltWon);
      if (challenger) teams.add(challenger);

      Object.keys(record)
        .filter((key) => key.toLowerCase().startsWith('defense'))
        .forEach((key) => {
          const opponent = extractOpponent(record[key]);
          if (opponent) teams.add(opponent);
        });
    });

    return Array.from(teams)
      .filter(Boolean)
      .map((team) => `/team/${encodeURIComponent(team)}`)
      .sort();
  } catch (error) {
    console.warn('next-sitemap: unable to parse belt-history.csv', error);
    return [];
  }
};

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: false,
  ignoreBuildManifest: true,
  exclude: ['/api/*', '/404', '/500'],
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => ({
    loc: path,
    changefreq: path === '/' ? 'daily' : config.changefreq,
    priority: path === '/' ? 1.0 : config.priority,
    lastmod: new Date().toISOString(),
  }),
  additionalPaths: async (config) => {
    const teamPaths = collectTeamPaths();
    const lastmod = new Date().toISOString();
    return teamPaths.map((loc) => ({
      loc,
      changefreq: 'weekly',
      priority: 0.6,
      lastmod,
    }));
  },
};
