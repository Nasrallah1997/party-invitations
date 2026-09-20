import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import Colors from "../constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const getContainerStyle = () => {
    const base: ViewStyle[] = [styles.button];

    if (size === "sm") base.push(styles.sizeSm);
    else if (size === "lg") base.push(styles.sizeLg);
    else base.push(styles.sizeMd);

    switch (variant) {
      case "primary":
        base.push(styles.primary);
        break;
      case "secondary":
        base.push(styles.secondary);
        break;
      case "outline":
        base.push(styles.outline);
        break;
      case "ghost":
        base.push(styles.ghost);
        break;
      case "danger":
        base.push(styles.danger);
        break;
      case "gold":
        base.push(styles.gold);
        break;
    }

    if (disabled) base.push(styles.disabled);
    if (style) base.push(style);

    return base;
  };

  const getTextStyle = () => {
    const base: TextStyle[] = [styles.text];

    if (size === "sm") base.push(styles.textSm);
    else if (size === "lg") base.push(styles.textLg);
    else base.push(styles.textMd);

    switch (variant) {
      case "primary":
        base.push(styles.textPrimary);
        break;
      case "secondary":
        base.push(styles.textSecondary);
        break;
      case "outline":
        base.push(styles.textOutline);
        break;
      case "ghost":
        base.push(styles.textGhost);
        break;
      case "danger":
        base.push(styles.textDanger);
        break;
      case "gold":
        base.push(styles.textGold);
        break;
    }

    if (disabled) base.push(styles.textDisabled);
    if (textStyle) base.push(textStyle);

    return base;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? Colors.primary : Colors.white}
          size="small"
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  sizeMd: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  sizeLg: {
    paddingVertical: 18,
    paddingHorizontal: 26,
    borderRadius: 16,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.cardSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  gold: {
    backgroundColor: Colors.accent,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  textSm: {
    fontSize: 13,
  },
  textMd: {
    fontSize: 15,
  },
  textLg: {
    fontSize: 17,
    fontWeight: "700",
  },
  textPrimary: {
    color: Colors.white,
  },
  textSecondary: {
    color: Colors.text,
  },
  textOutline: {
    color: Colors.primary,
  },
  textGhost: {
    color: Colors.primary,
  },
  textDanger: {
    color: Colors.white,
  },
  textGold: {
    color: Colors.white,
  },
  textDisabled: {
    color: Colors.textLight,
  },
});
