import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import {
  ACCOUNTS,
  getAccount,
  PILOTS,
  SALESPEOPLE,
  type Account,
} from './accounts';
import { AIRCRAFT, type Aircraft } from './aircraft';
import { AIRPORTS, getAirport } from './airports';
import { CUSTOMERS, type Customer } from './customers';
import { COMPANIES, type Company } from './companies';

faker.seed(707);

export type ReservationLifecycle =
  | 'planned'
  | 'scheduled'
  | 'flown'
  | 'cancelled';
export type ReservationApproval = 'pending' | 'quoted' | 'approved';
export type ReservationActivity =
  | 'Charter Flight'
  | 'Aircraft Owner Flight'
  | 'Training Flight'
  | 'Leaseback/Rental Flight'
  | 'Maintenance Reservation';
export type Regulation = '135' | '91' | '121';

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
  position: 'PIC' | 'SIC';
  legIds: string[];
}

export interface ReservationPassenger {
  customerId: string;
  legIds: string[];
}

export interface ReservationQuote {
  number: number;
  amount: number;
  status: 'paid' | 'unpaid';
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
  salesperson: Account | null;
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

const NOW_REF = new Date('2026-05-14T12:00:00Z');

export interface ReservationTagStyle {
  background: string;
  color: string;
}

export const RESERVATION_TAG_STYLES: Record<string, ReservationTagStyle> = {
  Organ: { background: '#0b0b0d', color: '#ffffff' },
  Executive: { background: '#3f8a96', color: '#ffffff' },
  Broker: { background: '#c7d533', color: '#1a1a1a' },
  VIP: { background: '#510c62', color: '#ffffff' },
  Owner: { background: '#d4a017', color: '#1a1a1a' },
  Repeat: { background: '#d9dde9', color: '#1a1a1a' },
};

const TAG_NAMES = Object.keys(RESERVATION_TAG_STYLES);

export const reservationTagStyle = (name: string): ReservationTagStyle =>
  RESERVATION_TAG_STYLES[name] ?? { background: '#d9dde9', color: '#1a1a1a' };

const AIRPORT_CODES = AIRPORTS.map((a) => a.icao);

const COMPANIES_WITH_CUSTOMERS = COMPANIES.filter((co) =>
  CUSTOMERS.some((cu) => cu.companyId === co.id),
);

const pickAirport = (exclude?: string): string => {
  let next = exclude;
  while (!next || next === exclude) {
    next = faker.helpers.arrayElement(AIRPORT_CODES);
  }
  return next;
};

const pickCompany = (): Company =>
  faker.helpers.arrayElement(COMPANIES_WITH_CUSTOMERS);

const pickCustomerFor = (companyId: string): Customer =>
  faker.helpers.arrayElement(
    CUSTOMERS.filter((c) => c.companyId === companyId),
  );

const REGULATION_BY_ACTIVITY: Record<ReservationActivity, Regulation> = {
  'Charter Flight': '135',
  'Aircraft Owner Flight': '91',
  'Training Flight': '91',
  'Leaseback/Rental Flight': '91',
  'Maintenance Reservation': '91',
};

interface LegRecipe {
  start: Date;
  legCount: number;
  paxCap: number;
  regulation: Regulation;
}

const generateLegs = ({
  start,
  legCount,
  paxCap,
  regulation,
}: LegRecipe): ReservationLeg[] => {
  const legs: ReservationLeg[] = [];
  let prev: string | undefined;
  let cursor = new Date(start);
  for (let i = 0; i < legCount; i++) {
    const origin = prev ?? pickAirport();
    const destination = pickAirport(origin);
    const block = faker.number.int({ min: 60, max: 240 });
    const departure = new Date(cursor);
    const leg: ReservationLeg = {
      id: nanoid(),
      origin,
      destination,
      departure,
      passengers: faker.number.int({ min: 0, max: Math.max(1, paxCap) }),
    };
    if (faker.number.float() < 0.6) leg.blockMinutes = block;
    if (faker.number.float() < 0.5) leg.regulation = regulation;
    if (faker.number.float() < 0.4) {
      leg.flightNumber = faker.number.int({ min: 1000, max: 9999 });
    }
    legs.push(leg);
    prev = destination;
    cursor = new Date(
      departure.getTime() +
        (block + faker.number.int({ min: 60, max: 600 })) * 60_000,
    );
  }
  return legs;
};

const generateRecurringLegs = (
  start: Date,
  months: number,
  origin: string,
  destination: string,
): ReservationLeg[] => {
  const legs: ReservationLeg[] = [];
  for (let i = 0; i < months; i++) {
    const outDate = new Date(start);
    outDate.setUTCMonth(outDate.getUTCMonth() + i);
    const backDate = new Date(outDate);
    backDate.setUTCDate(backDate.getUTCDate() + 1);
    legs.push({
      id: nanoid(),
      origin,
      destination,
      departure: outDate,
      passengers: faker.number.int({ min: 1, max: 6 }),
    });
    legs.push({
      id: nanoid(),
      origin: destination,
      destination: origin,
      departure: backDate,
      passengers: faker.number.int({ min: 1, max: 6 }),
    });
  }
  return legs;
};

const pickCrew = (aircraft: Aircraft): Account[] => {
  const needsCopilot =
    aircraft.engineCount > 1 ||
    faker.helpers.weightedArrayElement([
      { value: true, weight: 1 },
      { value: false, weight: 3 },
    ]);
  return faker.helpers.arrayElements(PILOTS, needsCopilot ? 2 : 1);
};

const tagPool = (): string[] => {
  if (faker.number.float() >= 0.3) return [];
  const first = faker.helpers.arrayElement(TAG_NAMES);
  if (faker.number.float() < 0.2) {
    const second = faker.helpers.arrayElement(
      TAG_NAMES.filter((t) => t !== first),
    );
    return [first, second];
  }
  return [first];
};

const flightLogFor = (
  leg: ReservationLeg,
  aircraft: Aircraft,
): ReservationFlightLog => {
  const block = leg.blockMinutes ?? hashedDefaultBlock(leg);
  const totalHours = +(block / 60).toFixed(1);
  const fuelOut = faker.number.int({ min: 1800, max: 3200 });
  const fuelBurn = Math.round(totalHours * 95);
  const fuelIn = Math.max(0, fuelOut - fuelBurn);
  const fuelAdd =
    faker.number.float() < 0.3 ? faker.number.int({ min: 200, max: 900 }) : 0;
  return {
    legId: leg.id,
    hobbsOut: aircraft.airframeHours ? Number(aircraft.airframeHours) || 0 : 0,
    hobbsIn:
      (aircraft.airframeHours ? Number(aircraft.airframeHours) || 0 : 0) +
      totalHours,
    totalHours,
    fuelAdd,
    fuelOut,
    fuelIn,
    fuelBurn,
    pax: leg.passengers,
  };
};

interface LifecyclePlan {
  lifecycle: ReservationLifecycle;
  dayOffset: number;
  approval?: ReservationApproval;
}

const LIFECYCLE_PLAN: LifecyclePlan[] = [
  ...Array.from({ length: 5 }, (_, i) => ({
    lifecycle: 'flown' as const,
    dayOffset: -(7 + i * 14),
  })),
  ...Array.from({ length: 2 }, () => ({
    lifecycle: 'cancelled' as const,
    dayOffset: faker.number.int({ min: -40, max: 20 }),
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    lifecycle: 'scheduled' as const,
    dayOffset: 2 + i * 6,
    approval: faker.helpers.arrayElement<ReservationApproval>([
      'quoted',
      'approved',
    ]),
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    lifecycle: 'planned' as const,
    dayOffset: 30 + i * 12,
    approval: faker.helpers.maybe(() => 'pending' as ReservationApproval, {
      probability: 0.5,
    }),
  })),
];

const ACTIVITY_WEIGHTS = [
  { value: 'Charter Flight' as ReservationActivity, weight: 12 },
  { value: 'Aircraft Owner Flight' as ReservationActivity, weight: 3 },
  { value: 'Training Flight' as ReservationActivity, weight: 2 },
  { value: 'Leaseback/Rental Flight' as ReservationActivity, weight: 1 },
  { value: 'Maintenance Reservation' as ReservationActivity, weight: 1 },
];

const buildReservation = (
  tripNumber: number,
  quoteSequence: number,
  plan: LifecyclePlan,
): Reservation => {
  const aircraft = faker.helpers.arrayElement(AIRCRAFT);
  const activity = faker.helpers.weightedArrayElement(ACTIVITY_WEIGHTS);
  const isCharter = activity === 'Charter Flight';
  const regulation = REGULATION_BY_ACTIVITY[activity];
  const crew = pickCrew(aircraft);
  const salesperson = faker.helpers.maybe(
    () => faker.helpers.arrayElement(SALESPEOPLE),
    { probability: isCharter ? 0.85 : 0.4 },
  );
  const company = isCharter ? pickCompany() : undefined;
  const customer = company ? pickCustomerFor(company.id) : undefined;

  const start = new Date(NOW_REF);
  start.setUTCDate(start.getUTCDate() + plan.dayOffset);
  start.setUTCHours(
    faker.number.int({ min: 12, max: 23 }),
    faker.helpers.arrayElement([0, 15, 30, 45]),
    0,
    0,
  );

  const isRecurring =
    isCharter && plan.lifecycle === 'scheduled' && faker.number.float() < 0.15;
  let legs: ReservationLeg[];
  if (isRecurring) {
    const origin = pickAirport();
    const destination = pickAirport(origin);
    legs = generateRecurringLegs(start, 7, origin, destination);
  } else {
    legs = generateLegs({
      start,
      legCount: faker.number.int({ min: 1, max: 3 }),
      paxCap: aircraft.paxCapacity,
      regulation,
    });
  }

  const wantsExplicitPilots = crew.length === 2 && faker.number.float() < 0.6;
  const pilots: ReservationPilot[] | undefined = wantsExplicitPilots
    ? crew.map((c, i) => ({
        accountId: c.id,
        position: i === 0 ? 'PIC' : 'SIC',
        legIds: legs.map((l) => l.id),
      }))
    : undefined;

  const wantsExtraPassenger =
    isCharter && customer && faker.number.float() < 0.4;
  const reservedPassengers: ReservationPassenger[] | undefined =
    wantsExtraPassenger && customer
      ? [
          { customerId: customer.id, legIds: legs.map((l) => l.id) },
          ...faker.helpers
            .arrayElements(
              CUSTOMERS.filter((c) => c.id !== customer.id),
              faker.number.int({ min: 1, max: 2 }),
            )
            .map((c) => ({
              customerId: c.id,
              legIds: legs.map((l) => l.id),
            })),
        ]
      : undefined;

  const showQuote =
    isCharter &&
    (plan.lifecycle === 'flown' ||
      plan.lifecycle === 'scheduled' ||
      (plan.lifecycle === 'cancelled' && faker.number.float() < 0.5));
  const quote: ReservationQuote | undefined = showQuote
    ? {
        number: quoteSequence,
        amount: faker.number.int({ min: 60, max: 360 }) * 100 * legs.length,
        status:
          plan.lifecycle === 'flown' && faker.number.float() < 0.7
            ? 'paid'
            : 'unpaid',
      }
    : undefined;

  const flightLogs: ReservationFlightLog[] | undefined =
    plan.lifecycle === 'flown'
      ? legs.map((leg) => flightLogFor(leg, aircraft))
      : undefined;

  const orderNumber =
    plan.lifecycle !== 'planned' && faker.number.float() < 0.4
      ? `ORD-${faker.number.int({ min: 10_000, max: 99_999 })}`
      : undefined;

  return {
    id: nanoid(),
    tripNumber,
    orderNumber,
    aircraftId: aircraft.id,
    companyId: company?.id,
    customerId: customer?.id,
    salespersonId: salesperson?.id,
    get salesperson() {
      return (this.salespersonId && getAccount(this.salespersonId)) || null;
    },
    crewAccountIds: crew.map((c) => c.id),
    assignedAccountId:
      salesperson?.id ?? faker.helpers.arrayElement(SALESPEOPLE).id,
    activity,
    lifecycle: plan.lifecycle,
    approval: plan.approval,
    legs,
    tags: tagPool(),
    autoCalculate: true,
    pilots,
    reservedPassengers,
    quote,
    flightLogs,
  };
};

const STARTING_TRIP_NUMBER = 152;

const generateReservations = (): Reservation[] => {
  const out: Reservation[] = [];
  let trip = STARTING_TRIP_NUMBER;
  let quoteSeq = 80;
  for (const plan of LIFECYCLE_PLAN) {
    out.push(buildReservation(trip--, quoteSeq++, plan));
  }
  return out;
};

export const RESERVATIONS: Reservation[] = generateReservations().sort(
  (a, b) => b.tripNumber - a.tripNumber,
);

export const getReservation = (id: string): Reservation | undefined =>
  RESERVATIONS.find((r) => r.id === id);

const initialsFor = (account: Account): string =>
  (account.firstName[0] + account.lastName[0]).toUpperCase();

export const reservationInitials = initialsFor;

const monthFmt = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: '2-digit',
});
const timeFmt = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

