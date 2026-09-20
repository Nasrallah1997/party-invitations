import { EventItem, Guest, Invitation, CheckInRecord } from "../types/invitation";

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: "evt-1",
    name: "Royal Wedding & Gala Celebration",
    description: "Honoring the wedding of Mohamed & Sara. Formal dress code requested.",
    location: "Al Baha Royal Ballroom, Al Baha",
    event_date: "2026-10-15T19:00:00.000Z",
    capacity: 500,
    created_at: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "evt-2",
    name: "VIP Tech Launch & Private Dinner",
    description: "Exclusive evening gathering for industry partners and keynote speakers.",
    location: "Sky Lounge, Riyadh",
    event_date: "2026-11-20T20:00:00.000Z",
    capacity: 120,
    created_at: "2026-09-05T14:30:00.000Z",
  },
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: "guest-1",
    event_id: "evt-1",
    name: "Mohamed Ahmed",
    phone: "+966 50 123 4567",
    email: "mohamed.ahmed@example.com",
    number_of_people: 3,
    created_at: "2026-09-02T11:00:00.000Z",
  },
  {
    id: "guest-2",
    event_id: "evt-1",
    name: "Sara Al-Harbi",
    phone: "+966 55 987 6543",
    email: "sara.alharbi@example.com",
    number_of_people: 2,
    created_at: "2026-09-02T11:15:00.000Z",
  },
  {
    id: "guest-3",
    event_id: "evt-1",
    name: "Fahad Al-Otaibi",
    phone: "+966 54 333 2211",
    email: "fahad.otaibi@example.com",
    number_of_people: 1,
    created_at: "2026-09-03T09:40:00.000Z",
  },
  {
    id: "guest-4",
    event_id: "evt-1",
    name: "Noura Al-Zahrani",
    phone: "+966 56 444 8899",
    email: "noura.zahrani@example.com",
    number_of_people: 4,
    created_at: "2026-09-03T14:20:00.000Z",
  },
  {
    id: "guest-5",
    event_id: "evt-1",
    name: "Tariq Mansoor",
    phone: "+966 59 777 5544",
    email: "tariq.mansoor@example.com",
    number_of_people: 2,
    created_at: "2026-09-04T16:00:00.000Z",
  },
];

export const INITIAL_INVITATIONS: Invitation[] = [
  {
    id: "inv-1",
    guest_id: "guest-1",
    event_id: "evt-1",
    token: "8f3a7e92-9c42-4f2b-91d8", // The primary active demo token from user specification!
    status: "active",
    created_at: "2026-09-02T11:00:00.000Z",
  },
  {
    id: "inv-2",
    guest_id: "guest-2",
    event_id: "evt-1",
    token: "7b2c9d11-3e45-42a1-89d0", // Demo "Already Used" token
    status: "used",
    created_at: "2026-09-02T11:15:00.000Z",
  },
  {
    id: "inv-3",
    guest_id: "guest-3",
    event_id: "evt-1",
    token: "5c1a8e34-1f22-48b9-b871",
    status: "active",
    created_at: "2026-09-03T09:40:00.000Z",
  },
  {
    id: "inv-4",
    guest_id: "guest-4",
    event_id: "evt-1",
    token: "9d4e2f65-7a8b-4c0d-e1f2",
    status: "active",
    created_at: "2026-09-03T14:20:00.000Z",
  },
  {
    id: "inv-5",
    guest_id: "guest-5",
    event_id: "evt-1",
    token: "3a8f1e29-6b5c-4d7e-90f1",
    status: "active",
    created_at: "2026-09-04T16:00:00.000Z",
  },
];

export const INITIAL_CHECK_INS: CheckInRecord[] = [
  {
    id: "checkin-1",
    invitation_id: "inv-2",
    guest_id: "guest-2",
    event_id: "evt-1",
    scanned_by: "Gate Staff 1",
    scanned_at: "2026-10-15T19:42:00.000Z",
    number_of_people: 2,
  },
];
