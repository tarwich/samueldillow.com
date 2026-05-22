import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { CUSTOMERS } from "./customers";
import { AIRCRAFT } from "./aircraft";

faker.seed(505);

export type BookingStatus =
  | "quoted"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  reference: string;
  customerId: string;
  aircraftId: string;
  status: BookingStatus;
  createdAt: Date;
}

export const BOOKINGS: Booking[] = Array.from({ length: 30 }, (_, i) => ({
  id: nanoid(),
  reference: `BK-2026-${String(i + 1).padStart(4, "0")}`,
  customerId: faker.helpers.arrayElement(CUSTOMERS).id,
  aircraftId: faker.helpers.arrayElement(AIRCRAFT).id,
  status: faker.helpers.weightedArrayElement<BookingStatus>([
    { value: "quoted", weight: 3 },
    { value: "confirmed", weight: 4 },
    { value: "in-progress", weight: 2 },
    { value: "completed", weight: 5 },
    { value: "cancelled", weight: 1 },
  ]),
  createdAt: faker.date.between({
    from: "2026-01-01T00:00:00Z",
    to: "2026-05-10T00:00:00Z",
  }),
}));

export const getBooking = (id: string): Booking | undefined =>
  BOOKINGS.find((b) => b.id === id);

export const bookingsForCustomer = (customerId: string): Booking[] =>
  BOOKINGS.filter((b) => b.customerId === customerId);
