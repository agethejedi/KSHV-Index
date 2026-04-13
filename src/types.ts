export type Gender = 'male' | 'female';
export type Ethnicity = 'white' | 'black' | 'hispanic' | 'asian' | 'other';
export type Education = 'high_school_or_less' | 'some_college' | 'associates' | 'bachelors' | 'graduate';

export interface UserProfile {
  gender: Gender;
  age: number;
  ethnicity: Ethnicity;
  metro: string;
  income: number;
  education: Education;
  childrenCount: number;
  priorMarriages: number;
  heightFeet: number;
  heightInchesRemainder: number;
  weightLbs: number;
}

export interface MetroDefinition {
  id: string;
  label: string;
  cbsa: string;
  latitude: number;
  longitude: number;
}

export interface AgeBandStat {
  band: string;
  midAge: number;
  malePopulation: number;
  femalePopulation: number;
  maleSinglePopulation: number;
  femaleSinglePopulation: number;
}

export interface MetroAcsStats {
  metroId: string;
  metroLabel: string;
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  medianHouseholdIncome: number;
  ethnicityShares: Record<Ethnicity, number>;
  educationShares: Record<Education, number>;
  ageBands: AgeBandStat[];
}

export interface Driver {
  label: string;
  direction: 'positive' | 'negative';
  impact: number;
}

export interface KSResult {
  metroId: string;
  metroLabel: string;
  ksRaw: number;
  ksScore: number;
  percentile: number;
  demandPool: number;
  competitionPool: number;
  scoreMean: number;
  scoreStdDev: number;
  zScore: number;
  drivers: Driver[];
  summary: {
    ageTargetMin: number;
    ageTargetMax: number;
    metroMedianIncome: number;
  };
}
