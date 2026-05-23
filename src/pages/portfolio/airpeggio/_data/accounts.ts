import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

faker.seed(909);

export type AccountStatus = "Activated" | "Pending" | "Deactivated";
export type AccountGender = "M" | "F" | "X";
export type AccountRole = "scheduler" | "pilot";

export interface SchedulerPermissions {
  admin: boolean;
  inbox: { read: boolean; write: boolean; delete: boolean };
  inboxFilters: { read: boolean; write: boolean; delete: boolean };
  customers: { read: boolean; write: boolean; delete: boolean };
  accounts: { read: boolean; write: boolean; delete: boolean };
  pilotTraining: { read: boolean; write: boolean; delete: boolean };
  pilotCurrency: { read: boolean; write: boolean; delete: boolean };
  schedule: { read: boolean; write: boolean; delete: boolean };
  aircraft: { read: boolean; write: boolean; delete: boolean };
  aircraftMaintenance: { read: boolean; write: boolean; delete: boolean };
  squawks: { read: boolean; write: boolean };
  pricingProfiles: { read: boolean; write: boolean; delete: boolean };
  reservations: {
    read: boolean;
    write: boolean;
    release: boolean;
    delete: boolean;
  };
  crewAssignments: { read: boolean; write: boolean; delete: boolean };
  passengerAssignments: { read: boolean; write: boolean; delete: boolean };
  flightLogs: { read: boolean; write: boolean; review: boolean };
  dutyLogs: {
    read: boolean;
    write: boolean;
    delete: boolean;
    review: boolean;
  };
  quotes: { read: boolean; write: boolean };
  hangars: { read: boolean; write: boolean; delete: boolean };
  managementRequests: { read: boolean; write: boolean; delete: boolean };
  tags: { read: boolean; write: boolean; delete: boolean };
  organizationSettings: { read: boolean; write: boolean };
  billing: { read: boolean; write: boolean };
  integrations: { read: boolean; write: boolean; delete: boolean };
  aiAssistant: { read: boolean; write: boolean };
}

export interface PilotPermissions {
  admin: boolean;
  dutyLogs: { read: boolean; write: boolean; delete: boolean };
  trip: { create: boolean };
  flightLogs: { read: boolean; write: boolean };
  qualifications: { read: boolean; write: boolean };
  schedule: { read: boolean };
  aircraftView: { read: boolean };
  vorChecks: { read: boolean; write: boolean };
  squawks: { read: boolean; write: boolean };
  currency: { read: boolean };
}

export interface Qualification {
  id: string;
  aircraftModel: string;
  positions: Array<"PIC" | "SIC">;
  regulations: Array<"135" | "91" | "121">;
  expirationDate: Date;
}

export interface TrainingRequirement {
  id: string;
  name: string;
  intervalMonths: number;
  marginMonths?: number;
  regulation: "135" | "91" | "121";
  positions: Array<"PIC" | "SIC">;
}

export interface TrainingCompletion {
  kind: "training";
  id: string;
  requirementId: string;
  accomplishedAt: Date;
  note?: string;
}

export interface TrainingOverride {
  kind: "override";
  id: string;
  requirementId: string;
  until: Date;
  note: string;
}

export type TrainingRecord = TrainingCompletion | TrainingOverride;

export interface Account {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  status: AccountStatus;
  birthDate?: Date;
  gender?: AccountGender;
  weight?: number;
  roles: AccountRole[];
  lastActive?: Date;
  tags: string[];
  schedulerPermissions: SchedulerPermissions;
  pilotPermissions: PilotPermissions;
  qualifications: Qualification[];
  trainings: TrainingRecord[];
}

const allTrueScheduler = (): SchedulerPermissions => ({
  admin: true,
  inbox: { read: true, write: true, delete: true },
  inboxFilters: { read: true, write: true, delete: true },
  customers: { read: true, write: true, delete: true },
  accounts: { read: true, write: true, delete: true },
  pilotTraining: { read: true, write: true, delete: true },
  pilotCurrency: { read: true, write: true, delete: true },
  schedule: { read: true, write: true, delete: true },
  aircraft: { read: true, write: true, delete: true },
  aircraftMaintenance: { read: true, write: true, delete: true },
  squawks: { read: true, write: true },
  pricingProfiles: { read: true, write: true, delete: true },
  reservations: { read: true, write: true, release: true, delete: true },
  crewAssignments: { read: true, write: true, delete: true },
  passengerAssignments: { read: true, write: true, delete: true },
  flightLogs: { read: true, write: true, review: true },
  dutyLogs: { read: true, write: true, delete: true, review: true },
  quotes: { read: true, write: true },
  hangars: { read: true, write: true, delete: true },
  managementRequests: { read: true, write: true, delete: true },
  tags: { read: true, write: true, delete: true },
  organizationSettings: { read: true, write: true },
  billing: { read: true, write: true },
  integrations: { read: true, write: true, delete: true },
  aiAssistant: { read: true, write: true },
});

