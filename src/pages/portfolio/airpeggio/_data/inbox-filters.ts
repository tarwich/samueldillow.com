import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { AIRCRAFT } from "./aircraft";
import { AIRPORTS } from "./airports";
import { CONTACTS } from "./contacts";
import { CUSTOMERS } from "./customers";

faker.seed(505);

export interface InboxFilter {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  toEmails: string[];
  fromEmails: string[];
  blacklistEmails: string[];
  notifyEmails: string[];
  fallbackEmail?: string;
  daysOfWeek: string[];
  airports: string[];
  states: string[];
  countries: string[];
  airportRadiusMiles: number;
  roundTripsOnly: boolean;
  maxRangeNm: number;
  maxPassengers: number;
  petsAllowed: boolean;
}

export type InboxFilterDisplay = {
  id: string;
  name: string;
  priority: number;
  emails: [string, string][];
  criteria: [string, string][];
};

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const COUNTRIES = [
  "Bahamas",
  "Canada",
  "Cayman Islands",
  "Jamaica",
  "Mexico",
  "Panama",
  "Puerto Rico",
  "United States",
];
const TO_EMAILS = [
  "charter@airpeggio.example",
  "requests@airpeggio.example",
  "quotes@airpeggio.example",
];
const FILTER_NAMES = [
  "Texas Operators",
  "Mountain West",
  "Northeast Priority",
  // "Florida Weekends",
  "California Brokers",
  // "Southeast Short Hops",
  // "Canada Eligible",
  // "Bahamas Friendly",
  "Midweek Charter",
  // "Large Cabin Review",
];

const unique = <T>(items: T[]): T[] => [...new Set(items)];
const joinList = (items: string[]) => items.join(", ");
const yesNo = (value: boolean) => (value ? "Yes" : "No");
const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const pickMany = <T>(items: T[], min: number, max: number): T[] => {
  const count = faker.number.int({ min, max });
  return faker.helpers.arrayElements(items, count);
};

export const INBOX_FILTERS: InboxFilter[] = FILTER_NAMES.map((name, index) => {
  const airports = pickMany(AIRPORTS, 1, 3);
  const contacts = pickMany(CONTACTS, 1, 2);
  const customers = contacts
    .map((contact) =>
      CUSTOMERS.find((customer) => customer.id === contact.customerId),
    )
    .filter((customer): customer is NonNullable<typeof customer> => Boolean(customer));
  const aircraft = faker.helpers.arrayElement(AIRCRAFT);
  const fallbackDomain =
    faker.helpers.arrayElement(customers)?.domain ?? "airpeggio.example";

  return {
    id: nanoid(),
    name,
    enabled: faker.datatype.boolean({ probability: 0.9 }),
    priority: index < 3 ? 0 : faker.number.int({ min: 1, max: 4 }),
    toEmails: pickMany(TO_EMAILS, 1, 2),
    fromEmails: unique(customers.map((customer) => customer.domain)),
    blacklistEmails: faker.datatype.boolean({ probability: 0.25 })
      ? [`blocked.${faker.internet.domainName()}`]
      : [],
    notifyEmails: contacts.map((contact) => contact.email),
    fallbackEmail: faker.datatype.boolean({ probability: 0.35 })
      ? `unqualified@${fallbackDomain}`
      : undefined,
    daysOfWeek: pickMany(DAYS, 2, 5),
    airports: airports.map((airport) => airport.icao),
    states: unique(airports.map((airport) => airport.state)),
    countries: pickMany(COUNTRIES, 1, 4),
    airportRadiusMiles: faker.helpers.arrayElement([50, 75, 100, 150, 250]),
    roundTripsOnly: faker.datatype.boolean(),
    maxRangeNm: faker.number.int({ min: 900, max: 5000 }),
    maxPassengers: aircraft.paxCapacity,
    petsAllowed: faker.datatype.boolean(),
  };
});

export const inboxFilterToDisplay = (filter: InboxFilter): InboxFilterDisplay => {
  const emails: [string, string][] = [
    ["To", joinList(filter.toEmails)],
    ...filter.fromEmails.map((email): [string, string] => ["From", email]),
    ...filter.blacklistEmails.map((email): [string, string] => ["Blacklist", email]),
    ...filter.notifyEmails.map((email): [string, string] => ["Notify", email]),
  ];

  if (filter.fallbackEmail) {
    emails.push(["Fallback", filter.fallbackEmail]);
  }

  const criteria: [string, string][] = [
    ["Days of Week", joinList(filter.daysOfWeek)],
    [
      filter.airports.length > 0 ? "Airports" : "States",
      joinList(filter.airports.length > 0 ? filter.airports : filter.states),
    ],
    ["Airport Radius", `${formatNumber(filter.airportRadiusMiles)} miles`],
    ["Round Trips Only", yesNo(filter.roundTripsOnly)],
    ["Countries", joinList(filter.countries)],
    ["Max Range", `${formatNumber(filter.maxRangeNm)} nm`],
    ["Max Pax", String(filter.maxPassengers)],
    ["Pets Allowed", yesNo(filter.petsAllowed)],
  ];

  return {
    id: filter.id,
    name: filter.name,
    priority: filter.priority,
    emails,
    criteria,
  };
};

export const getInboxFilter = (id: string): InboxFilter | undefined =>
  INBOX_FILTERS.find((filter) => filter.id === id);
