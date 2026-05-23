import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { CUSTOMERS } from "./customers";
import { COMPANIES } from "./companies";

faker.seed(303);

// Pick three companies from the generated DB to act as aircraft owners,
// then choose one of each company's customers as the owner customer. Keeps
// "View Owner Profile" links resolving to real customer entries without
// hand-writing names that could resemble real people or companies.
const companiesWithCustomers = COMPANIES.filter((co) =>
  CUSTOMERS.some((cu) => cu.companyId === co.id),
);
const ownerCompanies = faker.helpers.arrayElements(companiesWithCustomers, 3);
const ownerSeats = ownerCompanies.map((company) => {
  const customer = faker.helpers.arrayElement(
    CUSTOMERS.filter((c) => c.companyId === company.id),
  );
  return {
    owner: company.name,
    ownerEmail: company.email ?? `owner@${company.domain}`,
    ownerCustomerId: customer.id,
  };
});

export type AircraftEngineType = "piston" | "turboprop" | "jet";

export type AircraftImageKey =
  | "1-piston-01"
  | "1-piston-02"
  | "2-piston-01"
  | "1-turboprop-01"
  | "2-turboprop-01"
  | "2-turboprop-02"
  | "2-jet-light-01"
  | "2-jet-light-02"
  | "2-jet-midsize-01"
  | "2-jet-midsize-02"
  | "2-jet-super-midsize-01"
  | "2-jet-heavy-01";

export interface AircraftImageConfig {
  key: AircraftImageKey;
  engineCount: 1 | 2;
  engineType: AircraftEngineType;
  subtype?: "light" | "midsize" | "super-midsize" | "heavy";
  path: string;
}

export interface Aircraft {
  id: string;
  tail: string;
  owner: string;
  ownerEmail: string;
  ownerCustomerId: string;
  serialNumber: string;
  model: string;
  class: string;
  seats: number;
  paxCapacity: number;
  location: string;
  baseAirport: string;
  status: "available";
  privacy: "private" | "charter";
  requireOwnerApproval: boolean;
  hobbs: string;
  airframeHours: string;
  airframeCycles: string;
  engineCount: 1 | 2;
  engineType: AircraftEngineType;
  imageKey: AircraftImageKey;
  color: "red" | "lime" | "blue";
  image: string;
  detailImage?: string;
}

type AircraftTemplate = Pick<
  Aircraft,
  | "tail"
  | "owner"
  | "ownerEmail"
  | "ownerCustomerId"
  | "serialNumber"
  | "model"
  | "class"
  | "seats"
  | "location"
  | "privacy"
  | "requireOwnerApproval"
  | "engineCount"
  | "engineType"
  | "imageKey"
  | "color"
> &
  Partial<Pick<Aircraft, "hobbs" | "airframeHours" | "airframeCycles">>;

const AIRCRAFT_IMAGES_ROOT = "/portfolio/airpeggio/aircraft";

const aircraftImage = (key: string) => `${AIRCRAFT_IMAGES_ROOT}/${key}.webp`;

export const AIRCRAFT_IMAGE_CATALOG: AircraftImageConfig[] = [
  {
    key: "1-piston-01",
    engineCount: 1,
    engineType: "piston",
    path: aircraftImage("1-piston-01"),
  },
  {
    key: "1-piston-02",
    engineCount: 1,
    engineType: "piston",
    path: aircraftImage("1-piston-02"),
  },
  {
    key: "2-piston-01",
    engineCount: 2,
    engineType: "piston",
    path: aircraftImage("2-piston-01"),
  },
  {
    key: "1-turboprop-01",
    engineCount: 1,
    engineType: "turboprop",
    path: aircraftImage("1-turboprop-01"),
  },
  {
    key: "2-turboprop-01",
    engineCount: 2,
    engineType: "turboprop",
    path: aircraftImage("2-turboprop-01"),
  },
  {
    key: "2-turboprop-02",
    engineCount: 2,
    engineType: "turboprop",
    path: aircraftImage("2-turboprop-02"),
  },
  {
    key: "2-jet-light-01",
    engineCount: 2,
    engineType: "jet",
    subtype: "light",
    path: aircraftImage("2-jet-light-01"),
  },
  {
    key: "2-jet-light-02",
    engineCount: 2,
    engineType: "jet",
    subtype: "light",
    path: aircraftImage("2-jet-light-02"),
  },
  {
    key: "2-jet-midsize-01",
    engineCount: 2,
    engineType: "jet",
    subtype: "midsize",
    path: aircraftImage("2-jet-midsize-01"),
  },
  {
    key: "2-jet-midsize-02",
    engineCount: 2,
    engineType: "jet",
    subtype: "midsize",
    path: aircraftImage("2-jet-midsize-02"),
  },
  {
    key: "2-jet-super-midsize-01",
    engineCount: 2,
    engineType: "jet",
    subtype: "super-midsize",
    path: aircraftImage("2-jet-super-midsize-01"),
  },
  {
    key: "2-jet-heavy-01",
    engineCount: 2,
    engineType: "jet",
    subtype: "heavy",
    path: aircraftImage("2-jet-heavy-01"),
  },
];