export const formatLegDate = (date: Date): string => monthFmt.format(date);

export const formatLegTime = (date: Date): string => timeFmt.format(date);

export const formatLegTimezone = (icao: string): string =>
  getAirport(icao)?.timezone ?? 'CDT';

export const reservationCrewLabel = (reservation: Reservation): string[] =>
  reservation.crewAccountIds
    .map((id) => ACCOUNTS.find((a) => a.id === id))
    .filter((a): a is Account => !!a)
    .map(initialsFor);

export const reservationAssignedLabel = (reservation: Reservation): string => {
  const account = ACCOUNTS.find((a) => a.id === reservation.assignedAccountId);
  return account ? initialsFor(account) : '-';
};

export const reservationAircraft = (
  reservation: Reservation,
): Aircraft | undefined =>
  AIRCRAFT.find((a) => a.id === reservation.aircraftId);

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
function hashedDefaultBlock(leg: ReservationLeg): number {
  let h = 0;
  for (let i = 0; i < leg.id.length; i++) {
    h = (h * 31 + leg.id.charCodeAt(i)) >>> 0;
  }
  return 60 + (h % 180);
}

export const legBlockMinutes = (leg: ReservationLeg): number =>
  leg.blockMinutes ?? hashedDefaultBlock(leg);

export const legRegulation = (leg: ReservationLeg): Regulation =>
  leg.regulation ?? '135';

