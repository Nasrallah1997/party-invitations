import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";
import { useInvitationStore } from "../lib/store";

export default function Index() {
  const { setUserRole, stats, activeEvent } = useInvitationStore();

  const handleSelectRole = (role: "admin" | "guest" | "scanner", destination: string) => {
    setUserRole(role);
    router.push(destination as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Branding */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="sparkles" size={28} color={Colors.accent} />
          </View>
          <Text style={styles.title}>Party & Event Pass</Text>
          <Text style={styles.subtitle}>
            Production-Ready QR Invitation & Gate Management System
          </Text>
        </View>

        {/* Active Event Banner */}
        {activeEvent ? (
          <View style={styles.eventBanner}>
            <View style={styles.eventBannerIcon}>
              <Ionicons name="calendar" size={18} color={Colors.accentDark} />
            </View>
            <View style={styles.eventBannerInfo}>
              <Text style={styles.eventBannerLabel}>CURRENT DEMO EVENT</Text>
              <Text style={styles.eventBannerTitle} numberOfLines={1}>
                {activeEvent.name}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Quick Stats Summary */}
        <View style={styles.statsPreviewRow}>
          <View style={styles.statsMiniCard}>
            <Text style={styles.statsMiniNumber}>{stats.totalGuests}</Text>
            <Text style={styles.statsMiniLabel}>Registered</Text>
          </View>
          <View style={styles.statsMiniCard}>
            <Text style={[styles.statsMiniNumber, { color: Colors.success }]}>
              {stats.totalCheckedIn}
            </Text>
            <Text style={styles.statsMiniLabel}>Checked In</Text>
          </View>
          <View style={styles.statsMiniCard}>
            <Text style={[styles.statsMiniNumber, { color: Colors.accent }]}>
              {stats.checkInPercentage}%
            </Text>
            <Text style={styles.statsMiniLabel}>Turnout</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>SELECT USER EXPERIENCE</Text>

        {/* Role Select Cards */}
        <TouchableOpacity
          style={[styles.roleCard, styles.adminCard]}
          onPress={() => handleSelectRole("admin", "/admin")}
          activeOpacity={0.8}
        >
          <View style={[styles.roleIcon, { backgroundColor: "#EEF2FF" }]}>
            <Ionicons name="shield-checkmark" size={24} color="#4F46E5" />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Admin Dashboard</Text>
            <Text style={styles.roleDesc}>
              Manage events, add unlimited guests, generate QR tokens & view statistics.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, styles.guestCard]}
          onPress={() => handleSelectRole("guest", "/guest/invitation")}
          activeOpacity={0.8}
        >
          <View style={[styles.roleIcon, { backgroundColor: Colors.accentLight }]}>
            <Ionicons name="qr-code" size={24} color={Colors.accentDark} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Guest Invitation Pass</Text>
            <Text style={styles.roleDesc}>
              View luxury digital ticket with unique QR pass ready for gate check-in.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, styles.scannerCard]}
          onPress={() => handleSelectRole("scanner", "/scanner")}
          activeOpacity={0.8}
        >
          <View style={[styles.roleIcon, { backgroundColor: Colors.successLight }]}>
            <Ionicons name="scan" size={24} color={Colors.success} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Entrance QR Scanner</Text>
            <Text style={styles.roleDesc}>
              Fast camera check-in: Validates token against database & flags duplicates.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
        </TouchableOpacity>

        {/* Traditional Auth Entry */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.loginLinkText}>
            Go to Authentication (Sign In / Register) →
          </Text>
        </TouchableOpacity>
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
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 320,
  },
  eventBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF9EE",
    borderWidth: 1,
    borderColor: Colors.warningBorder,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  eventBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  eventBannerInfo: {
    flex: 1,
  },
  eventBannerLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.accentDark,
    letterSpacing: 0.5,
  },
  eventBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 2,
  },
  statsPreviewRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statsMiniCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsMiniNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
  },
  statsMiniLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: "500",
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.textLight,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  roleCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  adminCard: {},
  guestCard: {},
  scannerCard: {},
  roleIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
    paddingRight: 8,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  loginLink: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.accentDark,
  },
});
