import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import Header from "../../components/Header";
import InvitationQRCode from "../../components/QRCode";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { useInvitationStore } from "../../lib/store";
import { encodeQRPayload, formatDisplayDate, formatDisplayTime } from "../../lib/invitations";

export default function InvitationScreen() {
  const { guestId } = useLocalSearchParams<{ guestId?: string }>();
  const { guests, invitations, activeEvent, getGuestInvitation } = useInvitationStore();

  // Find requested guest or default to Mohamed Ahmed (guest-1)
  const guest = (guestId ? guests.find((g) => g.id === guestId) : guests[0]) || guests[0];
  const invitation = guest ? getGuestInvitation(guest.id) : invitations[0];

  // Token: "8f3a7e92-9c42-4f2b-91d8"
  const token = invitation?.token || "8f3a7e92-9c42-4f2b-91d8";
  const qrPayload = encodeQRPayload(token, activeEvent?.id);
  const isCheckedIn = invitation?.status === "used";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `VIP Invitation for ${guest?.name || "Guest"}\nEvent: ${activeEvent?.name}\nShow this QR at entrance.\nToken: ${token}`,
      });
    } catch {
      // Ignored
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Guest Pass"
        subtitle="Gate Entry Ticket"
        onBackPress={() => router.replace("/")}
        rightAction={
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={Colors.text} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Luxury Invitation Card */}
        <View style={styles.passCard}>
          {/* Decorative Corner Accents */}
          <View style={[styles.cornerAccent, styles.cornerTL]} />
          <View style={[styles.cornerAccent, styles.cornerTR]} />
          <View style={[styles.cornerAccent, styles.cornerBL]} />
          <View style={[styles.cornerAccent, styles.cornerBR]} />

          <View style={styles.passHeader}>
            <Text style={styles.passOverline}>EXCLUSIVE INVITATION</Text>
            <Text style={styles.title}>You're Invited</Text>
            <Text style={styles.event}>{activeEvent?.name || "Wedding Party"}</Text>
          </View>

          {/* Guest Name & Quota */}
          <View style={styles.guestSection}>
            <Text style={styles.guest}>{guest?.name || "Mohamed Ahmed"}</Text>
            <View style={styles.attendeesBadge}>
              <Ionicons name="people" size={14} color={Colors.accentDark} />
              <Text style={styles.attendeesBadgeText}>
                {guest?.number_of_people || 3} Guests Admitted
              </Text>
            </View>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrContainer}>
            <InvitationQRCode value={qrPayload} size={220} />
            <Text style={styles.tokenCaption}>
              Token: {token}
            </Text>
          </View>

          {/* Status Indicator */}
          <View style={styles.statusRow}>
            <StatusBadge
              status={isCheckedIn ? "checked-in" : (invitation?.status || "active")}
            />
          </View>

          <View style={styles.dottedDivider} />

          {/* Event Meta Details */}
          <View style={styles.metaBlock}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={18} color={Colors.accent} />
              <View>
                <Text style={styles.metaLabel}>DATE & TIME</Text>
                <Text style={styles.metaValue}>
                  {activeEvent?.event_date
                    ? `${formatDisplayDate(activeEvent.event_date)} • ${formatDisplayTime(activeEvent.event_date)}`
                    : "Thursday, Oct 15, 2026 • 7:00 PM"}
                </Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={18} color={Colors.accent} />
              <View style={{ flex: 1 }}>
                <Text style={styles.metaLabel}>VENUE</Text>
                <Text style={styles.metaValue} numberOfLines={2}>
                  {activeEvent?.location || "Al Baha Royal Ballroom, Al Baha"}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.instruction}>
            Please present this QR code to the entrance staff for verification.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomActions}>
          <Button
            title="Scan at Entrance (Open Scanner)"
            onPress={() => router.push("/scanner")}
            variant="primary"
            size="lg"
            icon={<Ionicons name="scan" size={20} color={Colors.white} />}
          />

          <Button
            title="Back to Home Hub"
            onPress={() => router.replace("/")}
            variant="ghost"
            size="md"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  shareBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2D9C8",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    position: "relative",
    marginBottom: 24,
  },
  cornerAccent: {
    position: "absolute",
    width: 14,
    height: 14,
    borderColor: Colors.accent,
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  passHeader: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  passOverline: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: Colors.accentDark,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  event: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
  guestSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  guest: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
  },
  attendeesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    marginTop: 6,
  },
  attendeesBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.accentDark,
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  tokenCaption: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  statusRow: {
    marginTop: 10,
    marginBottom: 6,
  },
  dottedDivider: {
    width: "100%",
    height: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    marginVertical: 18,
  },
  metaBlock: {
    width: "100%",
    gap: 12,
    paddingHorizontal: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 2,
  },
  instruction: {
    textAlign: "center",
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
    paddingHorizontal: 10,
  },
  bottomActions: {
    width: "100%",
    maxWidth: 380,
    gap: 8,
  },
});
