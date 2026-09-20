import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import Button from "../../components/Button";
import Header from "../../components/Header";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "scanner">("admin");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Account Created", "Your account has been created successfully.", [
        { text: "Sign In Now", onPress: () => router.replace("/auth/login") },
      ]);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Create Account" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Join Party Pass</Text>
            <Text style={styles.subtitle}>
              Set up your organizer or staff scanner account
            </Text>
          </View>

          {/* Role selector */}
          <View style={styles.rolePickerContainer}>
            <Text style={styles.inputLabel}>Account Type</Text>
            <View style={styles.rolePickerRow}>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  role === "admin" && styles.roleOptionActive,
                ]}
                onPress={() => setRole("admin")}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={18}
                  color={role === "admin" ? Colors.white : Colors.textMuted}
                />
                <Text
                  style={[
                    styles.roleOptionText,
                    role === "admin" && styles.roleOptionTextActive,
                  ]}
                >
                  Event Organizer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleOption,
                  role === "scanner" && styles.roleOptionActive,
                ]}
                onPress={() => setRole("scanner")}
              >
                <Ionicons
                  name="scan"
                  size={18}
                  color={role === "scanner" ? Colors.white : Colors.textMuted}
                />
                <Text
                  style={[
                    styles.roleOptionText,
                    role === "scanner" && styles.roleOptionTextActive,
                  ]}
                >
                  Entrance Staff
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Sarah Jenkins"
                placeholderTextColor={Colors.textLight}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor={Colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Choose a strong password"
                placeholderTextColor={Colors.textLight}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              size="lg"
              style={styles.createButton}
            />

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.back()}
            >
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text style={styles.loginHighlight}>Sign In</Text>
              </Text>
            </TouchableOpacity>
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
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  rolePickerContainer: {
    marginBottom: 20,
  },
  rolePickerRow: {
    flexDirection: "row",
    gap: 10,
  },
  roleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
  },
  roleOptionTextActive: {
    color: Colors.white,
  },
  form: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
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
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: Colors.text,
  },
  createButton: {
    marginTop: 8,
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 8,
  },
  loginText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  loginHighlight: {
    color: Colors.accentDark,
    fontWeight: "700",
  },
});
