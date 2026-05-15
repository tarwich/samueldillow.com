import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

faker.seed(606);

export interface Salesperson {
  id: string;
  name: string;
  email: string;
}

const NAMES = [
  "Avery Hollis",
  "Jordan Pace",
  "Riley Quintero",
  "Morgan Tate",
  "Casey Whitlock",
  "Devon Bray",
];

export const SALESPEOPLE: Salesperson[] = NAMES.map((name) => {
  const [first, last] = name.split(" ");
  return {
    id: nanoid(),
    name,
    email: `${first}.${last}@airpeggio.com`.toLowerCase(),
  };
});

export const getSalesperson = (id: string): Salesperson | undefined =>
  SALESPEOPLE.find((s) => s.id === id);
