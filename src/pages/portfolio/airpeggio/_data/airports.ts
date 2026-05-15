export interface Airport {
  icao: string;
  iata?: string;
  name: string;
  city: string;
  state: string;
  timezone: string;
}

export const AIRPORTS: Airport[] = [
  { icao: "KHOU", iata: "HOU", name: "William P. Hobby", city: "Houston", state: "TX", timezone: "CDT" },
  { icao: "KDAL", iata: "DAL", name: "Dallas Love Field", city: "Dallas", state: "TX", timezone: "CDT" },
  { icao: "KAUS", iata: "AUS", name: "Austin-Bergstrom Intl", city: "Austin", state: "TX", timezone: "CDT" },
  { icao: "KADS", iata: "ADS", name: "Addison", city: "Addison", state: "TX", timezone: "CDT" },
  { icao: "KDTS", iata: "DTS", name: "Destin Executive", city: "Destin", state: "FL", timezone: "CDT" },
  { icao: "KTUL", iata: "TUL", name: "Tulsa Intl", city: "Tulsa", state: "OK", timezone: "CDT" },
  { icao: "KDEN", iata: "DEN", name: "Denver Intl", city: "Denver", state: "CO", timezone: "MDT" },
  { icao: "KMDW", iata: "MDW", name: "Chicago Midway", city: "Chicago", state: "IL", timezone: "CDT" },
  { icao: "KLAX", iata: "LAX", name: "Los Angeles Intl", city: "Los Angeles", state: "CA", timezone: "PDT" },
  { icao: "KBWI", iata: "BWI", name: "Baltimore/Washington Intl", city: "Baltimore", state: "MD", timezone: "EDT" },
  { icao: "KASE", iata: "ASE", name: "Aspen-Pitkin County", city: "Aspen", state: "CO", timezone: "MDT" },
  { icao: "KAPA", iata: "APA", name: "Centennial", city: "Denver", state: "CO", timezone: "MDT" },
  { icao: "KBGE", name: "Decatur County Industrial Air Park", city: "Bainbridge", state: "GA", timezone: "EDT" },
  { icao: "KTEB", iata: "TEB", name: "Teterboro", city: "Teterboro", state: "NJ", timezone: "EDT" },
  { icao: "KVNY", iata: "VNY", name: "Van Nuys", city: "Van Nuys", state: "CA", timezone: "PDT" },
  { icao: "KSDL", iata: "SDL", name: "Scottsdale", city: "Scottsdale", state: "AZ", timezone: "MST" },
  { icao: "KPBI", iata: "PBI", name: "Palm Beach Intl", city: "West Palm Beach", state: "FL", timezone: "EDT" },
  { icao: "KBED", iata: "BED", name: "Laurence G. Hanscom Field", city: "Bedford", state: "MA", timezone: "EDT" },
];

export const getAirport = (icao: string): Airport | undefined =>
  AIRPORTS.find((a) => a.icao === icao);
