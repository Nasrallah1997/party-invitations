import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { useInvitationStore } from "../../lib/store";
import Button from "../../components/Button";

export default function AdminDashboard() {
  const { stats, activeEvent, checkIns, guests } = useInvitationStore();

  const recentCheckIns = checkIns.slice(0, 3).map((ci) => {
    const guest = guests.find((g) => g.id === ci.guest_id);
    return {
      ...ci,
      guestName: guest?.name || "Guest",
    };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <TouchableOpacity
              style={styles.backHubBtn}
              onPress={() => router.replace("/")}
            >
              <Ionicons name="apps-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.backHubText}>Home Hub</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Party Invitation Management</Text>
          </View>

          <TouchableOpacity
            style={styles.profileBadge}
            onPress={() => router.push("/admin/events")}
          >
            <Ionicons name="calendar" size={18} color={Colors.accentDark} />
          </TouchableOpacity>
        </View>

        {/* Active Event Summary Banner */}
        {activeEvent ? (
          <TouchableOpacity
            style={styles.eventBanner}
            onPress={() => router.push("/admin/events")}
            activeOpacity={0.85}
          >
            <View style={styles.eventBannerLeft}>
              <View style={styles.eventLiveDot} />
              <View style={styles.eventBannerDetails}>
                <Text style={styles.eventBannerOverline}>SELECTED EVENT</Text>
                <Text style={styles.eventBannerName} numberOfLines={1}>
                  {activeEvent.name}
                </Text>
                <Text style={styles.eventBannerLoc} numberOfLines={1}>
                  {activeEvent.location}
                </Text>
              </View>
            </View>
            <View style={styles.switchEventBtn}>
              <Text style={styles.switchEventText}>Change</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.accentDark} />
            </View>
          </TouchableOpacity>
        ) : null}

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBadge, { backgroundColor: "#EEF2FF" }]}>
              <Ionicons name="people" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.statNumber}>{stats.totalGuests}</Text>
            <Text style={styles.statLabel}>Guests</Text>
            <Text style={styles.statSub}>{stats.totalAttendees} total tickets</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBadge, { backgroundColor: Colors.successLight }]}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            </View>
            <Text style={[styles.statNumber, { color: Colors.success }]}>
              {stats.totalCheckedIn}
            </Text>
            <Text style={styles.statLabel}>Checked In</Text>
            <Text style={styles.statSub}>{stats.checkedInAttendees} verified</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Entrance Attendance Rate</Text>
            <Text style={styles.progressPercentage}>{stats.checkInPercentage}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.max(5, stats.checkInPercentage)}%` },
              ]}
            />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.progressFooterText}>
              {stats.totalCheckedIn} of {stats.totalGuests} guests arrived
            </Text>
            <Text style={styles.progressFooterText}>
              {stats.pendingCount} pending
            </Text>
          </View>
        </View>

        {/* Quick Actions Title */}
        <Text style={styles.sectionTitle}>ACTIONS</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/admin/guests")}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#EFF6FF" }]}>
            <Ionicons name="person-add" size={22} color="#2563EB" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Manage Guests</Text>
            <Text style={styles.actionSub}>
              Add guests, generate unique QR codes, view tokens
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/admin/events")}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="calendar-outline" size={22} color="#D97706" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Manage Events</Text>
            <Text style={styles.actionSub}>
              Create new party, view locations & capacities
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
        </TouchableOpacity>

        {/* Primary Scanner Button */}
        <TouchableOpacity
          style={styles.scannerButton}
          onPress={() => router.push("/scanner")}
          activeOpacity={0.8}
        >
          <Ionicons name="scan-circle" size={26} color={Colors.white} />
          <Text style={styles.scannerText}>Open Gate Scanner</Text>
        </TouchableOpacity>

        {/* Recent Check-ins */}
        {recentCheckIns.length > 0 ? (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>RECENT CHECK-INS</Text>
            {recentCheckIns.map((item) => (
              <View key={item.id} style={styles.recentItem}>
                <View style={styles.recentItemIcon}>
                  <Ionicons name="checkmark" size={14} color={Colors.success} />
                </View>
                <View style={styles.recentItemInfo}>
                  <Text style={styles.recentItemName}>{item.guestName}</Text>
                  <Text style={styles.recentItemDetail}>
                    {item.number_of_people} guests • Scanned by {item.scanned_by}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  backHubBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  backHubText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "600",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    color: Colors.textMuted,
    marginTop: 4,
    fontSize: 14,
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  eventBanner: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eventBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  eventLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    marginRight: 12,
  },
  eventBannerDetails: {
    flex: 1,
  },
  eventBannerOverline: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.accentDark,
    letterSpacing: 0.5,
  },
  eventBannerName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 2,
  },
  eventBannerLoc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  switchEventBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardSubtle,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  switchEventText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.accentDark,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.text,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  statSub: {
    color: Colors.textLight,
    fontSize: 11,
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.accentDark,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  progressFooterText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.textLight,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  actionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  actionInfo: {
    flex: 1,
    paddingRight: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 3,
  },
  actionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  scannerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 6,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  scannerText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  recentSection: {
    marginTop: 8,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentItemIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.successLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  recentItemInfo: {
    flex: 1,
  },
  recentItemName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  recentItemDetail: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
