export const teamLogoMap = {
  Alabama: 333,
  Arizona: 12,
  ArizonaState: 9,
  Arkansas: 8,
  Auburn: 2,
  Baylor: 239,
  BYU: 252,
  California: 25,
  Clemson: 228,
  Florida: 57,
  FloridaState: 52,
  Georgia: 61,
  GeorgiaTech: 59,
  Iowa: 2294,
  KansasState: 2306,
  Kentucky: 96,
  LSU: 99,
  LongIslandUniversity: 2341,
  Maryland: 120,
  Miami: 2390,
  Michigan: 130,
  MichiganState: 127,
  Minnesota: 135,
  MississippiState: 344,
  Missouri: 142,
  NCState: 152,
  Nebraska: 158,
  NorthCarolina: 153,
  OhioState: 194,
  Oklahoma: 201,
  OklahomaState: 197,
  OleMiss: 145,
  Oregon: 2483,
  OregonState: 204,
  PennState: 213,
  Pittsburgh: 221,
  Purdue: 2509,
  SouthCarolina: 2579,
  SouthFlorida: 58,
  Stanford: 24,
  Syracuse: 183,
  Tennessee: 2633,
  Texas: 251,
  TexasAM: 245,
  TexasTech: 2641,
  TCU: 2628,
  UCLA: 26,
  USC: 30,
  Utah: 254,
  Virginia: 258,
  VirginiaTech: 259,
  Washington: 264,
  WashingtonState: 265,
  WestVirginia: 277,
  Wisconsin: 275,
  Harvard: 108,
  Princeton: 163,
  Penn: 219,
  NotreDame: 87,
  ColoradoState: 36,
  Yale: 43,
  
  Princeton: 163,
  Army: 349,
  Navy: 2426,
  Colgate: 2088,
  Cornell: 172,
  Brown: 225,
  Pennsylvania: 219,
  Columbia: 171,
  Dartmouth: 159,
  Lehigh: 2326,
  Fordham: 2230,
  HolyCross: 2313,
  Bucknell: 2085,
  Georgetown: 46,
 
  Villanova: 222,
  Duquesne: 2234,
  SacredHeart: 2509,
  StFrancisPA: 2599,
  Wagner: 2610,
  Merrimack: 2583,
  Bryant: 267,
  Stonehill: 2605,
  SMU: 2567,
    Rutgers: 164
};

