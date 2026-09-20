import React from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";
import { VerificationResult } from "../types/invitation";
import { formatDisplayTime } from "../lib/invitations";
import Button from "./Button";

interface ScanResultCardProps {
  result: VerificationResult | null;
  visible: boolean;
  onDismiss: () => void;
  onScanNext: () => void;
}

export default function ScanResultCard({
  result,
  visible,
  onDismiss,
  onScanNext,
}: ScanResultCardProps) {
  if (!result) return null;

  const isSuccess = result.status === "valid";
  const isWarning = result.status === "already_used";
  const isDanger = result.status === "invalid";

  const getHeaderDetails = () => {
    if (isSuccess) {
      return {
        title: "VALID INVITATION",
        subtitle: "CHECKED IN",
        icon: "checkmark-sharp" as const,
        accentColor: Colors.success,
        bgColor: Colors.successLight,
        borderColor: Colors.successBorder,
      };
    }
    if (isWarning) {
      return {
        title: "ALREADY USED",
        subtitle: "PREVIOUSLY SCANNED",
        icon: "warning-outline" as const,
        accentColor: Colors.warning,
        bgColor: Colors.warningLight,
        borderColor: Colors.warningBorder,
      };
    }
    return {
      title: "INVALID INVITATION",
      subtitle: "ACCESS DENIED",
      icon: "close-sharp" as const,
      accentColor: Colors.danger,
      bgColor: Colors.dangerLight,
      borderColor: Colors.dangerBorder,
    };
  };

  const header = getHeaderDetails();
  const guest = result.guest;
  const peopleCount = guest?.number_of_people || 1;

  // Format previous scan time if already used
  const previousScanTime = result.lastCheckIn?.scanned_at
    ? formatDisplayTime(result.lastCheckIn.scanned_at)
    : formatDisplayTime(result.scannedAt);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.card, { borderColor: header.borderColor }]}>
          {/* Main Status Icon Circle */}
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: header.bgColor,
                borderColor: header.accentColor,
              },
            ]}
          >
            <Ionicons name={header.icon} size={48} color={header.accentColor} />
          </View>

          {/* Status Title Banner */}
          <Text style={[styles.statusTitle, { color: header.accentColor }]}>
            {header.title}
          </Text>

          {/* Subtitle tag */}
          <View
            style={[
              styles.statusTag,
              { backgroundColor: header.bgColor, borderColor: header.borderColor },
            ]}
          >
            <Text style={[styles.statusTagText, { color: header.accentColor }]}>
              {header.subtitle}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Guest Information Details */}
          {guest ? (
            <View style={styles.detailsBlock}>
              <Text style={styles.guestName}>{guest.name}</Text>

              <View style={styles.badgeRow}>
                <View style={styles.pillBadge}>
                  <Ionicons name="people" size={16} color={Colors.primary} />
                  <Text style={styles.pillBadgeText}>
                    {peopleCount === 1 ? "1 Guest" : `${peopleCount} Guests`}
                  </Text>
                </View>

                {result.event ? (
                  <View style={styles.pillBadgeSubtle}>
                    <Ionicons name="calendar" size={14} color={Colors.textMuted} />
                    <Text style={styles.pillBadgeSubtleText} numberOfLines={1}>
                      {result.event.name}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Timestamp notes */}
              {isWarning ? (
                <View style={styles.timeWarningBox}>
                  <Ionicons name="time-outline" size={18} color={Colors.warning} />
                  <Text style={styles.timeWarningText}>
                    First Scanned: {previousScanTime || "Earlier today"}
                  </Text>
                </View>
              ) : null}

              {isSuccess ? (
                <View style={styles.successTimeBox}>
                  <Ionicons name="time-outline" size={18} color={Colors.success} />
                  <Text style={styles.successTimeText}>
                    Check-in Recorded: {formatDisplayTime(result.scannedAt) || "Just now"}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.deniedBlock}>
              <Text style={styles.deniedText}>{result.message}</Text>
              <Text style={styles.deniedSubtext}>
                The scanned QR code is either not registered or does not belong to this event.
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <Button
              title="Scan Next Guest"
              onPress={onScanNext}
              variant={isSuccess ? "primary" : isWarning ? "gold" : "danger"}
              size="lg"
              style={styles.primaryActionButton}
            />

            <Button
              title="Close"
              onPress={onDismiss}
              variant="ghost"
              size="md"
              style={styles.dismissButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 6,
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  detailsBlock: {
    width: "100%",
    alignItems: "center",
  },
  guestName: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  pillBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  pillBadgeSubtle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    maxWidth: 180,
  },
  pillBadgeSubtleText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  timeWarningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
  },
  timeWarningText: {
    color: Colors.accentDark,
    fontSize: 13,
    fontWeight: "600",
  },
  successTimeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.successLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.successBorder,
  },
  successTimeText: {
    color: Colors.success,
    fontSize: 13,
    fontWeight: "600",
  },
  deniedBlock: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
  },
  deniedText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.danger,
    textAlign: "center",
    marginBottom: 6,
  },
  deniedSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
  actionRow: {
    width: "100%",
    marginTop: 18,
    gap: 8,
  },
  primaryActionButton: {
    width: "100%",
  },
  dismissButton: {
    width: "100%",
  },
});
