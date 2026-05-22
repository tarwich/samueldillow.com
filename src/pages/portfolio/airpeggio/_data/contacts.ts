import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { CUSTOMERS, type Customer } from "./customers";
import { SALESPEOPLE } from "./salespeople";

faker.seed(202);

export type Gender = "M" | "F" | "X";

export interface Contact {
  id: string;
  customerId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  companyTitle?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  weight?: number;
  passportNumber?: string;
  passportCountry?: string;
  passportExpiry?: Date;
  city?: string;
  state?: string;
  driversLicense?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  salespersonId?: string;
  lastActive?: Date;
  tripsCount: number;
  notes?: string;
  /** When true, render the name as all caps in tables (matches reference screenshot). */
  shoutyName?: boolean;
  /** When true, omit the mobile number from the listing (matches reference screenshot). */
  hidePhone?: boolean;
}

const COMPANY_TITLES = [
  "CEO",
  "COO",
  "CFO",
  "Director of Travel",
  "Executive Assistant",
  "Operations Manager",
  "Account Manager",
  "Pilot",
  "Owner",
  "Founder",
];

const STATES = ["TX", "CA", "FL", "NY", "CO", "AZ", "WA", "IL", "GA", "NJ"];

/**
 * Stable contact IDs for the records that represent aircraft owners.
 * Aircraft templates reference these so the "View Profile" link on the
 * aircraft detail page always resolves to a real customer entry.
 */
export const AIRCRAFT_OWNER_CONTACT_IDS = {
  N482SD: nanoid(),
  N731AP: nanoid(),
  N904VX: nanoid(),
} as const;

/**
 * Stable contact id for the demo passenger seeded into reservation #151,
 * so the reservation seed can reference it without resolving by name.
 */
export const RESERVATION_151_PASSENGER_ID = nanoid();

const AIRCRAFT_OWNER_SEEDS: Array<
  Pick<Contact, "id" | "firstName" | "lastName" | "email" | "companyTitle">
> = [
  {
    id: AIRCRAFT_OWNER_CONTACT_IDS.N482SD,
    firstName: "Northstar",
    lastName: "Aero",
    email: "owner@northaero.example",
    companyTitle: "Owner",
  },
  {
    id: AIRCRAFT_OWNER_CONTACT_IDS.N731AP,
    firstName: "Airpeggio Demo",
    lastName: "Fleet",
    email: "ops@airpeggio.example",
    companyTitle: "Owner",
  },
  {
    id: AIRCRAFT_OWNER_CONTACT_IDS.N904VX,
    firstName: "Summit Flight",
    lastName: "Group",
    email: "dispatch@summitflight.example",
    companyTitle: "Owner",
  },
];

const ADMIN_PEOPLE: Array<Pick<Contact, "firstName" | "lastName" | "email">> = [
  {
    firstName: "Cloud",
    lastName: "Admin",
    email: `noreply@fox04-5d063.fingerprint.local`,
  },
  {
    firstName: "System",
    lastName: "Admin",
    email: `noreply@lofi21-82174.fingerprint.local`,
  },
];

const buildEmail = (first: string, last: string, customer: Customer) =>
  `${first}.${last}@${customer.domain}`.toLowerCase();

const maybe = <T,>(value: T, weight = 0.7): T | undefined =>
  faker.number.float({ min: 0, max: 1 }) < weight ? value : undefined;

const NOW = new Date("2026-05-13T12:00:00Z");

