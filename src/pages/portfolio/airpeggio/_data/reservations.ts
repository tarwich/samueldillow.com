import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { ACCOUNTS, SALESPEOPLE, type Account } from "./accounts";
import { AIRCRAFT, type Aircraft } from "./aircraft";
import { AIRPORTS, getAirport } from "./airports";
import { CUSTOMERS, type Customer } from "./customers";
import { COMPANIES, type Company } from "./companies";

faker.seed(707);

export type ReservationLifecycle =
  | "planned"
  | "scheduled"
  | "flown"
  | "cancelled";
export type ReservationApproval = "pending" | "quoted" | "approved";
export type ReservationActivity =
  | "Charter Flight"
  | "Aircraft Owner Flight"
  | "Training Flight"
  | "Leaseback/Rental Flight"
  | "Maintenance Reservation";
export type Regulation = "135" | "91" | "121";

export interface ReservationLeg {
  id: string;
  origin: string;
  destination: string;
  departure: Date;
  passengers: number;
  blockMinutes?: number;
  regulation?: Regulation;
  flightNumber?: number;
  notes?: string;
}

export interface ReservationPilot {
  accountId: string;
  position: "PIC" | "SIC";
  legIds: string[];
}

export interface ReservationPassenger {
  customerId: string;
  legIds: string[];
}

export interface ReservationQuote {
  number: number;
  amount: number;
  status: "paid" | "unpaid";
}

export interface ReservationFlightLog {
  legId: string;
  hobbsOut: number;
  hobbsIn: number;
  totalHours: number;
  fuelAdd: number;
  fuelOut: number;
  fuelIn: number;
  fuelBurn: number;
  pax: number;
}

export interface Reservation {
  id: string;
  tripNumber: number;
  orderNumber?: string;
  aircraftId: string;
  companyId?: string;
  customerId?: string;
  salespersonId?: string;
  crewAccountIds: string[];
  assignedAccountId: string;
  activity: ReservationActivity;
  lifecycle: ReservationLifecycle;
  approval?: ReservationApproval;
  legs: ReservationLeg[];
  tags: string[];
  crewNotes?: string;
  passengerNotes?: string;
  autoCalculate: boolean;
  pilots?: ReservationPilot[];
  reservedPassengers?: ReservationPassenger[];
  quote?: ReservationQuote;
  flightLogs?: ReservationFlightLog[];
}

const AIRPORT_CODES = AIRPORTS.map((a) => a.icao);

const pickAirport = (exclude?: string): string => {
  let next = exclude;
  while (!next || next === exclude) {
    next = faker.helpers.arrayElement(AIRPORT_CODES);
  }
  return next;
};

const generateLegs = (
  count: number,
  start: Date,
  paxCap: number,
  paxOverride?: number,
): ReservationLeg[] => {
  const legs: ReservationLeg[] = [];
  let prev: string | undefined;
  let cursor = new Date(start);
  for (let i = 0; i < count; i++) {
    const origin = prev ?? faker.helpers.arrayElement(AIRPORT_CODES);
    const destination = pickAirport(origin);
    const block = faker.number.int({ min: 60, max: 240 });
    const departure = new Date(cursor);
    legs.push({
      id: nanoid(),
      origin,
      destination,
      departure,
      passengers:
        paxOverride ?? faker.number.int({ min: 0, max: Math.max(1, paxCap) }),
    });
    prev = destination;
    cursor = new Date(
      departure.getTime() +
      (block + faker.number.int({ min: 60, max: 600 })) * 60_000,
    );
  }
  return legs;
};

const date = (iso: string) => new Date(iso);

const aircraftByTail = (tail: string): Aircraft => {
  const a = AIRCRAFT.find((a) => a.tail === tail);
  if (!a) throw new Error(`Missing aircraft ${tail}`);
  return a;
};

const N20AS = aircraftByTail("N482SD");
const N765PM = aircraftByTail("N731AP");
const N904VX = aircraftByTail("N904VX");

const SD = ACCOUNTS[2]; // current user (a3)
const CH = ACCOUNTS[0]; // a1
const CO = ACCOUNTS[4]; // a5

