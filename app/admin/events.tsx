import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import Header from "../../components/Header";
import EventCard from "../../components/EventCard";
import Button from "../../components/Button";
import { useInvitationStore } from "../../lib/store";

export default function EventsScreen() {
  const { events, activeEventId, setActiveEventId, guests, checkIns } = useInvitationStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Manage Events"
        subtitle="Select active event or create a new celebration"
        rightAction={
          <TouchableOpacity
            style={styles.addEventHeaderBtn}
            onPress={() => router.push("/admin/create-event")}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        }
      />

      <View style={styles.container}>
        {/* Search input */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events by name or location..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Events list */}
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No Events Found</Text>
              <Text style={styles.emptySub}>
                Tap the "+ Create Event" button below to add your first event.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const eventGuests = guests.filter((g) => g.event_id === item.id);
            const guestIds = new Set(eventGuests.map((g) => g.id));
            const checkedIn = checkIns.filter(
              (ci) => ci.event_id === item.id && guestIds.has(ci.guest_id)
            ).length;

            return (
              <EventCard
                event={item}
                isActive={item.id === activeEventId}
                guestCount={eventGuests.length}
                checkedInCount={checkedIn}
                onPress={() => {
                  setActiveEventId(item.id);
                }}
              />
            );
          }}
        />

        {/* Floating / bottom CTA button */}
        <View style={styles.bottomBar}>
          <Button
            title="+ Create New Event"
            onPress={() => router.push("/admin/create-event")}
            size="lg"
            variant="primary"
          />
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
    paddingHorizontal: 20,
  },
  addEventHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  listContent: {
    paddingBottom: 90,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center",
    maxWidth: 260,
    marginTop: 6,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
