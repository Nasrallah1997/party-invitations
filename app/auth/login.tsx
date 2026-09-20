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
import { useInvitationStore } from "../../lib/store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserRole } = useInvitationStore();

  const handleLogin = (roleOverride?: "admin" | "scanner" | "guest") => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const chosenRole = roleOverride || (email.toLowerCase().includes("scanner") ? "scanner" : email.toLowerCase().includes("guest") ? "guest" : "admin");
      setUserRole(chosenRole);

      if (chosenRole === "admin") {
        router.replace("/admin");
      } else if (chosenRole === "scanner") {
        router.replace("/scanner");
      } else {
        router.replace("/guest/invitation");
      }
    }, 400);
  };

  const handleQuickDemo = (role: "admin" | "scanner" | "guest") => {
    if (role === "admin") {
      setEmail("admin@party.com");
      setPassword("password123");
    } else if (role === "scanner") {
      setEmail("scanner@party.com");
      setPassword("password123");
    } else {
      setEmail("guest@party.com");
      setPassword("password123");
    }
    handleLogin(role);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Return to Hub link */}
          <TouchableOpacity
            style={styles.backToHub}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textMuted} />
            <Text style={styles.backToHubText}>Home Hub</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="key-outline" size={32} color={Colors.accent} />
            </View>
            <Text style={styles.title}>Party Invitation</Text>
            <Text style={styles.subtitle}>
              Sign in to manage your events, check in guests, or view your invitation
            </Text>
          </View>

          {/* Quick Demo Selector */}
          <View style={styles.demoBox}>
            <Text style={styles.demoLabel}>QUICK ONE-TAP DEMO SIGN-IN:</Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={styles.demoRoleBtn}
                onPress={() => handleQuickDemo("admin")}
              >
                <Ionicons name="shield-checkmark" size={14} color="#4F46E5" />
                <Text style={styles.demoRoleText}>Admin</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.demoRoleBtn}
                onPress={() => handleQuickDemo("scanner")}
              >
                <Ionicons name="scan" size={14} color={Colors.success} />
                <Text style={styles.demoRoleText}>Scanner</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.demoRoleBtn}
                onPress={() => handleQuickDemo("guest")}
              >
                <Ionicons name="qr-code" size={14} color={Colors.accentDark} />
                <Text style={styles.demoRoleText}>Guest</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
                placeholder="••••••••"
                placeholderTextColor={Colors.textLight}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Button
              title="Sign In"
              onPress={() => handleLogin()}
              loading={loading}
              size="lg"
              style={styles.signInButton}
            />

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => router.push("/auth/register")}
            >
              <Text style={styles.registerText}>
                Don't have an account?{" "}
                <Text style={styles.registerHighlight}>Register</Text>
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
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  backToHub: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 6,
  },
  backToHubText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
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
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 300,
  },
  demoBox: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  demoLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.textLight,
    letterSpacing: 0.5,
    marginBottom: 10,
    textAlign: "center",
  },
  demoButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  demoRoleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.cardSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  demoRoleText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
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
  signInButton: {
    marginTop: 8,
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 8,
  },
  registerText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  registerHighlight: {
    color: Colors.accentDark,
    fontWeight: "700",
  },
});
