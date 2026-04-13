import type { MetroDefinition } from '../types';

export const metros: MetroDefinition[] = [
  { id: 'dfw', label: 'Dallas–Fort Worth', cbsa: '19100', latitude: 32.7767, longitude: -96.7970 },
  { id: 'houston', label: 'Houston', cbsa: '26420', latitude: 29.7604, longitude: -95.3698 },
  { id: 'austin', label: 'Austin', cbsa: '12420', latitude: 30.2672, longitude: -97.7431 },
  { id: 'atlanta', label: 'Atlanta', cbsa: '12060', latitude: 33.7490, longitude: -84.3880 },
  { id: 'dc', label: 'Washington, DC', cbsa: '47900', latitude: 38.9072, longitude: -77.0369 },
  { id: 'miami', label: 'Miami', cbsa: '33100', latitude: 25.7617, longitude: -80.1918 },
  { id: 'orlando', label: 'Orlando', cbsa: '36740', latitude: 28.5383, longitude: -81.3792 },
  { id: 'charlotte', label: 'Charlotte', cbsa: '16740', latitude: 35.2271, longitude: -80.8431 },
  { id: 'nashville', label: 'Nashville', cbsa: '34980', latitude: 36.1627, longitude: -86.7816 },
  { id: 'chicago', label: 'Chicago', cbsa: '16980', latitude: 41.8781, longitude: -87.6298 },
  { id: 'nyc', label: 'New York City', cbsa: '35620', latitude: 40.7128, longitude: -74.0060 },
  { id: 'philadelphia', label: 'Philadelphia', cbsa: '37980', latitude: 39.9526, longitude: -75.1652 },
  { id: 'phoenix', label: 'Phoenix', cbsa: '38060', latitude: 33.4484, longitude: -112.0740 },
  { id: 'denver', label: 'Denver', cbsa: '19740', latitude: 39.7392, longitude: -104.9903 },
  { id: 'seattle', label: 'Seattle', cbsa: '42660', latitude: 47.6062, longitude: -122.3321 },
  { id: 'la', label: 'Los Angeles', cbsa: '31080', latitude: 34.0522, longitude: -118.2437 },
  { id: 'sandiego', label: 'San Diego', cbsa: '41740', latitude: 32.7157, longitude: -117.1611 },
  { id: 'sf', label: 'San Francisco Bay Area', cbsa: '41860', latitude: 37.7749, longitude: -122.4194 },
  { id: 'detroit', label: 'Detroit', cbsa: '19820', latitude: 42.3314, longitude: -83.0458 },
  { id: 'minneapolis', label: 'Minneapolis–St. Paul', cbsa: '33460', latitude: 44.9778, longitude: -93.2650 },
];

export const metroById = Object.fromEntries(metros.map((metro) => [metro.id, metro]));