// Auto-pick company + booking-customer pairs from the generated DB for each
// seeded reservation that needs one. Deterministic via faker.seed above.
const companiesWithCustomers = COMPANIES.filter((co) =>
  CUSTOMERS.some((cu) => cu.companyId === co.id),
);

const pickCompanyWithCustomers = (): Company =>
  faker.helpers.arrayElement(companiesWithCustomers);

const pickCustomerFor = (companyId: string): Customer =>
  faker.helpers.arrayElement(
    CUSTOMERS.filter((c) => c.companyId === companyId),
  );

const trip151Company = pickCompanyWithCustomers();
const trip151Customer = pickCustomerFor(trip151Company.id);
const trip151Passenger = faker.helpers.arrayElement(
  CUSTOMERS.filter((c) => c.id !== trip151Customer.id),
);

const charterCompany = pickCompanyWithCustomers();
const charterCustomer = pickCustomerFor(charterCompany.id);

const repeatCompany = pickCompanyWithCustomers();
const repeatCustomer = pickCustomerFor(repeatCompany.id);

const initialsFor = (account: Account): string =>
  (account.firstName[0] + account.lastName[0]).toUpperCase();

export const reservationInitials = initialsFor;

export interface ReservationTagStyle {
  background: string;
  color: string;
}

export const RESERVATION_TAG_STYLES: Record<string, ReservationTagStyle> = {
  Organ: { background: "#0b0b0d", color: "#ffffff" },
  Executive: { background: "#3f8a96", color: "#ffffff" },
  Broker: { background: "#c7d533", color: "#1a1a1a" },
  VIP: { background: "#510c62", color: "#ffffff" },
  Owner: { background: "#d4a017", color: "#1a1a1a" },
  Repeat: { background: "#d9dde9", color: "#1a1a1a" },
};

const TAG_NAMES = Object.keys(RESERVATION_TAG_STYLES);

export const reservationTagStyle = (name: string): ReservationTagStyle =>
  RESERVATION_TAG_STYLES[name] ?? { background: "#d9dde9", color: "#1a1a1a" };

