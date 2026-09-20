import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Share,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../constants/colors";
import Header from "../../../components/Header";
import InvitationQRCode from "../../../components/QRCode";
import StatusBadge from "../../../components/StatusBadge";
import Button from "../../../components/Button";
import { useInvitationStore } from "../../../lib/store";
import { encodeQRPayload, formatDisplayTime, formatDisplayDate } from "../../../lib/invitations";

export default function GuestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getGuestById, getGuestInvitation, getEventById, checkIns, verifyAndCheckIn } =
    useInvitationStore();

  const guest = getGuestById(id as string);
  const invitation = guest ? getGuestInvitation(guest.id) : undefined;
  const event = guest ? getEventById(guest.event_id) : undefined;
  const isCheckedIn = invitation?.status === "used";

  const checkInRecord = checkIns.find((ci) => ci.invitation_id === invitation?.id);

  const qrPayload = invitation ? encodeQRPayload(invitation.token, invitation.event_id) : "";

  const handleShare = async () => {
    if (!guest || !invitation) return;
    try {
      await Share.share({
        message: `Party Pass for ${guest.name}\nEvent: ${event?.name || "Party"}\nToken: ${invitation.token}\nShow this token at the entrance!`,
      });
    } catch {
      // Ignore share dismissal
    }
  };

  const handleManualCheckIn = () => {
    if (!invitation) return;
    const res = verifyAndCheckIn(invitation.token, "Admin Manual Override");
    Alert.alert(
      res.status === "valid" ? "Checked In!" : "Notice",
      res.message
    );
  };

  if (!guest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Guest Details" />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Guest not found.</Text>
          <Button title="Back to Guests" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Guest Invitation"
        subtitle={guest.name}
        rightAction={
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={Colors.text} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Pass Card with QR */}
        <View style={styles.passCard}>
          <View style={styles.passTopRow}>
            <View>
              <Text style={styles.passEventName} numberOfLines={1}>
                {event?.name || "Party Invitation"}
              </Text>
              <Text style={styles.passDate}>
                {event?.event_date ? formatDisplayDate(event.event_date) : ""}
              </Text>
            </View>

            <StatusBadge
              status={isCheckedIn ? "checked-in" : (invitation?.status || "active")}
            />
          </View>

          {/* QR Code Container */}
          <View style={styles.qrSection}>
            {invitation ? (
              <InvitationQRCode value={qrPayload} size={200} />
            ) : null}
            <Text style={styles.tokenText}>
              TOKEN: {invitation?.token || "NONE"}
            </Text>
          </View>

          {/* Guest Name & Quota */}
          <View style={styles.guestInfoBlock}>
            <Text style={styles.guestName}>{guest.name}</Text>
            <View style={styles.attendeesPill}>
              <Ionicons name="people" size={16} color={Colors.primary} />
              <Text style={styles.attendeesText}>
                {guest.number_of_people} {guest.number_of_people === 1 ? "Person" : "People"} Admitted
              </Text>
            </View>
          </View>

          {/* Check-in details / status */}
          <View style={styles.statusBox}>
            {isCheckedIn && checkInRecord ? (
              <View style={styles.checkedInRow}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkedInTitle}>Checked In Successfully</Text>
                  <Text style={styles.checkedInSub}>
                    Time: {formatDisplayTime(checkInRecord.scanned_at)} • Scanned by {checkInRecord.scanned_by}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.pendingRow}>
                <Ionicons name="time-outline" size={20} color={Colors.textMuted} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.pendingTitle}>Awaiting Entrance Check-in</Text>
                  <Text style={styles.pendingSub}>Guest has not arrived at the gate yet.</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Contact info card */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionHeading}>GUEST CONTACT INFO</Text>

          {guest.phone ? (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={18} color={Colors.textMuted} />
              <Text style={styles.infoValue}>{guest.phone}</Text>
            </View>
          ) : null}

          {guest.email ? (
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
              <Text style={styles.infoValue}>{guest.email}</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
            <Text style={styles.infoValue}>
              Issued: {formatDisplayDate(guest.created_at)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsCol}>
          {!isCheckedIn ? (
            <Button
              title="Manual Check-In Override"
              onPress={handleManualCheckIn}
              variant="primary"
              size="lg"
            />
          ) : null}

          <Button
            title="Share / Send Invitation"
            onPress={handleShare}
            variant="outline"
            size="md"
          />

          <Button
            title="Test in Entrance Scanner"
            onPress={() => router.push("/scanner")}
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
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textMuted,
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
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 16,
  },
  passTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  passEventName: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    maxWidth: 200,
  },
  passDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  qrSection: {
    alignItems: "center",
    marginVertical: 10,
  },
  tokenText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textMuted,
    marginTop: 14,
    letterSpacing: 0.5,
  },
  guestInfoBlock: {
    alignItems: "center",
    marginTop: 14,
  },
  guestName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
  },
  attendeesPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardSubtle,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
    marginTop: 8,
  },
  attendeesText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
  },
  statusBox: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  checkedInRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.successLight,
    padding: 12,
    borderRadius: 12,
  },
  checkedInTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.success,
  },
  checkedInSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  pendingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.cardSubtle,
    padding: 12,
    borderRadius: 12,
  },
  pendingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  pendingSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.textLight,
    letterSpacing: 1,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text,
  },
  actionButtonsCol: {
    gap: 10,
  },
});
