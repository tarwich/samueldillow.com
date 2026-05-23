import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';

faker.seed(101);

export type CompanyType = 'broker' | 'fbo' | 'operator' | 'individual';

export interface Company {
  id: string;
  name: string;
  domain: string;
  type: CompanyType;
  address?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

const COMPANY_SUFFIXES = [
  'Aviation',
  'Air',
  'Air Group',
  'Charters',
  'Charter Group',
  'Jets',
  'Jet Partners',
  'Wings',
  'Aero',
  'Aircraft Services',
];

const generateCompanyName = (): string => {
  const suffix = faker.helpers.arrayElement(COMPANY_SUFFIXES);
  const style = faker.number.int({ min: 0, max: 2 });
  switch (style) {
    case 0:
      return `${faker.location.city()} ${suffix}`;
    case 1:
      return `${faker.person.lastName()} ${suffix}`;
    default:
      return faker.company.name();
  }
};

const COMPANY_COUNT = 30;
const seenNames = new Set<string>();
const COMPANY_NAMES: string[] = [];
while (COMPANY_NAMES.length < COMPANY_COUNT) {
  const name = generateCompanyName();
  if (seenNames.has(name)) continue;
  seenNames.add(name);
  COMPANY_NAMES.push(name);
}

const slugDomain = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^the/, '') + '.com';

const STATES = ['TX', 'CA', 'FL', 'NY', 'CO', 'AZ', 'WA', 'IL', 'GA', 'NJ'];

const fakeAddress = () =>
  `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.helpers.arrayElement(STATES)} ${faker.location.zipCode('#####')}`;

const IMPORTED_NOTE = 'Imported 2025-01-08T00:00:00.000Z';

export const COMPANIES: Company[] = COMPANY_NAMES.map((name) => {
  const domain = slugDomain(name);
  const hasAddress = faker.number.float() < 0.35;
  const hasPhone = faker.number.float() < 0.4;
  const hasEmail = faker.number.float() < 0.5;
  const noteRoll = faker.number.float();
  const notes =
    noteRoll < 0.6
      ? IMPORTED_NOTE
      : noteRoll < 0.85
        ? undefined
        : faker.lorem.sentence();

  return {
    id: nanoid(),
    name,
    domain,
    type: faker.helpers.arrayElement<CompanyType>([
      'broker',
      'fbo',
      'operator',
      'individual',
    ]),
    address: hasAddress ? fakeAddress() : undefined,
    phone: hasPhone ? faker.phone.number({ style: 'national' }) : undefined,
    email: hasEmail ? `info@${domain}` : undefined,
    notes,
  };
});

export const getCompany = (id: string): Company | undefined =>
  COMPANIES.find((c) => c.id === id);

export const formatCompanyForModal = (company: Company) => {
  const payload = {
    id: company.id,
    name: company.name,
    domain: company.domain,
    type: company.type,
    address: company.address,
    phone: company.phone,
    email: company.email,
    notes: company.notes,
  };

  return JSON.stringify(payload);
};