const RESERVATION_SEEDS: Reservation[] = [
  {
    id: nanoid(),
    tripNumber: 152,
    aircraftId: N20AS.id,
    crewAccountIds: [SD.id],
    assignedAccountId: SD.id,
    activity: "Charter Flight",
    lifecycle: "planned",
    approval: "pending",
    legs: [
      {
        id: nanoid(),
        origin: "KDAL",
        destination: "KHOU",
        departure: date("2026-05-06T17:43:00Z"),
        passengers: 0,
      },
    ],
    tags: [],
    autoCalculate: true,
  },
  ((): Reservation => {
    const legA: ReservationLeg = {
      id: nanoid(),
      origin: "KADS",
      destination: "KDTS",
      departure: date("2026-05-03T14:00:00Z"),
      passengers: 6,
      blockMinutes: 102,
      regulation: "135",
      flightNumber: 2489,
    };
    const legB: ReservationLeg = {
      id: nanoid(),
      origin: "KDTS",
      destination: "KADS",
      departure: date("2026-05-09T18:00:00Z"),
      passengers: 6,
      blockMinutes: 149,
      regulation: "135",
      flightNumber: 2490,
    };
    return {
      id: nanoid(),
      tripNumber: 151,
      aircraftId: N20AS.id,
      companyId: trip151Company.id,
      customerId: trip151Customer.id,
      salespersonId: faker.helpers.maybe(() => faker.helpers.arrayElement(SALESPEOPLE).id, { probability: 0.7 }),
      crewAccountIds: [CH.id, CO.id],
      assignedAccountId: CH.id,
      activity: "Charter Flight",
      lifecycle: "scheduled",
      approval: "approved",
      legs: [legA, legB],
      tags: [],
      autoCalculate: true,
      pilots: [
        { accountId: CH.id, position: "PIC", legIds: [legA.id, legB.id] },
        { accountId: CO.id, position: "SIC", legIds: [legA.id, legB.id] },
      ],
      reservedPassengers: [
        {
          customerId: trip151Passenger.id,
          legIds: [legA.id, legB.id],
        },
      ],
      quote: { number: 83, amount: 19_800, status: "unpaid" },
      flightLogs: [
        {
          legId: legA.id,
          hobbsOut: 0,
          hobbsIn: 0,
          totalHours: 0,
          fuelAdd: 0,
          fuelOut: 0,
          fuelIn: 0,
          fuelBurn: 0,
          pax: 0,
        },
        {
          legId: legB.id,
          hobbsOut: 0,
          hobbsIn: 0,
          totalHours: 0,
          fuelAdd: 0,
          fuelOut: 0,
          fuelIn: 0,
          fuelBurn: 0,
          pax: 0,
        },
      ],
    };
  })(),
  {
    id: nanoid(),
    tripNumber: 150,
    aircraftId: N765PM.id,
    crewAccountIds: [CH.id, CO.id],
    assignedAccountId: CH.id,
    activity: "Aircraft Owner Flight",
    lifecycle: "planned",
    legs: [
      {
        id: nanoid(),
        origin: "KDAL",
        destination: "KDAL",
        departure: date("2026-04-30T19:50:00Z"),
        passengers: 1,
      },
    ],
    tags: ["Organ"],
    autoCalculate: true,
  },
  {
    id: nanoid(),
    tripNumber: 149,
    aircraftId: N765PM.id,
    companyId: charterCompany.id,
    customerId: charterCustomer.id,
    salespersonId: SALESPEOPLE[1]?.id,
    crewAccountIds: [SD.id],
    assignedAccountId: SD.id,
    activity: "Charter Flight",
    lifecycle: "flown",
    legs: [
      {
        id: nanoid(),
        origin: "KDAL",
        destination: "KHOU",
        departure: date("2026-04-23T19:27:00Z"),
        passengers: 0,
      },
    ],
    tags: ["Executive", "Broker"],
    autoCalculate: true,
  },
  {
    id: nanoid(),
    tripNumber: 148,
    aircraftId: N765PM.id,
    companyId: charterCompany.id,
    customerId: charterCustomer.id,
    salespersonId: SALESPEOPLE[1]?.id,
    crewAccountIds: [SD.id, CH.id],
    assignedAccountId: SD.id,
    activity: "Charter Flight",
    lifecycle: "scheduled",
    legs: [
      ["KLAX", "KMDW", "2026-01-15T22:43:00Z"],
      ["KMDW", "KLAX", "2026-01-16T08:02:00Z"],
      ["KLAX", "KMDW", "2026-02-15T22:45:00Z"],
      ["KMDW", "KLAX", "2026-02-16T22:45:00Z"],
      ["KLAX", "KMDW", "2026-03-15T21:45:00Z"],
      ["KMDW", "KLAX", "2026-03-16T21:45:00Z"],
      ["KLAX", "KMDW", "2026-04-15T21:45:00Z"],
      ["KMDW", "KLAX", "2026-04-16T21:45:00Z"],
      ["KLAX", "KMDW", "2026-05-15T21:45:00Z"],
      ["KMDW", "KLAX", "2026-05-16T21:45:00Z"],
      ["KLAX", "KMDW", "2026-06-15T21:45:00Z"],
      ["KMDW", "KLAX", "2026-06-16T21:45:00Z"],
      ["KLAX", "KMDW", "2026-07-15T21:45:00Z"],
      ["KMDW", "KLAX", "2026-07-16T21:45:00Z"],
    ].map(([origin, destination, departure]) => ({
      id: nanoid(),
      origin,
      destination,
      departure: date(departure),
      passengers: 0,
    })),
    tags: [],
    autoCalculate: true,
  },
  {
    id: nanoid(),
    tripNumber: 147,
    aircraftId: N904VX.id,
    companyId: repeatCompany.id,
    customerId: repeatCustomer.id,
    salespersonId: SALESPEOPLE[2]?.id,
    crewAccountIds: [SD.id, CH.id],
    assignedAccountId: SD.id,
    activity: "Charter Flight",
    lifecycle: "scheduled",
    approval: "quoted",
    legs: [
      {
        id: nanoid(),
        origin: "KDAL",
        destination: "KTUL",
        departure: date("2026-02-14T20:17:00Z"),
        passengers: 2,
      },
      {
        id: nanoid(),
        origin: "KTUL",
        destination: "KDEN",
        departure: date("2026-02-15T22:07:00Z"),
        passengers: 2,
      },
    ],
    tags: [],
    autoCalculate: true,
  },
];

