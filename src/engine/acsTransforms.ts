import type { AgeBandStat, Education, MetroAcsStats, MetroDefinition } from '../types';

interface TableBundle {
  b01001: string[][];
  b02001: string[][];
  b03003: string[][];
  b12002: string[][];
  b15002: string[][];
  b19013: string[][];
}

const AGE_BANDS = [
  { key: '18-24', midAge: 21, maleKeys: ['B01001_007E', 'B01001_008E', 'B01001_009E'], femaleKeys: ['B01001_031E', 'B01001_032E', 'B01001_033E'] },
  { key: '25-29', midAge: 27, maleKeys: ['B01001_010E'], femaleKeys: ['B01001_034E'] },
  { key: '30-34', midAge: 32, maleKeys: ['B01001_011E'], femaleKeys: ['B01001_035E'] },
  { key: '35-39', midAge: 37, maleKeys: ['B01001_012E'], femaleKeys: ['B01001_036E'] },
  { key: '40-44', midAge: 42, maleKeys: ['B01001_013E'], femaleKeys: ['B01001_037E'] },
  { key: '45-49', midAge: 47, maleKeys: ['B01001_014E'], femaleKeys: ['B01001_038E'] },
  { key: '50-54', midAge: 52, maleKeys: ['B01001_015E'], femaleKeys: ['B01001_039E'] },
  { key: '55-59', midAge: 57, maleKeys: ['B01001_016E'], femaleKeys: ['B01001_040E'] },
  { key: '60-64', midAge: 62, maleKeys: ['B01001_017E'], femaleKeys: ['B01001_041E'] },
  { key: '65-74', midAge: 69, maleKeys: ['B01001_018E', 'B01001_019E'], femaleKeys: ['B01001_042E', 'B01001_043E'] },
  { key: '75+', midAge: 80, maleKeys: ['B01001_020E', 'B01001_021E', 'B01001_022E', 'B01001_023E', 'B01001_024E', 'B01001_025E'], femaleKeys: ['B01001_044E', 'B01001_045E', 'B01001_046E', 'B01001_047E', 'B01001_048E', 'B01001_049E'] },
] as const;
const B12002_BANDS = ['15-17','18-19','20-24','25-29','30-34','35-39','40-44','45-49','50-54','55-59','60-64','65-74','75-84','85+'] as const;
const EDUCATION_MAP: Record<Education, string[]> = {
  high_school_or_less: ['B15002_003E','B15002_004E','B15002_005E','B15002_006E','B15002_007E','B15002_008E','B15002_009E','B15002_010E','B15002_020E','B15002_021E','B15002_022E','B15002_023E','B15002_024E','B15002_025E','B15002_026E','B15002_027E'],
  some_college: ['B15002_012E','B15002_013E','B15002_030E','B15002_031E'],
  associates: ['B15002_014E','B15002_032E'],
  bachelors: ['B15002_015E','B15002_033E'],
  graduate: ['B15002_016E','B15002_017E','B15002_018E','B15002_034E','B15002_035E','B15002_036E'],
};
function toRecord(table: string[][]): Record<string, number> {
  const [headers, values] = table;
  const record: Record<string, number> = {};
  headers.forEach((header, idx) => {
    if (header.endsWith('E')) record[header] = Number(values[idx]) || 0;
  });
  return record;
}
const sum = (record: Record<string, number>, keys: readonly string[]) => keys.reduce((t, k) => t + (record[k] ?? 0), 0);
function buildSingleLookup(record: Record<string, number>, isFemale: boolean): Record<string, number> {
  const separatedStart = isFemale ? 129 : 36;
  const otherStart = isFemale ? 144 : 51;
  const widowedStart = isFemale ? 159 : 66;
  const divorcedStart = isFemale ? 174 : 81;
  const neverStart = isFemale ? 97 : 4;
  const lookup: Record<string, number> = {};
  B12002_BANDS.forEach((band, idx) => {
    const code = (n: number) => `B12002_${String(n + idx).padStart(3, '0')}E`;
    lookup[band] = (record[code(neverStart)] ?? 0) + (record[code(separatedStart)] ?? 0) + (record[code(otherStart)] ?? 0) + (record[code(widowedStart)] ?? 0) + (record[code(divorcedStart)] ?? 0);
  });
  return lookup;
}
function rollupSinglePopulation(ageBandKey: string, lookup: Record<string, number>): number {
  switch (ageBandKey) {
    case '18-24': return (lookup['18-19'] ?? 0) + (lookup['20-24'] ?? 0);
    case '25-29': return lookup['25-29'] ?? 0;
    case '30-34': return lookup['30-34'] ?? 0;
    case '35-39': return lookup['35-39'] ?? 0;
    case '40-44': return lookup['40-44'] ?? 0;
    case '45-49': return lookup['45-49'] ?? 0;
    case '50-54': return lookup['50-54'] ?? 0;
    case '55-59': return lookup['55-59'] ?? 0;
    case '60-64': return lookup['60-64'] ?? 0;
    case '65-74': return lookup['65-74'] ?? 0;
    case '75+': return (lookup['75-84'] ?? 0) + (lookup['85+'] ?? 0);
    default: return 0;
  }
}
export function transformTablesToMetroStats(metro: MetroDefinition, tables: TableBundle): MetroAcsStats {
  const ageRecord = toRecord(tables.b01001);
  const raceRecord = toRecord(tables.b02001);
  const hispanicRecord = toRecord(tables.b03003);
  const maritalRecord = toRecord(tables.b12002);
  const educationRecord = toRecord(tables.b15002);
  const incomeRecord = toRecord(tables.b19013);
  const totalPopulation = ageRecord['B01001_001E'] ?? 0;
  const malePopulation = ageRecord['B01001_002E'] ?? 0;
  const femalePopulation = ageRecord['B01001_026E'] ?? 0;
  const educationUniverse = educationRecord['B15002_001E'] ?? 1;
  const maleSinglesLookup = buildSingleLookup(maritalRecord, false);
  const femaleSinglesLookup = buildSingleLookup(maritalRecord, true);
  const ageBands: AgeBandStat[] = AGE_BANDS.map((band) => ({
    band: band.key,
    midAge: band.midAge,
    malePopulation: sum(ageRecord, band.maleKeys),
    femalePopulation: sum(ageRecord, band.femaleKeys),
    maleSinglePopulation: rollupSinglePopulation(band.key, maleSinglesLookup),
    femaleSinglePopulation: rollupSinglePopulation(band.key, femaleSinglesLookup),
  }));
  const hispanicShare = (hispanicRecord['B03003_003E'] ?? 0) / Math.max(totalPopulation, 1);
  const whiteShare = (raceRecord['B02001_002E'] ?? 0) / Math.max(totalPopulation, 1);
  const blackShare = (raceRecord['B02001_003E'] ?? 0) / Math.max(totalPopulation, 1);
  const asianShare = (raceRecord['B02001_005E'] ?? 0) / Math.max(totalPopulation, 1);
  const otherShare = Math.max(0, 1 - (hispanicShare + whiteShare + blackShare + asianShare));
  return {
    metroId: metro.id,
    metroLabel: metro.label,
    totalPopulation,
    malePopulation,
    femalePopulation,
    medianHouseholdIncome: incomeRecord['B19013_001E'] ?? 0,
    ethnicityShares: { white: whiteShare, black: blackShare, hispanic: hispanicShare, asian: asianShare, other: otherShare },
    educationShares: {
      high_school_or_less: sum(educationRecord, EDUCATION_MAP.high_school_or_less) / educationUniverse,
      some_college: sum(educationRecord, EDUCATION_MAP.some_college) / educationUniverse,
      associates: sum(educationRecord, EDUCATION_MAP.associates) / educationUniverse,
      bachelors: sum(educationRecord, EDUCATION_MAP.bachelors) / educationUniverse,
      graduate: sum(educationRecord, EDUCATION_MAP.graduate) / educationUniverse,
    },
    ageBands,
  };
}
