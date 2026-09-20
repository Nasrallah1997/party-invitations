import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import Header from "../../components/Header";
import GuestCard from "../../components/GuestCard";
import Button from "../../components/Button";
import { useInvitationStore } from "../../lib/store";

export default function GuestsScreen() {
  const { guests, activeEventId, activeEvent, addGuest, getGuestInvitation } =
    useInvitationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "checked-in">("all");
  const [modalVisible, setModalVisible] = useState(false);

  // New Guest Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [peopleCount, setPeopleCount] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  // Filter guests belonging to active event
  const eventGuests = guests.filter((g) => g.event_id === activeEventId);

  const filteredGuests = eventGuests.filter((g) => {
    const inv = getGuestInvitation(g.id);
    const isCheckedIn = inv?.status === "used";

    // Tab filter
    if (filterTab === "pending" && isCheckedIn) return false;
    if (filterTab === "checked-in" && !isCheckedIn) return false;

    // Search query
    const matchName = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPhone = g.phone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchEmail = g.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchName || matchPhone || matchEmail;
  });

  const handleCreateGuest = () => {
    if (!name.trim()) {
      Alert.alert("Missing Name", "Please provide a guest name.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const count = parseInt(peopleCount, 10) || 1;
      const { guest, invitation } = addGuest({
        event_id: activeEventId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        number_of_people: count,
      });

      setSubmitting(false);
      setModalVisible(false);
      setName("");
      setPhone("");
      setEmail("");
      setPeopleCount("1");

      Alert.alert(
        "Guest & QR Generated!",
        `Invitation created for ${guest.name} (${count} people).\nToken: ${invitation.token}`,
        [
          {
            text: "View Invitation",
            onPress: () => router.push(`/admin/guest/${guest.id}`),
          },
          { text: "Done" },
        ]
      );
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Guest Directory"
        subtitle={activeEvent ? activeEvent.name : "Event Guests"}
        rightAction={
          <TouchableOpacity
            style={styles.addBtnHeader}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="person-add" size={18} color={Colors.white} />
          </TouchableOpacity>
        }
      />

      <View style={styles.container}>
        {/* Search input */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, phone or email..."
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

        {/* Filter Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, filterTab === "all" && styles.tabBtnActive]}
            onPress={() => setFilterTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                filterTab === "all" && styles.tabTextActive,
              ]}
            >
              All ({eventGuests.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              filterTab === "checked-in" && styles.tabBtnActive,
            ]}
            onPress={() => setFilterTab("checked-in")}
          >
            <Text
              style={[
                styles.tabText,
                filterTab === "checked-in" && styles.tabTextActive,
              ]}
            >
              Checked In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              filterTab === "pending" && styles.tabBtnActive,
            ]}
            onPress={() => setFilterTab("pending")}
          >
            <Text
              style={[
                styles.tabText,
                filterTab === "pending" && styles.tabTextActive,
              ]}
            >
              Pending
            </Text>
          </TouchableOpacity>
        </View>

        {/* Guest list */}
        <FlatList
          data={filteredGuests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No Guests Match</Text>
              <Text style={styles.emptySub}>
                Tap "+ Add Guest" below to generate a new invitation pass.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const invitation = getGuestInvitation(item.id);
            return (
              <GuestCard
                guest={item}
                invitation={invitation}
                onPress={() => router.push(`/admin/guest/${item.id}`)}
              />
            );
          }}
        />

        {/* Floating Add Guest Button */}
        <View style={styles.bottomBar}>
          <Button
            title="+ Add Guest & Generate QR"
            onPress={() => setModalVisible(true)}
            size="lg"
            variant="primary"
          />
        </View>
      </View>

      {/* Add Guest Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <Header
            title="Add Guest & Issue QR"
            subtitle={`Event: ${activeEvent?.name || "Active Event"}`}
            onBackPress={() => setModalVisible(false)}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={styles.modalCard}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={18} color={Colors.textMuted} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Mohamed Ahmed"
                    placeholderTextColor={Colors.textLight}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={18} color={Colors.textMuted} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="+966 50 123 4567"
                    placeholderTextColor={Colors.textLight}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>

                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="guest@example.com"
                    placeholderTextColor={Colors.textLight}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <Text style={styles.inputLabel}>Total People Admitted (Guest + companions)</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="people-outline" size={18} color={Colors.textMuted} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 2"
                    placeholderTextColor={Colors.textLight}
                    keyboardType="numeric"
                    value={peopleCount}
                    onChangeText={setPeopleCount}
                  />
                </View>

                <View style={styles.qrNoticeBox}>
                  <Ionicons name="information-circle" size={20} color={Colors.accentDark} />
                  <Text style={styles.qrNoticeText}>
                    A secure, unique QR invitation token will be generated automatically upon saving.
                  </Text>
                </View>

                <Button
                  title="Generate Invitation & QR"
                  onPress={handleCreateGuest}
                  loading={submitting}
                  size="lg"
                  variant="gold"
                  style={styles.createBtn}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
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
  addBtnHeader: {
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
    marginBottom: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.white,
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
  modalSafeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalScroll: {
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputLabel: {
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
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  qrNoticeBox: {
    flexDirection: "row",
    backgroundColor: Colors.accentLight,
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
  },
  qrNoticeText: {
    flex: 1,
    fontSize: 12,
    color: Colors.accentDark,
    lineHeight: 18,
  },
  createBtn: {
    marginTop: 4,
  },
});
