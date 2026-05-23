import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { COMPANIES, type Company } from "./companies";
import { SALESPEOPLE } from "./salespeople";

faker.seed(202);

export type Gender = "M" | "F" | "X";

export interface Customer {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  fullName: string;
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

const buildEmail = (first: string, last: string, company: Company) =>
  `${first}.${last}@${company.domain}`.toLowerCase();

const maybe = <T,>(value: T, weight = 0.7): T | undefined =>
  faker.number.float({ min: 0, max: 1 }) < weight ? value : undefined;

const NOW = new Date("2026-05-13T12:00:00Z");

function makeCustomer(company: Company): Customer {
  const gender = faker.helpers.arrayElement<Gender>(["M", "F"]);
  const firstName =
    gender === "M"
      ? faker.person.firstName("male")
      : gender === "F"
        ? faker.person.firstName("female")
        : faker.person.firstName();
  const lastName = faker.person.lastName();
  const email =
    faker.helpers.maybe(() => buildEmail(firstName, lastName, company), {
      probability: 0.6,
    }) ?? faker.internet.email({ firstName, lastName }).toLowerCase();

  return {
    id: nanoid(),
    companyId: company.id,
    firstName,
    lastName,
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    email,
    phone: faker.phone.number({ style: "national" }),
    companyTitle: maybe(faker.helpers.arrayElement(COMPANY_TITLES), 0.55),
    gender,
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
    emergencyContactPhone: maybe(
      faker.phone.number({ style: "national" }),
      0.35,
    ),
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
  };
}

const generated: Customer[] = COMPANIES.flatMap((company) => {
  const count = faker.number.int({ min: 6, max: 12 });
  return Array.from({ length: count }, () => makeCustomer(company));
});

export const CUSTOMERS: Customer[] = generated.sort((a, b) => {
  const last = a.lastName.localeCompare(b.lastName, "en", {
    sensitivity: "base",
  });
  if (last !== 0) return last;
  return a.firstName.localeCompare(b.firstName, "en", { sensitivity: "base" });
});

export const getCustomer = (id: string): Customer | undefined =>
  CUSTOMERS.find((c) => c.id === id);

export const customersForCompany = (companyId: string): Customer[] =>
  CUSTOMERS.filter((c) => c.companyId === companyId);

const formatDateForInput = (date?: Date) =>
  date
    ? `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`
    : "";

export interface CustomerEditPayload {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  weight: number | "";
  companyName: string;
  companyTitle: string;
  passportNumber: string;
  passportCountry: string;
  passportExpiry: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  driversLicense: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  salespersonName: string;
  notes: string;
}

export function customerEditPayload(
  customer: Customer,
  company?: Company,
): CustomerEditPayload {
  const salesperson = customer.salespersonId
    ? SALESPEOPLE.find((s) => s.id === customer.salespersonId)
    : undefined;
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    dateOfBirth: formatDateForInput(customer.dateOfBirth),
    gender: customer.gender ?? "M",
    weight: customer.weight ?? "",
    companyName: company?.name ?? "",
    companyTitle: customer.companyTitle ?? "",
    passportNumber: customer.passportNumber ?? "",
    passportCountry: customer.passportCountry ?? "",
    passportExpiry: formatDateForInput(customer.passportExpiry),
    phone: customer.phone,
    email: customer.email,
    city: customer.city ?? "",
    state: customer.state ?? "",
    driversLicense: customer.driversLicense ?? "",
    emergencyContactName: customer.emergencyContactName ?? "",
    emergencyContactPhone: customer.emergencyContactPhone ?? "",
    salespersonName: salesperson?.name ?? "",
    notes: customer.notes ?? "",
  };
}