const allTruePilot = (): PilotPermissions => ({
  admin: true,
  dutyLogs: { read: true, write: true, delete: true },
  trip: { create: true },
  flightLogs: { read: true, write: true },
  qualifications: { read: true, write: true },
  schedule: { read: true },
  aircraftView: { read: true },
  vorChecks: { read: true, write: true },
  squawks: { read: true, write: true },
  currency: { read: true },
});

const NOW = new Date("2026-05-14T12:00:00Z");

const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60_000);

const yearsFromNow = (n: number) =>
  new Date(NOW.getTime() + n * 365.25 * 24 * 60 * 60_000);

const REQ_293_A1_48: TrainingRequirement = {
  id: nanoid(),
  name: "135.293 (a) (1) & (4-8)",
  intervalMonths: 12,
  marginMonths: 1,
  regulation: "135",
  positions: ["PIC", "SIC"],
};
const REQ_293_A23: TrainingRequirement = {
  id: nanoid(),
  name: "135.293 (a) (2-3)",
  intervalMonths: 12,
  marginMonths: 1,
  regulation: "135",
  positions: ["PIC", "SIC"],
};
const REQ_293_B: TrainingRequirement = {
  id: nanoid(),
  name: "135.293 (b)",
  intervalMonths: 12,
  marginMonths: 1,
  regulation: "135",
  positions: ["PIC", "SIC"],
};
const REQ_297: TrainingRequirement = {
  id: nanoid(),
  name: "135.297",
  intervalMonths: 6,
  marginMonths: 1,
  regulation: "135",
  positions: ["PIC"],
};
const REQ_299: TrainingRequirement = {
  id: nanoid(),
  name: "135.299",
  intervalMonths: 12,
  marginMonths: 1,
  regulation: "135",
  positions: ["PIC"],
};
const REQ_331_EMERGENCY: TrainingRequirement = {
  id: nanoid(),
  name: "135.331 Emergency",
  intervalMonths: 12,
  regulation: "135",
  positions: ["PIC", "SIC"],
};
const REQ_1ST_CLASS_MEDICAL: TrainingRequirement = {
  id: nanoid(),
  name: "1st Class Medical",
  intervalMonths: 12,
  regulation: "135",
  positions: ["PIC"],
};

export const TRAINING_REQUIREMENTS: TrainingRequirement[] = [
  REQ_293_A1_48,
  REQ_293_A23,
  REQ_293_B,
  REQ_297,
  REQ_299,
  REQ_331_EMERGENCY,
  REQ_1ST_CLASS_MEDICAL,
];

export const getTrainingRequirement = (
  id: string,
): TrainingRequirement | undefined =>
  TRAINING_REQUIREMENTS.find((r) => r.id === id);

/** The date this record is "anchored" to for sorting/display. Completions use
 *  the accomplished date; overrides use the date they're valid until. */
export const recordEffectiveDate = (record: TrainingRecord): Date =>
  record.kind === "override" ? record.until : record.accomplishedAt;

/** Expiration date for a training record. Overrides expire on their `until`
 *  date; completions expire at the end of the month `intervalMonths` after
 *  they were accomplished — matching how Part 135 currency windows work. */
export const trainingExpiresAt = (
  record: TrainingRecord,
  requirement: TrainingRequirement,
): Date => {
  if (record.kind === "override") return record.until;
  const d = record.accomplishedAt;
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + requirement.intervalMonths + 1;
  return new Date(Date.UTC(year, month, 0));
};

export type TrainingStatus =
  | "current"
  | "due-soon"
  | "expired"
  | "overridden";

export const trainingStatus = (
  record: TrainingRecord | undefined,
  requirement: TrainingRequirement,
  now: Date,
): TrainingStatus => {
  if (!record) return "expired";
  const expires = trainingExpiresAt(record, requirement);
  const msInDay = 24 * 60 * 60_000;
  const daysOut = (expires.getTime() - now.getTime()) / msInDay;
  if (daysOut < 0) return "expired";
  if (record.kind === "override") return "overridden";
  if (daysOut <= 30) return "due-soon";
  return "current";
};