const getImageConfig = (key: AircraftImageKey): AircraftImageConfig => {
  const imageConfig = AIRCRAFT_IMAGE_CATALOG.find((image) => image.key === key);
  if (!imageConfig) throw new Error(`Missing aircraft image config: ${key}`);
  return imageConfig;
};

const generateAircraft = (template: AircraftTemplate): Aircraft => {
  const baseAirport = template.location;
  const imageConfig = getImageConfig(template.imageKey);
  const hobbs = template.hobbs ?? "-";
  const airframeHours =
    template.airframeHours ??
    faker.number.float({ min: 0, max: 1200, fractionDigits: 1 }).toString();
  const airframeCycles =
    template.airframeCycles ??
    String(faker.number.int({ min: 0, max: 900 }));

  return {
    ...template,
    id: nanoid(),
    paxCapacity: template.seats,
    baseAirport,
    status: "available",
    image: imageConfig.path,
    hobbs,
    airframeHours,
    airframeCycles,
  };
};

const AIRCRAFT_TEMPLATES: AircraftTemplate[] = [
  {
    tail: "N482SD",
    ...ownerSeats[0],
    serialNumber: "SD-4820",
    model: "S22T",
    class: "Single Engine Land",
    seats: 3,
    location: "KADS",
    privacy: "private",
    requireOwnerApproval: true,
    engineCount: 1,
    engineType: "piston",
    imageKey: "1-piston-01",
    hobbs: "-",
    airframeHours: "1.4",
    airframeCycles: "1",
    color: "red",
  },
  {
    tail: "N731AP",
    ...ownerSeats[1],
    serialNumber: "AP-0765",
    model: "Learjet 45",
    class: "Jet",
    seats: 8,
    location: "SBJD",
    privacy: "charter",
    requireOwnerApproval: false,
    engineCount: 2,
    engineType: "jet",
    imageKey: "2-jet-midsize-01",
    hobbs: "-",
    airframeHours: "0",
    airframeCycles: "0",
    color: "lime",
  },
  {
    tail: "N904VX",
    ...ownerSeats[2],
    serialNumber: "VX-0889",
    model: "Citation CJ4",
    class: "Jet",
    seats: 9,
    location: "KMTO",
    privacy: "charter",
    requireOwnerApproval: false,
    engineCount: 2,
    engineType: "jet",
    imageKey: "2-jet-light-02",
    hobbs: "-",
    airframeHours: "0",
    airframeCycles: "0",
    color: "blue",
  },
];

export const AIRCRAFT: Aircraft[] = AIRCRAFT_TEMPLATES.map(generateAircraft);

export const getAircraft = (id: string): Aircraft | undefined =>
  AIRCRAFT.find((a) => a.id === id);

export const formatAircraftForModal = (aircraft: Aircraft): string => {
  const payload = {
    id: aircraft.id,
    tail: aircraft.tail,
    serialNumber: aircraft.serialNumber,
    model: aircraft.model,
    class: aircraft.class,
    seats: aircraft.seats,
    engineCount: aircraft.engineCount,
    airframeHours: aircraft.airframeHours,
    airframeCycles: aircraft.airframeCycles,
    baseAirport: aircraft.baseAirport,
    privacy: aircraft.privacy,
    owner: aircraft.owner,
    color: aircraft.color,
    image: aircraft.image,
    requireOwnerApproval: aircraft.requireOwnerApproval,
  };
  return JSON.stringify(payload);
};
