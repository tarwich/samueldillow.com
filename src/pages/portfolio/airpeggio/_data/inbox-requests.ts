import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { AIRPORTS } from "./airports";
import { CUSTOMERS } from "./customers";

faker.seed(404);

export type InboxRequestStatus =
  | "qualified"
  | "unqualified"
  | "manual"
  | "quoted";

export interface InboxRequestLeg {
  origin: string;
  destination: string;
  departure: Date;
  passengers: number;
}

export interface InboxRequest {
  id: string;
  customerId: string;
  receivedAt: Date;
  status: InboxRequestStatus;
  legs: InboxRequestLeg[];
}

const NOW = new Date("2026-04-28T22:00:00Z");

function pickDifferent(from: string): string {
  let to = from;
  while (to === from) {
    to = faker.helpers.arrayElement(AIRPORTS).icao;
  }
  return to;
}

function makeLegs(): InboxRequestLeg[] {
  const count = faker.helpers.weightedArrayElement([
    { value: 1, weight: 3 },
    { value: 2, weight: 5 },
    { value: 3, weight: 1 },
  ]);
  const legs: InboxRequestLeg[] = [];
  let prev: string | null = null;
  let cursor = faker.date.between({
    from: "2026-05-01T00:00:00Z",
    to: "2026-07-15T00:00:00Z",
  });
  for (let i = 0; i < count; i++) {
    const origin = prev ?? faker.helpers.arrayElement(AIRPORTS).icao;
    const destination = pickDifferent(origin);
    legs.push({
      origin,
      destination,
      departure: new Date(cursor),
      passengers: faker.number.int({ min: 1, max: 12 }),
    });
    prev = destination;
    cursor = new Date(cursor.getTime() + faker.number.int({ min: 1, max: 4 }) * 24 * 60 * 60_000);
  }
  return legs;
}

export const INBOX_REQUESTS: InboxRequest[] = Array.from({ length: 24 }, (_, i) => ({
  id: nanoid(),
  customerId: faker.helpers.arrayElement(CUSTOMERS).id,
  receivedAt: new Date(
    NOW.getTime() - i * faker.number.int({ min: 5, max: 90 }) * 60_000,
  ),
  status: faker.helpers.weightedArrayElement<InboxRequestStatus>([
    { value: "qualified", weight: 5 },
    { value: "quoted", weight: 3 },
    { value: "manual", weight: 2 },
    { value: "unqualified", weight: 1 },
  ]),
  legs: makeLegs(),
}));

export const getInboxRequest = (id: string): InboxRequest | undefined =>
  INBOX_REQUESTS.find((r) => r.id === id);