export const formatTrainingRequiredFor = (
  requirement: TrainingRequirement,
): string => {
  const part = `Part 1${requirement.regulation === "135" ? "35" : requirement.regulation === "91" ? "1" : "21"}`;
  const cadence = requirement.marginMonths
    ? `every **${requirement.intervalMonths} months** (± ${requirement.marginMonths} month)`
    : `every **${requirement.intervalMonths} months**`;
  const role = requirement.positions
    .map((p) => `**${p}**`)
    .join(" or ");
  return `Required ${cadence} for anyone flying **${part}** flights as ${role}`;
};

interface AccountSeed {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status?: AccountStatus;
  gender?: AccountGender;
  birthDate?: Date;
  weight?: number;
  roles: AccountRole[];
  lastActive?: Date;
  tags?: string[];
  qualifications?: Qualification[];
  trainings?: TrainingRecord[];
}

const training = (
  requirementId: string,
  accomplishedAt: Date,
  note?: string,
): TrainingCompletion => ({
  kind: "training",
  id: nanoid(),
  requirementId,
  accomplishedAt,
  note,
});

const override = (
  requirementId: string,
  until: Date,
  note: string,
): TrainingOverride => ({
  kind: "override",
  id: nanoid(),
  requirementId,
  until,
  note,
});

const d = (iso: string) => new Date(`${iso}T00:00:00Z`);

// Names are generated from faker (seeded above for determinism) so this demo
// doesn't ship anyone's real coworkers. Variable names like `a1`, `a3` just
// preserve seed ordering — they map to specific roles below.
interface Identity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const makeIdentity = (sex: "male" | "female"): Identity => {
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  return {
    id: nanoid(),
    firstName,
    lastName,
    email: faker.internet
      .email({ firstName, lastName, provider: "demo-aero.example" })
      .toLowerCase(),
  };
};

const a1 = makeIdentity("male"); // pilot, current across the board
const a2 = makeIdentity("female"); // scheduler only
const a3 = makeIdentity("male"); // pilot, currently logged in
const a4 = makeIdentity("female"); // scheduler only
const a5 = makeIdentity("male"); // pilot
const a6 = makeIdentity("male"); // pilot, mostly expired
const a7 = makeIdentity("male"); // pilot

export const CURRENT_USER_ID = a3.id;

const a1Trainings: TrainingRecord[] = TRAINING_REQUIREMENTS.map((req, i) =>
  training(
    req.id,
    d("2026-01-23"),
    i === 0 ? "Completed at SimCom DFW." : undefined,
  ),
);

const a3Trainings: TrainingRecord[] = [
  training(REQ_293_A1_48.id, d("2025-07-12")),
  training(REQ_293_A23.id, d("2025-04-05")),
  training(REQ_293_B.id, d("2025-06-01")),
  override(
    REQ_297.id,
    d("2026-12-31"),
    "Approved by chief pilot pending next sim slot.",
  ),
  training(REQ_331_EMERGENCY.id, d("2025-05-20")),
  training(REQ_1ST_CLASS_MEDICAL.id, d("2026-03-01")),
];

const a5Trainings: TrainingRecord[] = [
  training(REQ_293_A1_48.id, d("2026-03-15")),
  training(REQ_293_A23.id, d("2026-04-08")),
  override(
    REQ_293_B.id,
    d("2026-06-30"),
    "PIC duties suspended during left-seat upgrade.",
  ),
  training(REQ_297.id, d("2026-02-20")),
  training(REQ_299.id, d("2026-03-10")),
  training(REQ_331_EMERGENCY.id, d("2026-04-02")),
  training(REQ_1ST_CLASS_MEDICAL.id, d("2026-04-22")),
];

const a6Trainings: TrainingRecord[] = [
  training(REQ_293_A1_48.id, d("2024-06-06")),
  training(REQ_293_A23.id, d("2024-09-01")),
  training(REQ_297.id, d("2025-10-05")),
  training(REQ_1ST_CLASS_MEDICAL.id, d("2025-04-30")),
];

const a7Trainings: TrainingRecord[] = [
  training(REQ_293_A1_48.id, d("2025-05-20")),
  training(REQ_293_A23.id, d("2025-06-01")),
  training(REQ_293_B.id, d("2025-05-08")),
  training(REQ_297.id, d("2026-02-01")),
  training(REQ_299.id, d("2025-07-01")),
  training(REQ_331_EMERGENCY.id, d("2025-12-15")),
  override(
    REQ_1ST_CLASS_MEDICAL.id,
    d("2026-08-31"),
    "Waived pending FAA medical review.",
  ),
];

