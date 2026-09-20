import React, { createContext, useContext, useState, useMemo } from "react";
import {
  EventItem,
  Guest,
  Invitation,
  CheckInRecord,
  VerificationResult,
  UserRole,
} from "../types/invitation";
import {
  INITIAL_EVENTS,
  INITIAL_GUESTS,
  INITIAL_INVITATIONS,
  INITIAL_CHECK_INS,
} from "./mockData";
import { generateInvitationToken, parseScannedQR } from "./invitations";

interface StoreContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  events: EventItem[];
  guests: Guest[];
  invitations: Invitation[];
  checkIns: CheckInRecord[];
  activeEventId: string;
  setActiveEventId: (id: string) => void;
  activeEvent?: EventItem;

  // Actions
  createEvent: (eventData: Omit<EventItem, "id" | "created_at">) => EventItem;
  addGuest: (guestData: Omit<Guest, "id" | "created_at">) => { guest: Guest; invitation: Invitation };
  getGuestInvitation: (guestId: string) => Invitation | undefined;
  getGuestById: (guestId: string) => Guest | undefined;
  getEventById: (eventId: string) => EventItem | undefined;
  verifyAndCheckIn: (rawScannedData: string, scannedBy?: string) => VerificationResult;
  resetMockData: () => void;

  // Computed stats
  stats: {
    totalGuests: number;
    totalAttendees: number; // Sum of number_of_people
    totalCheckedIn: number;
    checkedInAttendees: number;
    pendingCount: number;
    checkInPercentage: number;
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [invitations, setInvitations] = useState<Invitation[]>(INITIAL_INVITATIONS);
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(INITIAL_CHECK_INS);
  const [activeEventId, setActiveEventId] = useState<string>(INITIAL_EVENTS[0]?.id || "evt-1");

  const activeEvent = useMemo(
    () => events.find((e) => e.id === activeEventId) || events[0],
    [events, activeEventId]
  );

  const getGuestInvitation = (guestId: string) => {
    return invitations.find((inv) => inv.guest_id === guestId);
  };

  const getGuestById = (guestId: string) => {
    return guests.find((g) => g.id === guestId);
  };

  const getEventById = (eventId: string) => {
    return events.find((e) => e.id === eventId);
  };

  const createEvent = (eventData: Omit<EventItem, "id" | "created_at">) => {
    const newId = `evt-${Date.now()}`;
    const newEvent: EventItem = {
      ...eventData,
      id: newId,
      created_at: new Date().toISOString(),
    };
    setEvents((prev) => [newEvent, ...prev]);
    setActiveEventId(newId);
    return newEvent;
  };

  const addGuest = (guestData: Omit<Guest, "id" | "created_at">) => {
    const guestId = `guest-${Date.now()}`;
    const newGuest: Guest = {
      ...guestData,
      id: guestId,
      created_at: new Date().toISOString(),
    };

    const token = generateInvitationToken();
    const newInvitation: Invitation = {
      id: `inv-${Date.now()}`,
      guest_id: guestId,
      event_id: guestData.event_id,
      token,
      status: "active",
      created_at: new Date().toISOString(),
    };

    setGuests((prev) => [newGuest, ...prev]);
    setInvitations((prev) => [newInvitation, ...prev]);

    return { guest: newGuest, invitation: newInvitation };
  };

  const verifyAndCheckIn = (
    rawScannedData: string,
    scannedBy: string = "Gate Staff"
  ): VerificationResult => {
    const now = new Date().toISOString();
    const parsed = parseScannedQR(rawScannedData);

    if (!parsed || !parsed.token) {
      return {
        status: "invalid",
        message: "Invalid QR code format. Access Denied.",
        scannedAt: now,
      };
    }

    const token = parsed.token.trim();

    // Look up invitation by exact token or stripped token
    const invitation = invitations.find(
      (inv) =>
        inv.token.toLowerCase() === token.toLowerCase() ||
        inv.token.toLowerCase() === token.replace(/^INV-/i, "").toLowerCase() ||
        `INV-${inv.token}`.toLowerCase() === token.toLowerCase()
    );

    if (!invitation) {
      return {
        status: "invalid",
        message: "Access Denied. Invitation does not exist.",
        scannedAt: now,
      };
    }

    const guest = guests.find((g) => g.id === invitation.guest_id);
    const event = events.find((e) => e.id === invitation.event_id);

    // Case 1: Already used / checked in
    if (invitation.status === "used") {
      const existingCheckIn = checkIns.find(
        (ci) => ci.invitation_id === invitation.id
      );
      return {
        status: "already_used",
        message: "This invitation was already used.",
        guest,
        event,
        invitation,
        lastCheckIn: existingCheckIn,
        scannedAt: now,
      };
    }

    // Case 2: Cancelled or expired
    if (invitation.status === "cancelled" || invitation.status === "expired") {
      return {
        status: "invalid",
        message: `This invitation is ${invitation.status}. Access Denied.`,
        guest,
        event,
        invitation,
        scannedAt: now,
      };
    }

    // Case 3: Valid! Perform Check-In
    const newCheckIn: CheckInRecord = {
      id: `checkin-${Date.now()}`,
      invitation_id: invitation.id,
      guest_id: invitation.guest_id,
      event_id: invitation.event_id,
      scanned_by: scannedBy,
      scanned_at: now,
      number_of_people: guest?.number_of_people || 1,
    };

    // Update invitation status to used
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitation.id ? { ...inv, status: "used" as const } : inv
      )
    );

    // Record check-in
    setCheckIns((prev) => [newCheckIn, ...prev]);

    return {
      status: "valid",
      message: "Checked In Successfully!",
      guest,
      event,
      invitation: { ...invitation, status: "used" },
      lastCheckIn: newCheckIn,
      scannedAt: now,
    };
  };

  const resetMockData = () => {
    setEvents(INITIAL_EVENTS);
    setGuests(INITIAL_GUESTS);
    setInvitations(INITIAL_INVITATIONS);
    setCheckIns(INITIAL_CHECK_INS);
  };

  // Compute stats for current active event
  const stats = useMemo(() => {
    const currentGuests = guests.filter((g) => g.event_id === activeEventId);
    const totalGuests = currentGuests.length;
    const totalAttendees = currentGuests.reduce(
      (sum, g) => sum + (g.number_of_people || 1),
      0
    );

    const checkedInGuestIds = new Set(
      checkIns
        .filter((c) => c.event_id === activeEventId)
        .map((c) => c.guest_id)
    );

    const totalCheckedIn = currentGuests.filter((g) =>
      checkedInGuestIds.has(g.id)
    ).length;

    const checkedInAttendees = currentGuests
      .filter((g) => checkedInGuestIds.has(g.id))
      .reduce((sum, g) => sum + (g.number_of_people || 1), 0);

    const pendingCount = totalGuests - totalCheckedIn;
    const checkInPercentage =
      totalGuests > 0 ? Math.round((totalCheckedIn / totalGuests) * 100) : 0;

    return {
      totalGuests,
      totalAttendees,
      totalCheckedIn,
      checkedInAttendees,
      pendingCount,
      checkInPercentage,
    };
  }, [guests, checkIns, activeEventId]);

  return (
    <StoreContext.Provider
      value={{
        userRole,
        setUserRole,
        events,
        guests,
        invitations,
        checkIns,
        activeEventId,
        setActiveEventId,
        activeEvent,
        createEvent,
        addGuest,
        getGuestInvitation,
        getGuestById,
        getEventById,
        verifyAndCheckIn,
        resetMockData,
        stats,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useInvitationStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useInvitationStore must be used within a StoreProvider");
  }
  return context;
}