function makeContact(
  customer: Customer,
  overrides: Partial<Contact> = {},
): Contact {
  const firstName = overrides.firstName ?? faker.person.firstName();
  const lastName = overrides.lastName ?? faker.person.lastName();
  const email =
    overrides.email ??
    (customer === CUSTOMERS[0]
      ? buildEmail(firstName, lastName, customer)
      : faker.helpers.maybe(
          () => buildEmail(firstName, lastName, customer),
          { probability: 0.6 },
        ) ?? faker.internet.email({ firstName, lastName }).toLowerCase());

  return {
    id: nanoid(),
    customerId: customer.id,
    firstName,
    lastName,
    middleName: maybe(faker.person.firstName(), 0.25),
    email,
    phone: faker.phone.number({ style: "national" }),
    companyTitle: maybe(faker.helpers.arrayElement(COMPANY_TITLES), 0.55),
    gender: maybe(faker.helpers.arrayElement<Gender>(["M", "F", "X"]), 0.7),
    dateOfBirth: maybe(
      faker.date.birthdate({ min: 28, max: 72, mode: "age" }),
      0.55,
    ),
    weight: maybe(faker.number.int({ min: 120, max: 240 }), 0.4),
    passportNumber: maybe(
      faker.string.alphanumeric({ length: 9, casing: "upper" }),
      0.25,
    ),
    passportCountry: maybe(faker.location.countryCode("alpha-3"), 0.25),
    passportExpiry: maybe(faker.date.future({ years: 8 }), 0.2),
    city: maybe(faker.location.city(), 0.6),
    state: maybe(faker.helpers.arrayElement(STATES), 0.6),
    driversLicense: maybe(
      faker.string.alphanumeric({ length: 8, casing: "upper" }),
      0.35,
    ),
    emergencyContactName: maybe(faker.person.fullName(), 0.35),
    emergencyContactPhone: maybe(faker.phone.number({ style: "national" }), 0.35),
    salespersonId: maybe(faker.helpers.arrayElement(SALESPEOPLE).id, 0.45),
    lastActive: maybe(
      new Date(
        NOW.getTime() -
          faker.number.int({ min: 0, max: 220 }) * 24 * 60 * 60_000,
      ),
      0.55,
    ),
    tripsCount: faker.helpers.weightedArrayElement([
      { value: 0, weight: 6 },
      { value: faker.number.int({ min: 1, max: 4 }), weight: 3 },
      { value: faker.number.int({ min: 5, max: 18 }), weight: 1 },
    ]),
    notes: maybe(faker.lorem.sentence(), 0.15),
    ...overrides,
  };
}

const generated: Contact[] = CUSTOMERS.flatMap((customer) => {
  const count = faker.number.int({ min: 6, max: 12 });
  return Array.from({ length: count }, () => makeContact(customer));
});

const adminCompany = CUSTOMERS[0];
const adminContacts: Contact[] = ADMIN_PEOPLE.map((person) =>
  makeContact(adminCompany, {
    ...person,
    phone: "",
    hidePhone: true,
    tripsCount: 0,
    salespersonId: undefined,
    lastActive: undefined,
  }),
);

const aircraftOwnerContacts: Contact[] = AIRCRAFT_OWNER_SEEDS.map((seed) =>
  makeContact(adminCompany, {
    ...seed,
    phone: "",
    hidePhone: true,
    tripsCount: 0,
    salespersonId: undefined,
    lastActive: undefined,
  }),
);

// Passenger record for the demo trip 151. Kept lean so the People tab
// matches the source screenshots — DOB and gender populated, contact
// fields intentionally blank to mirror a minimally-filled passenger.
const reservation151Passenger: Contact = makeContact(adminCompany, {
  id: RESERVATION_151_PASSENGER_ID,
  firstName: "Chris",
  lastName: "Hofmann",
  email: "",
  phone: "",
  hidePhone: true,
  dateOfBirth: new Date(Date.UTC(1982, 7, 24)),
  gender: "M",
  weight: undefined,
  tripsCount: 1,
  salespersonId: undefined,
  lastActive: undefined,
  companyTitle: undefined,
});

const shoutyOverrides: Array<Partial<Contact>> = [
  { firstName: "Breanne", lastName: "Adkins", shoutyName: true },
  { firstName: "Linda", lastName: "Adams", hidePhone: true },
];

const shoutyContacts: Contact[] = shoutyOverrides.map((override) =>
  makeContact(faker.helpers.arrayElement(CUSTOMERS), override),
);

export const CONTACTS: Contact[] = [
  ...generated,
  ...shoutyContacts,
  ...adminContacts,
  ...aircraftOwnerContacts,
  reservation151Passenger,
].sort((a, b) => {
  const last = a.lastName.localeCompare(b.lastName, "en", {
    sensitivity: "base",
  });
  if (last !== 0) return last;
  return a.firstName.localeCompare(b.firstName, "en", { sensitivity: "base" });
});

export const getContact = (id: string): Contact | undefined =>
  CONTACTS.find((c) => c.id === id);

export const contactsForCustomer = (customerId: string): Contact[] =>
  CONTACTS.filter((c) => c.customerId === customerId);

export const contactFullName = (contact: Contact): string =>
  `${contact.firstName} ${contact.lastName}`;

export const contactDisplayName = (contact: Contact): string => {
  const full = contactFullName(contact);
  return contact.shoutyName ? full.toUpperCase() : full;
};