const generatedFiller: Reservation[] = (() => {
  const out: Reservation[] = [];
  let trip = 146;
  for (let i = 0; i < 14; i++, trip--) {
    const aircraft = faker.helpers.arrayElement(AIRCRAFT);
    const start = faker.date.between({
      from: "2026-01-05T00:00:00Z",
      to: "2026-05-12T00:00:00Z",
    });
    const crewCount = faker.helpers.weightedArrayElement([
      { value: 1, weight: 1 },
      { value: 2, weight: 3 },
    ]);
    const crew = faker.helpers
      .arrayElements(ACCOUNTS.filter((a) => a.roles.includes("pilot")), crewCount)
      .map((a) => a.id);
    const lifecycle: ReservationLifecycle =
      faker.helpers.weightedArrayElement<ReservationLifecycle>([
        { value: "planned", weight: 2 },
        { value: "scheduled", weight: 4 },
        { value: "flown", weight: 3 },
        { value: "cancelled", weight: 1 },
      ]);
    const approval =
      lifecycle === "scheduled"
        ? faker.helpers.maybe(
          () =>
            faker.helpers.arrayElement<ReservationApproval>([
              "quoted",
              "approved",
            ]),
          { probability: 0.6 },
        )
        : lifecycle === "planned"
          ? faker.helpers.maybe(() => "pending" as ReservationApproval, {
            probability: 0.4,
          })
          : undefined;
    const company = pickCompanyWithCustomers();
    const customer = pickCustomerFor(company.id);
    const tags: string[] =
      faker.helpers.maybe<string[]>(
        () => {
          const first = faker.helpers.arrayElement(TAG_NAMES);
          const second = faker.helpers.maybe(
            () => faker.helpers.arrayElement(TAG_NAMES.filter((t) => t !== first)),
            { probability: 0.2 },
          );
          return second ? [first, second] : [first];
        },
        { probability: 0.3 },
      ) ?? [];
    out.push({
      id: nanoid(),
      tripNumber: trip,
      aircraftId: aircraft.id,
      companyId: company.id,
      customerId: customer.id,
      salespersonId: faker.helpers.arrayElement(SALESPEOPLE).id,
      crewAccountIds: crew,
      assignedAccountId: crew[0] ?? SD.id,
      activity: "Charter Flight",
      lifecycle,
      approval,
      legs: generateLegs(
        faker.number.int({ min: 1, max: 3 }),
        start,
        aircraft.paxCapacity,
      ),
      tags,
      autoCalculate: true,
    });
  }
  return out;
})();

export const RESERVATIONS: Reservation[] = [
  ...RESERVATION_SEEDS,
  ...generatedFiller,
].sort((a, b) => b.tripNumber - a.tripNumber);

export const getReservation = (id: string): Reservation | undefined =>
  RESERVATIONS.find((r) => r.id === id);

const monthFmt = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "2-digit",
});
const timeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export const formatLegDate = (date: Date): string => monthFmt.format(date);

export const formatLegTime = (date: Date): string => timeFmt.format(date);

export const formatLegTimezone = (icao: string): string =>
  getAirport(icao)?.timezone ?? "CDT";

export const reservationCrewLabel = (reservation: Reservation): string[] =>
  reservation.crewAccountIds
    .map((id) => ACCOUNTS.find((a) => a.id === id))
    .filter((a): a is Account => !!a)
    .map(initialsFor);

export const reservationAssignedLabel = (reservation: Reservation): string => {
  const account = ACCOUNTS.find((a) => a.id === reservation.assignedAccountId);
  return account ? initialsFor(account) : "-";
};

export const reservationAircraft = (
  reservation: Reservation,
): Aircraft | undefined => AIRCRAFT.find((a) => a.id === reservation.aircraftId);

export const reservationCompany = (
  reservation: Reservation,
): Company | undefined =>
  reservation.companyId
    ? COMPANIES.find((c) => c.id === reservation.companyId)
    : undefined;

export const reservationCustomer = (
  reservation: Reservation,
): Customer | undefined =>
  reservation.customerId
    ? CUSTOMERS.find((c) => c.id === reservation.customerId)
    : undefined;

