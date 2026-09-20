import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";
import { EventItem } from "../types/invitation";
import { formatDisplayDate, formatDisplayTime } from "../lib/invitations";

interface EventCardProps {
  event: EventItem;
  isActive?: boolean;
  onPress: () => void;
  guestCount?: number;
  checkedInCount?: number;
}

export default function EventCard({
  event,
  isActive = false,
  onPress,
  guestCount,
  checkedInCount,
}: EventCardProps) {
  const displayDate = formatDisplayDate(event.event_date);
  const displayTime = formatDisplayTime(event.event_date);

  return (
    <TouchableOpacity
      style={[styles.card, isActive && styles.cardActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          <Text style={styles.name} numberOfLines={1}>
            {event.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        </View>

        {isActive ? (
          <View style={styles.activeTag}>
            <Text style={styles.activeTagText}>Active</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.metaDivider} />

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={15} color={Colors.accent} />
          <Text style={styles.metaText}>
            {displayDate} {displayTime ? `• ${displayTime}` : ""}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={15} color={Colors.accent} />
          <Text style={styles.metaText} numberOfLines={1}>
            {event.location}
          </Text>
        </View>
      </View>

      {guestCount !== undefined ? (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{guestCount}</Text>
            <Text style={styles.statLabel}>Total Guests</Text>
          </View>
          {checkedInCount !== undefined ? (
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.success }]}>
                {checkedInCount}
              </Text>
              <Text style={styles.statLabel}>Checked In</Text>
            </View>
          ) : null}
          {event.capacity ? (
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{event.capacity}</Text>
              <Text style={styles.statLabel}>Capacity</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardActive: {
    borderColor: Colors.accent,
    borderWidth: 1.5,
    backgroundColor: "#FFFCF6",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleArea: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  activeTag: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
  },
  activeTagText: {
    color: Colors.accentDark,
    fontSize: 11,
    fontWeight: "700",
  },
  metaDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },
  metaRow: {
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textMuted,
    flexShrink: 1,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 20,
  },
  statItem: {
    alignItems: "flex-start",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 2,
  },
});
