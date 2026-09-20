import React from "react";
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Colors from "../constants/colors";

interface InvitationQRCodeProps {
  value: string;
  size?: number;
  backgroundColor?: string;
  color?: string;
}

export default function InvitationQRCode({
  value,
  size = 220,
  backgroundColor = "#FFFFFF",
  color = "#0F172A",
}: InvitationQRCodeProps) {
  return (
    <View style={styles.container}>
      <QRCode
        value={value}
        size={size}
        backgroundColor={backgroundColor}
        color={color}
        quietZone={10}
        ecl="M"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
