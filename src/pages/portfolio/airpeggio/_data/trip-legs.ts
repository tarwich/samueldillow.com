import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { AIRPORTS } from "./airports";
import { BOOKINGS } from "./bookings";
import { getAircraft } from "./aircraft";

faker.seed(606);

export interface TripLeg {
  id: string;
  bookingId: string;
  sequence: number;
  origin: string;
  destination: string;
  departure: Date;
  arrival: Date;
  passengers: number;
}

function pickDifferent(from: string): string {
  let to = from;
  while (to === from) {
    to = faker.helpers.arrayElement(AIRPORTS).icao;
  }
  return to;
}

function generateLegs(bookingId: string, paxCap: number): TripLeg[] {
  const count = faker.number.int({ min: 1, max: 4 });
  const legs: TripLeg[] = [];
  let prev: string | null = null;
  let cursor = faker.date.between({
    from: "2026-05-15T00:00:00Z",
    to: "2026-09-01T00:00:00Z",
  });
  for (let i = 0; i < count; i++) {
    const origin = prev ?? faker.helpers.arrayElement(AIRPORTS).icao;
    const destination = pickDifferent(origin);
    const blockMinutes = faker.number.int({ min: 45, max: 240 });
    const departure = new Date(cursor);
    const arrival = new Date(departure.getTime() + blockMinutes * 60_000);
    legs.push({
      id: nanoid(),
      bookingId,
      sequence: i + 1,
      origin,
      destination,
      departure,
      arrival,
      passengers: faker.number.int({ min: 1, max: paxCap }),
    });
    prev = destination;
    cursor = new Date(arrival.getTime() + faker.number.int({ min: 4, max: 72 }) * 60 * 60_000);
  }
  return legs;
}

export const TRIP_LEGS: TripLeg[] = BOOKINGS.flatMap((b) => {
  const aircraft = getAircraft(b.aircraftId);
  const paxCap = aircraft?.paxCapacity ?? 8;
  return generateLegs(b.id, paxCap);
});

export const legsForBooking = (bookingId: string): TripLeg[] =>
  TRIP_LEGS.filter((l) => l.bookingId === bookingId).sort(
    (a, b) => a.sequence - b.sequence,
  );