export const reservationSalesperson = (
  reservation: Reservation,
): Account | undefined =>
  reservation.salespersonId
    ? SALESPEOPLE.find((s) => s.id === reservation.salespersonId)
    : undefined;

// Deterministic 60-239 minute block from the leg id, so generated legs have
// stable arrival times without needing per-leg seed data.
const hashedDefaultBlock = (leg: ReservationLeg): number => {
  let h = 0;
  for (let i = 0; i < leg.id.length; i++) {
    h = (h * 31 + leg.id.charCodeAt(i)) >>> 0;
  }
  return 60 + (h % 180);
};

export const legBlockMinutes = (leg: ReservationLeg): number =>
  leg.blockMinutes ?? hashedDefaultBlock(leg);

export const legRegulation = (leg: ReservationLeg): Regulation =>
  leg.regulation ?? "135";

export const legArrival = (leg: ReservationLeg): Date =>
  new Date(leg.departure.getTime() + legBlockMinutes(leg) * 60_000);

// Duty time is block + 1h30m of pre/post-flight overhead — matches the
// 1h42m→3h12m and 2h29m→3h59m relationship shown in the screenshots.
export const legDutyMinutes = (leg: ReservationLeg): number =>
  legBlockMinutes(leg) + 90;

export const formatBlockDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, "0")}m`;
};

export const reservationPilots = (
  reservation: Reservation,
): ReservationPilot[] => {
  if (reservation.pilots) return reservation.pilots;
  const allLegIds = reservation.legs.map((l) => l.id);
  return reservation.crewAccountIds.map((accountId, index) => ({
    accountId,
    position: index === 0 ? "PIC" : "SIC",
    legIds: allLegIds,
  }));
};

export const reservationPassengers = (
  reservation: Reservation,
): ReservationPassenger[] => {
  if (reservation.reservedPassengers) return reservation.reservedPassengers;
  if (!reservation.customerId) return [];
  return [
    {
      customerId: reservation.customerId,
      legIds: reservation.legs.map((l) => l.id),
    },
  ];
};

export const passengerCountForLeg = (
  reservation: Reservation,
  legId: string,
): number =>
  reservationPassengers(reservation).filter((p) => p.legIds.includes(legId))
    .length;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatQuoteAmount = (amount: number): string => usd.format(amount);

const NOW_REF = new Date("2026-05-14T12:00:00Z");

export interface PilotLegConflict {
  legId: string;
  legIndex: number;
  message: string;
}

export const pilotConflicts = (
  account: Account,
  position: "PIC" | "SIC",
  reservation: Reservation,
  pilot: ReservationPilot,
): PilotLegConflict[] => {
  const aircraft = reservationAircraft(reservation);
  if (!aircraft) return [];
  const conflicts: PilotLegConflict[] = [];
  pilot.legIds.forEach((legId) => {
    const legIndex = reservation.legs.findIndex((l) => l.id === legId);
    if (legIndex === -1) return;
    const leg = reservation.legs[legIndex];
    const reg = legRegulation(leg);
    const hasPositionQual = account.qualifications.some(
      (q) =>
        q.aircraftModel === aircraft.model &&
        q.positions.includes(position) &&
        q.expirationDate > NOW_REF,
    );
    const hasRegQual = account.qualifications.some(
      (q) =>
        q.aircraftModel === aircraft.model &&
        q.regulations.includes(reg) &&
        q.expirationDate > NOW_REF,
    );
    if (!hasPositionQual) {
      conflicts.push({
        legId,
        legIndex,
        message: `not qualified as ${position} for ${aircraft.model}`,
      });
    }
    if (!hasRegQual) {
      conflicts.push({
        legId,
        legIndex,
        message: `not qualified as ${reg} for ${aircraft.model}`,
      });
    }
  });
  return conflicts;
};

const dayFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  day: "numeric",
  month: "short",
});
const dayTimeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: false,
});

export const formatLegDayLabel = (date: Date): string => dayFmt.format(date);

export const formatLegHourLabel = (date: Date): string =>
  dayTimeFmt.format(date);

const yyyymmddFmt = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const formatLegItineraryDate = (date: Date): string =>
  yyyymmddFmt.format(date).replace(/-/g, "");
