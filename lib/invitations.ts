import { v4 as uuidv4 } from "uuid";
import { QRPayload } from "../types/invitation";

/**
 * Generates a unique secure invitation token.
 * Example: INV-8f3a7e92-9c42-4f2b-91d8
 */
export function generateInvitationToken(): string {
  try {
    const rawUuid = uuidv4();
    return `INV-${rawUuid}`;
  } catch {
    // Fallback in case of crypto issues on some platforms
    const randomHex = Math.random().toString(36).substring(2, 10);
    const timeHex = Date.now().toString(36);
    return `INV-${timeHex}-${randomHex}`;
  }
}

/**
 * Builds the standard JSON QR payload:
 * { "v": 1, "invitation": "INV-..." }
 */
export function encodeQRPayload(token: string, eventId?: string): string {
  const payload: QRPayload = {
    v: 1,
    invitation: token,
    eventId,
  };
  return JSON.stringify(payload);
}

/**
 * Parses scanned QR text. Supports:
 * - JSON payload: { "v": 1, "invitation": "..." }
 * - Legacy format: EVT1:<token>
 * - Raw token string: INV-... or standard UUID
 */
export function parseScannedQR(data: string): { token: string; eventId?: string } | null {
  if (!data || typeof data !== "string") return null;

  const trimmed = data.trim();

  // 1. Try parsing JSON format
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed.invitation === "string") {
        return {
          token: parsed.invitation,
          eventId: parsed.eventId,
        };
      }
      if (parsed && typeof parsed.invitationId === "string") {
        return {
          token: parsed.invitationId,
          eventId: parsed.eventId,
        };
      }
    } catch {
      // Ignore JSON parse error and fallback
    }
  }

  // 2. Try prefixed format (e.g. EVT1:INV-...)
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":");
    if (parts.length >= 2) {
      return { token: parts.slice(1).join(":") };
    }
  }

  // 3. Raw token format
  return { token: trimmed };
}

/**
 * Format date string into human-readable format
 */
export function formatDisplayDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format time string
 */
export function formatDisplayTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
