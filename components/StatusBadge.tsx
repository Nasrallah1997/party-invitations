import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";
import { InvitationStatus } from "../types/invitation";

interface StatusBadgeProps {
  status: InvitationStatus | "checked-in" | "valid" | "invalid";
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case "active":
        return {
          label: "Active",
          bgColor: Colors.successLight,
          textColor: Colors.success,
          borderColor: Colors.successBorder,
          icon: "checkmark-circle" as const,
        };
      case "used":
      case "checked-in":
        return {
          label: "Checked In",
          bgColor: Colors.infoLight,
          textColor: Colors.info,
          borderColor: "#BFDBFE",
          icon: "person-circle" as const,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          bgColor: Colors.cardSubtle,
          textColor: Colors.textMuted,
          borderColor: Colors.border,
          icon: "close-circle" as const,
        };
      case "expired":
      case "invalid":
        return {
          label: status === "expired" ? "Expired" : "Invalid",
          bgColor: Colors.dangerLight,
          textColor: Colors.danger,
          borderColor: Colors.dangerBorder,
          icon: "alert-circle" as const,
        };
      default:
        return {
          label: String(status).toUpperCase(),
          bgColor: Colors.cardSubtle,
          textColor: Colors.textMuted,
          borderColor: Colors.border,
          icon: "help-circle" as const,
        };
    }
  };

  const config = getBadgeConfig();
  const isSm = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          paddingVertical: isSm ? 3 : 6,
          paddingHorizontal: isSm ? 8 : 12,
        },
      ]}
    >
      <Ionicons
        name={config.icon}
        size={isSm ? 12 : 15}
        color={config.textColor}
        style={{ marginRight: 5 }}
      />
      <Text
        style={[
          styles.text,
          {
            color: config.textColor,
            fontSize: isSm ? 11 : 13,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