export const legArrival = (leg: ReservationLeg): Date =>
  new Date(leg.departure.getTime() + legBlockMinutes(leg) * 60_000);

// Duty time is block + 1h30m of pre/post-flight overhead — matches the
// 1h42m→3h12m and 2h29m→3h59m relationship shown in the screenshots.
export const legDutyMinutes = (leg: ReservationLeg): number =>
  legBlockMinutes(leg) + 90;

export const formatBlockDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, '0')}m`;
};

export const reservationPilots = (
  reservation: Reservation,
): ReservationPilot[] => {
  if (reservation.pilots) return reservation.pilots;
  const allLegIds = reservation.legs.map((l) => l.id);
  return reservation.crewAccountIds.map((accountId, index) => ({
    accountId,
    position: index === 0 ? 'PIC' : 'SIC',
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

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatQuoteAmount = (amount: number): string => usd.format(amount);

export interface PilotLegConflict {
  legId: string;
  legIndex: number;
  message: string;
}

export const pilotConflicts = (
  account: Account,
  position: 'PIC' | 'SIC',
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

const dayFmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});
const dayTimeFmt = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
});

export const formatLegDayLabel = (date: Date): string => dayFmt.format(date);

export const formatLegHourLabel = (date: Date): string =>
  dayTimeFmt.format(date);

const yyyymmddFmt = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const formatLegItineraryDate = (date: Date): string =>
  yyyymmddFmt.format(date).replace(/-/g, '');
