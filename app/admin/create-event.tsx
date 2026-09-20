import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { useInvitationStore } from "../../lib/store";

export default function CreateEventScreen() {
  const { createEvent } = useInvitationStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("2026-10-15T19:00:00.000Z");
  const [capacity, setCapacity] = useState("250");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Required Field", "Please enter an event name.");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Required Field", "Please enter an event location.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const parsedCapacity = parseInt(capacity, 10) || 100;
      createEvent({
        name: name.trim(),
        description: description.trim() || "Exclusive private celebration",
        location: location.trim(),
        event_date: eventDate,
        capacity: parsedCapacity,
      });

      setLoading(false);
      Alert.alert("Event Created", "The new event has been created and set as active.", [
        { text: "View Events", onPress: () => router.back() },
      ]);
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Create New Event" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            <Text style={styles.label}>Event Title *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="sparkles-outline" size={18} color={Colors.textMuted} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Wedding Party / Annual Gala"
                placeholderTextColor={Colors.textLight}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>Location / Venue *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={18} color={Colors.textMuted} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Al Baha Ballroom, Riyadh"
                placeholderTextColor={Colors.textLight}
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <Text style={styles.label}>Event Date & Time</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textLight}
                value={eventDate}
                onChangeText={setEventDate}
              />
            </View>

            <Text style={styles.label}>Expected Capacity (Guests)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="people-outline" size={18} color={Colors.textMuted} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. 300"
                placeholderTextColor={Colors.textLight}
                keyboardType="numeric"
                value={capacity}
                onChangeText={setCapacity}
              />
            </View>

            <Text style={styles.label}>Description & Notes</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add special instructions, dress code, VIP gate notes..."
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <Button
              title="Save & Launch Event"
              onPress={handleSave}
              loading={loading}
              size="lg"
              variant="primary"
              style={styles.saveBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  scrollContent: {
    padding: 20,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.background,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  textAreaWrapper: {
    height: 110,
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  textArea: {
    height: "100%",
    textAlignVertical: "top",
  },
  saveBtn: {
    marginTop: 10,
  },
});
