import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";
import { Guest, Invitation } from "../types/invitation";
import StatusBadge from "./StatusBadge";

interface GuestCardProps {
  guest: Guest;
  invitation?: Invitation;
  onPress: () => void;
}

export default function GuestCard({ guest, invitation, onPress }: GuestCardProps) {
  const isCheckedIn = invitation?.status === "used";
  const peopleCount = guest.number_of_people || 1;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.leftCol}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {guest.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.name} numberOfLines={1}>
            {guest.name}
          </Text>

          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.detailText}>
              {peopleCount === 1 ? "1 Guest" : `${peopleCount} People`}
            </Text>

            {guest.phone ? (
              <>
                <Text style={styles.dotSeparator}>•</Text>
                <Text style={styles.detailText} numberOfLines={1}>
                  {guest.phone}
                </Text>
              </>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.rightCol}>
        <StatusBadge
          status={isCheckedIn ? "checked-in" : (invitation?.status || "active")}
          size="sm"
        />
        <View style={styles.qrShortcut}>
          <Ionicons name="qr-code-outline" size={18} color={Colors.accent} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  infoCol: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  dotSeparator: {
    fontSize: 12,
    color: Colors.textLight,
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 8,
  },
  qrShortcut: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
});
