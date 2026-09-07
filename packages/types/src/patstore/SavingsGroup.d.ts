export type SavingsGroupClubSettings = {
  name: string;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  country: string;
  currency: string;
  email: string;
  version?: string;
  created?: string;
  denominationMax?: string;
};

export type SavingRule = {
  id: number;
  name: string;
  einwurf_min: number;
  strafgeld: number;
  sparclub: number;
  sparclub_min: number;
  sparclub_vg: number;
  lotto: number;
  lotto_min: number;
  lotto_vg: number;
};

/** Pocket assignment plus member details; `personId` points at Person. */
export type SavingsGroupMember = {
  personId: string;
  legacyId?: number;
  status: number;
  sparregeln: number;
  sparfach: string;
  lottozahl: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  houseNumber?: string;
  zip?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  birthday?: string;
  birthplace?: string;
  nationality?: string;
  occupation?: string;
  note?: string;
};

/** Stored on the SavingsGroup module (`data` and `settings.savingsGroup`). */
export type SavingsGroupModuleData = {
  settings: SavingsGroupClubSettings;
  savingRules: SavingRule[];
  members: SavingsGroupMember[];
  seedImported?: boolean;
};
