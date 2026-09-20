import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { useInvitationStore } from "../../lib/store";
import { formatDisplayTime } from "../../lib/invitations";

export default function ScannerResultScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { verifyAndCheckIn } = useInvitationStore();

  const result = useMemo(() => {
    if (!token) {
      return {
        status: "invalid" as const,
        message: "No token was provided.",
        scannedAt: new Date().toISOString(),
      };
    }
    return verifyAndCheckIn(token, "Gate Staff Scanner");
  }, [token]);

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

  const previousScanTime = result.lastCheckIn?.scanned_at
    ? formatDisplayTime(result.lastCheckIn.scanned_at)
    : formatDisplayTime(result.scannedAt);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Check-In Result"
        onBackPress={() => router.replace("/scanner")}
      />

      <View style={styles.container}>
        <View style={[styles.card, { borderColor: header.borderColor }]}>
          {/* Status Icon */}
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: header.bgColor, borderColor: header.accentColor },
            ]}
          >
            <Ionicons name={header.icon} size={48} color={header.accentColor} />
          </View>

          <Text style={[styles.statusTitle, { color: header.accentColor }]}>
            {header.title}
          </Text>

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

          {guest ? (
            <View style={styles.guestBlock}>
              <Text style={styles.guestName}>{guest.name}</Text>

              <View style={styles.badgeRow}>
                <View style={styles.pillBadge}>
                  <Ionicons name="people" size={16} color={Colors.primary} />
                  <Text style={styles.pillBadgeText}>
                    {peopleCount === 1 ? "1 Guest" : `${peopleCount} Guests`}
                  </Text>
                </View>

                {result.event ? (
                  <View style={styles.pillBadge}>
                    <Ionicons name="calendar" size={14} color={Colors.textMuted} />
                    <Text style={styles.pillBadgeText} numberOfLines={1}>
                      {result.event.name}
                    </Text>
                  </View>
                ) : null}
              </View>

              {isWarning ? (
                <View style={styles.timeWarningBox}>
                  <Ionicons name="time-outline" size={18} color={Colors.warning} />
                  <Text style={styles.timeWarningText}>
                    Scanned at: {previousScanTime || "Earlier today"}
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
            </View>
          )}

          <View style={styles.actionRow}>
            <Button
              title="Scan Next Guest"
              onPress={() => router.replace("/scanner")}
              size="lg"
              variant={isSuccess ? "primary" : isWarning ? "gold" : "danger"}
            />

            <Button
              title="Return to Dashboard"
              onPress={() => router.replace("/admin")}
              size="md"
              variant="ghost"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
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
  guestBlock: {
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
    paddingVertical: 14,
  },
  deniedText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.danger,
    textAlign: "center",
  },
  actionRow: {
    width: "100%",
    marginTop: 20,
    gap: 10,
  },
});
