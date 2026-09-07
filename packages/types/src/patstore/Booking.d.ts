import { ClassProperties } from "./Classes";
import { PersonClass, PersonPointer } from "./Person";

/** Booking type discriminator (`typ` in the original `buchungen` table). */
export type BookingType =
  | "L" // Sparkastenleerung
  | "T" // Lottogewinn
  | "A" // Auszahlung
  | "S" // Sonderbuchung
  | "G"; // Gemeinschaftskasse

/** Payload stored in Booking.data. Amounts are integer cents. */
export type BookingData = {
  wert: number;
  text: string | null;
  hauptbuch: number | null;
  sparer: number | null;
  einwurf: number | null;
  sparclub: number | null;
  lotto: number | null;
  strafgeld: number | null;
  vg: number | null;
  personId?: string | null;
  legacyId?: number;
  legacyMemberId?: number | null;
};

export type BookingClass = ClassProperties & {
  type: BookingType;
  person?: PersonClass | PersonPointer | null;
  data: BookingData;
};

/** Normalized ledger row used by reports and screens. */
export type LedgerBooking = {
  objectId: string;
  type: BookingType;
  personId: string | null;
  wert: number;
  text: string | null;
  hauptbuch: number | null;
  sparer: number | null;
  einwurf: number | null;
  sparclub: number | null;
  lotto: number | null;
  strafgeld: number | null;
  vg: number | null;
};