const SEEDS: AccountSeed[] = [
  {
    ...a1,
    status: "Activated",
    gender: "M",
    birthDate: new Date("1988-06-25T00:00:00Z"),
    roles: ["scheduler", "pilot"],
    lastActive: daysAgo(9),
    tags: ["Dallas"],
    trainings: a1Trainings,
    qualifications: [
      {
        id: nanoid(),
        aircraftModel: "Cessna Citation CJ4",
        positions: ["PIC", "SIC"],
        regulations: ["135", "91"],
        expirationDate: new Date("2027-01-24T00:00:00Z"),
      },
      {
        id: nanoid(),
        aircraftModel: "Cessna Citation CJ3",
        positions: ["PIC", "SIC"],
        regulations: ["135", "91"],
        expirationDate: new Date("2028-01-31T00:00:00Z"),
      },
    ],
  },
  {
    ...a2,
    status: "Activated",
    gender: "F",
    roles: ["scheduler"],
  },
  {
    ...a3,
    status: "Activated",
    gender: "M",
    roles: ["scheduler", "pilot"],
    lastActive: daysAgo(8),
    trainings: a3Trainings,
    qualifications: [
      {
        id: nanoid(),
        aircraftModel: "Cessna Citation CJ4",
        positions: ["PIC", "SIC"],
        regulations: ["135", "91"],
        expirationDate: yearsFromNow(2),
      },
    ],
  },
  {
    ...a4,
    status: "Activated",
    gender: "F",
    roles: ["scheduler"],
    lastActive: daysAgo(10),
  },
  {
    ...a5,
    status: "Activated",
    gender: "M",
    roles: ["scheduler", "pilot"],
    lastActive: daysAgo(6),
    trainings: a5Trainings,
    qualifications: [
      {
        id: nanoid(),
        aircraftModel: "Cessna Citation CJ3",
        positions: ["SIC"],
        regulations: ["135"],
        expirationDate: yearsFromNow(1),
      },
    ],
  },
  {
    ...a6,
    status: "Activated",
    gender: "M",
    roles: ["scheduler", "pilot"],
    trainings: a6Trainings,
    qualifications: [
      {
        id: nanoid(),
        aircraftModel: "Learjet 45",
        positions: ["PIC", "SIC"],
        regulations: ["135", "91"],
        expirationDate: yearsFromNow(3),
      },
    ],
  },
  {
    ...a7,
    status: "Activated",
    gender: "M",
    roles: ["scheduler", "pilot"],
    lastActive: daysAgo(10),
    trainings: a7Trainings,
    qualifications: [
      {
        id: nanoid(),
        aircraftModel: "Cessna Citation CJ4",
        positions: ["PIC"],
        regulations: ["135"],
        expirationDate: yearsFromNow(2),
      },
    ],
  },
];

const seedToAccount = (seed: AccountSeed): Account => ({
  id: seed.id,
  firstName: seed.firstName,
  lastName: seed.lastName,
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  email: seed.email,
  phone: undefined,
  status: seed.status ?? "Activated",
  birthDate: seed.birthDate,
  gender: seed.gender,
  weight: seed.weight,
  roles: seed.roles,
  lastActive: seed.lastActive,
  tags: seed.tags ?? [],
  schedulerPermissions: allTrueScheduler(),
  pilotPermissions: allTruePilot(),
  qualifications: seed.qualifications ?? [],
  trainings: seed.trainings ?? [],
});

export const ACCOUNTS: Account[] = SEEDS.map(seedToAccount);

export const getAccount = (id: string): Account | undefined =>
  ACCOUNTS.find((a) => a.id === id);

export const getCurrentUser = (): Account => {
  const user = getAccount(CURRENT_USER_ID);
  if (!user) throw new Error(`Current user ${CURRENT_USER_ID} not found`);
  return user;
};

export const accountFullName = (account: Account): string =>
  `${account.firstName} ${account.lastName}`;

export const ACCOUNT_TAG_OPTIONS = [
  "Dallas",
  "Houston",
  "Austin",
  "Part 91",
  "Part 135",
  "Owner",
];

export const SALESPEOPLE: Account[] = ACCOUNTS.filter((a) => a.roles.includes("scheduler"));
export const PILOTS: Account[] = ACCOUNTS.filter((a) =>
  a.roles.includes('pilot'),
);

export const accessLabel = (roles: AccountRole[]): string => {
  if (roles.length === 0) return "";
  return roles
    .map((r) => (r === "scheduler" ? "Scheduler" : "Pilot"))
    .join(", ");
};