export const normalizeTeamName = (name) => {
  if (!name) return '';
  return name.replace(/\s|\.|\(|\)|'|\-|&/g, '');
};

const parseDateToTimestamp = (value) => {
  if (!value) return null;

  const parts = value.split('/');
  if (parts.length !== 3) return null;

  const [monthStr, dayStr, yearStr] = parts;
  const month = Number.parseInt(monthStr, 10) - 1;
  const day = Number.parseInt(dayStr, 10);
  const year = Number.parseInt(yearStr, 10);

  if ([month, day, year].some((num) => Number.isNaN(num))) return null;

  const timestamp = new Date(year, month, day).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};


export function computeRecord(teamOrObj, beltData = []) {
  // Case 1: Object with .games (used by AllTeamsRecords)
  if (typeof teamOrObj === 'object' && teamOrObj.games) {
    const games = teamOrObj.games || [];

    const wins = games.filter(g => g.result === 'W').length;
    const losses = games.filter(g => g.result === 'L').length;
    const ties = games.filter(g => g.result === 'T').length;
    const winPct = wins + losses > 0 ? Number(((wins / (wins + losses)) * 100).toFixed(1)) : 0;

    return {
      wins,
      losses,
      ties,
      winPct,
      reigns: games.filter(g => g.result === 'W' && !g.opponent).length,
      lastReignStart: null,
      lastReignTimestamp: null,
      longestReign: 0,
    };
  }

  // Case 2: string team name and full beltData
  const teamName = teamOrObj;
  const normalizedTeam = normalizeTeamName(teamName);
  const games = [];
  const reigns = beltData.filter(r => normalizeTeamName(r.beltHolder) === normalizedTeam);
  const reignsMetadata = reigns.map((reign) => {
    const defenses = Number.isFinite(reign.numberOfDefenses) ? reign.numberOfDefenses : 0;
    return {
      start: reign.startOfReign,
      startTimestamp: parseDateToTimestamp(reign.startOfReign),
      defenses,
    };
  });

  const lastReignMeta = reignsMetadata.reduce((latest, current) => {
    if (current.startTimestamp == null) return latest;
    if (!latest || current.startTimestamp > latest.startTimestamp) return current;
    return latest;
  }, null);

  const longestReign = reignsMetadata.reduce((max, current) => {
    const defenses = Number.isFinite(current.defenses) ? current.defenses : 0;
    return defenses > max ? defenses : max;
  }, 0);

  beltData.forEach((reign, i) => {
    const holder = normalizeTeamName(reign.beltHolder);

    if (holder === normalizedTeam) {
      games.push({ result: 'W', opponent: null, date: reign.startOfReign });

      (reign.defenses || []).forEach((def) => {
        const opponent = cleanOpponentName(def);
        const result = getResult(def, false);
        games.push({ result, opponent, date: def });
      });
    } else {
      const defenses = reign.defenses || [];
      const nextReign = beltData[i + 1];
      const beltLost = nextReign && normalizeTeamName(nextReign.beltHolder) !== holder;

      defenses.forEach((def, j) => {
        const opponent = cleanOpponentName(def);
        const isFinalDefense = j === defenses.length - 1;
        if (opponent === normalizedTeam && !(isFinalDefense && beltLost)) {
          const result = getResult(def, true);
          games.push({ result, opponent: reign.beltHolder, date: def });
        }
      });
    }
  });

  const wins = games.filter(g => g.result === 'W').length;
  const losses = games.filter(g => g.result === 'L').length;
  const ties = games.filter(g => g.result === 'T').length;
  const winPct = wins + losses > 0 ? Number(((wins / (wins + losses)) * 100).toFixed(1)) : 0;

  return {
    wins,
    losses,
    ties,
    winPct,
    reigns: reigns.length,
    lastReignStart: lastReignMeta ? lastReignMeta.start : null,
    lastReignTimestamp: lastReignMeta ? lastReignMeta.startTimestamp : null,
    longestReign,
  };
}



export function cleanOpponentName(text) {
  if (!text) return null;
  let cleaned = text
    .trim()
    .replace(/^(vs\.|at)\s*/i, '')
    .replace(/^#\d+\s*/i, '');
  const parenIndex = cleaned.indexOf('(');
  if (parenIndex !== -1) cleaned = cleaned.substring(0, parenIndex).trim();
  return normalizeTeamName(cleaned);
}

export function getResult(text, asChallenger = false) {
  const match = text.match(/\((W|L|T)\s+(\d+)[\-–](\d+)\)/);
  if (!match) return null;

  const [_, resultLetter, score1, score2] = match;

  if (resultLetter === 'T') return 'T';

  if (asChallenger) {
    // If the belt holder won, the challenger lost
    return resultLetter === 'W' ? 'L' : 'W';
  } else {
    // Belt holder's POV
    return resultLetter;
  }
}

export function debugTeamGames(teamName, beltData = []) {
  const normalizedTeam = normalizeTeamName(teamName);
  const games = [];

  beltData.forEach((reign, i) => {
    const holder = normalizeTeamName(reign.beltHolder);

    if (holder === normalizedTeam) {
      games.push({
        result: 'W',
        opponent: null,
        date: reign.startOfReign,
        source: 'beltWon',
        text: reign.beltWon,
      });

      (reign.defenses || []).forEach(def => {
        const opponent = cleanOpponentName(def);
        const result = getResult(def);
        games.push({
          result,
          opponent,
          date: def,
          source: 'defense',
          text: def,
        });
      });

    } else {
      const defenses = reign.defenses || [];
      const nextReign = beltData[i + 1];
      const beltLost = nextReign && normalizeTeamName(nextReign.beltHolder) !== holder;

      defenses.forEach((def, j) => {
        const opponent = cleanOpponentName(def);
        const isFinalDefense = j === defenses.length - 1;

        if (opponent === normalizedTeam && !(isFinalDefense && beltLost)) {
          const result = getResult(def, true);
          games.push({
            result,
            opponent: reign.beltHolder,
            date: def,
            source: 'challenge',
            text: def,
          });
        }
      });
    }
  });

  console.log(`\n📋 Full game log for ${teamName}:\n`);
  games.forEach(g => {
    console.log(`${g.date} | ${g.source.toUpperCase()} | ${g.result} vs ${g.opponent} | ${g.text}`);
  });

  const lossCount = games.filter(g => g.result === 'L').length;
  const tieCount = games.filter(g => g.result === 'T').length;
  const winCount = games.filter(g => g.result === 'W').length;

  console.log(`\n📊 Totals: ${winCount} Wins – ${lossCount} Losses – ${tieCount} Ties\n`);
}
;
