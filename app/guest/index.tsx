import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import Header from "../../components/Header";
import { useInvitationStore } from "../../lib/store";

export default function GuestIndexScreen() {
  const { guests, activeEvent } = useInvitationStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="My Invitations"
        subtitle="Select a ticket to display your gate QR pass"
        onBackPress={() => router.replace("/")}
      />

      <View style={styles.container}>
        <FlatList
          data={guests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.invitationCard}
              onPress={() => router.push(`/guest/invitation?guestId=${item.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>INVITATION PASS</Text>
                </View>
                <Ionicons name="qr-code-outline" size={24} color={Colors.accent} />
              </View>

              <Text style={styles.eventName}>{activeEvent?.name || "Event"}</Text>
              <Text style={styles.guestName}>{item.name}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                  <Ionicons name="people-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.footerText}>
                    {item.number_of_people} {item.number_of_people === 1 ? "Person" : "People"}
                  </Text>
                </View>
                <Text style={styles.viewPassText}>View Pass →</Text>
              </View>
            </TouchableOpacity>
          )}
        />
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
  },
  listContent: {
    paddingBottom: 30,
  },
  invitationCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.accentDark,
    letterSpacing: 0.5,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 4,
  },
  guestName: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 12,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  viewPassText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.accentDark,
  },
});
