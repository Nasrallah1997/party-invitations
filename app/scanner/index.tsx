import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import ScanResultCard from "../../components/ScanResultCard";
import { useInvitationStore } from "../../lib/store";
import { VerificationResult } from "../../types/invitation";

const { width } = Dimensions.get("window");
const SCAN_BOX_SIZE = Math.min(width * 0.72, 280);

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [scanResult, setScanResult] = useState<VerificationResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [simulationVisible, setSimulationVisible] = useState(false);

  const { verifyAndCheckIn, activeEvent } = useInvitationStore();

  // Scanning reticle animation line
  const [animValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animValue]);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_BOX_SIZE - 4],
  });

  const handleProcessBarcode = (rawData: string) => {
    if (scanned || modalVisible) return;
    setScanned(true);

    const result = verifyAndCheckIn(rawData, "Entrance Gate Staff");
    setScanResult(result);
    setModalVisible(true);
  };

  const handleScanNext = () => {
    setModalVisible(false);
    setScanResult(null);
    setTimeout(() => {
      setScanned(false);
    }, 300);
  };

  const handleDismissModal = () => {
    setModalVisible(false);
    setScanResult(null);
    setTimeout(() => {
      setScanned(false);
    }, 300);
  };

  // Test simulation triggers
  const handleSimulateScan = (testType: "valid" | "duplicate" | "invalid") => {
    let testToken = "8f3a7e92-9c42-4f2b-91d8"; // Mohamed Ahmed (valid until scanned)
    if (testType === "duplicate") {
      testToken = "7b2c9d11-3e45-42a1-89d0"; // Sara Al-Harbi (already used)
    } else if (testType === "invalid") {
      testToken = "INV-FAKE-0000-0000-0000";
    }

    handleProcessBarcode(testToken);
  };

  const renderCameraOrFallback = () => {
    if (!permission) {
      return <View style={styles.cameraPlaceholder} />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionCard}>
          <Ionicons name="camera-outline" size={54} color={Colors.white} />
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionSub}>
            Camera access is required to scan guest invitation QR codes at the gate.
          </Text>
          <TouchableOpacity
            style={styles.permissionBtn}
            onPress={requestPermission}
          >
            <Text style={styles.permissionBtnText}>Grant Camera Permission</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.permissionFallbackBtn}
            onPress={() => setSimulationVisible(true)}
          >
            <Text style={styles.permissionFallbackText}>
              Use Interactive Simulator Instead →
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : ({ data }) => handleProcessBarcode(data)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderCameraOrFallback()}

      {/* Camera Dark Vignette Overlay with transparent center */}
      <SafeAreaView style={styles.overlaySafeArea}>
        {/* Top Controls Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.eventPill}>
            <Text style={styles.eventPillLabel}>GATE ENTRANCE</Text>
            <Text style={styles.eventPillTitle} numberOfLines={1}>
              {activeEvent?.name || "Party Verification"}
            </Text>
          </View>

          <View style={styles.topActionsGroup}>
            <TouchableOpacity
              style={[styles.iconCircleBtn, torch && styles.iconCircleBtnActive]}
              onPress={() => setTorch((prev) => !prev)}
            >
              <Ionicons
                name={torch ? "flash" : "flash-off"}
                size={20}
                color={torch ? Colors.accentDark : Colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconCircleBtn}
              onPress={() =>
                setFacing((prev) => (prev === "back" ? "front" : "back"))
              }
            >
              <Ionicons name="camera-reverse-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Center Scanner Reticle */}
        <View style={styles.centerArea}>
          <View style={styles.scanTargetBox}>
            {/* 4 Glowing Gold / White Corner brackets */}
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />

            {/* Animated Laser Bar */}
            <Animated.View
              style={[
                styles.laserLine,
                {
                  transform: [{ translateY }],
                },
              ]}
            />
          </View>

          <Text style={styles.scanInstruction}>
            Align guest QR code inside the frame
          </Text>
        </View>

        {/* Bottom Bar & Simulator Tray */}
        <View style={styles.bottomBar}>
          <View style={styles.simulationDrawer}>
            <View style={styles.simHeaderRow}>
              <Ionicons name="flask-outline" size={16} color={Colors.accent} />
              <Text style={styles.simDrawerTitle}>TEST SCANNER SCENARIOS:</Text>
            </View>

            <View style={styles.simButtonsRow}>
              <TouchableOpacity
                style={[styles.simBtn, styles.simBtnValid]}
                onPress={() => handleSimulateScan("valid")}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                <Text style={styles.simBtnText}>Valid [✓]</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.simBtn, styles.simBtnWarning]}
                onPress={() => handleSimulateScan("duplicate")}
                activeOpacity={0.8}
              >
                <Ionicons name="warning" size={14} color={Colors.warning} />
                <Text style={styles.simBtnText}>Used [⚠]</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.simBtn, styles.simBtnDanger]}
                onPress={() => handleSimulateScan("invalid")}
                activeOpacity={0.8}
              >
                <Ionicons name="close-circle" size={14} color={Colors.danger} />
                <Text style={styles.simBtnText}>Invalid [✕]</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Verification Result Modal (Valid, Already Used, Invalid) */}
      <ScanResultCard
        result={scanResult}
        visible={modalVisible}
        onDismiss={handleDismissModal}
        onScanNext={handleScanNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  cameraPlaceholder: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#0B1120",
  },
  permissionCard: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    zIndex: 5,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.white,
    marginTop: 18,
    textAlign: "center",
  },
  permissionSub: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  permissionBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  permissionFallbackBtn: {
    marginTop: 16,
    paddingVertical: 10,
  },
  permissionFallbackText: {
    color: Colors.accentLight,
    fontSize: 13,
    fontWeight: "600",
  },
  overlaySafeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  iconCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  iconCircleBtnActive: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accent,
  },
  topActionsGroup: {
    flexDirection: "row",
    gap: 8,
  },
  eventPill: {
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    maxWidth: 190,
  },
  eventPillLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  eventPillTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.white,
    marginTop: 1,
  },
  centerArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  scanTargetBox: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    position: "relative",
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  corner: {
    position: "absolute",
    width: 32,
    height: 32,
    borderColor: Colors.accent,
  },
  tl: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  tr: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bl: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  br: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  laserLine: {
    width: "100%",
    height: 3,
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    borderRadius: 2,
  },
  scanInstruction: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 24,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  simulationDrawer: {
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  simHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
    justifyContent: "center",
  },
  simDrawerTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  simButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  simBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  simBtnValid: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  simBtnWarning: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderColor: "rgba(245, 158, 11, 0.4)",
  },
  simBtnDanger: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  simBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.white,
  },
});
