import { Alert, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "@/store/authStore";

import styles from "@/assets/styles/profile.styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "@/constants/colors";

export default function LogoutButton() {
  const { logout } = useAuthStore();

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(), style: "destructive" },
    ]);
  };
  return (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={confirmLogout}
      activeOpacity={0.7}
    >
      <Ionicons size={20} color={COLORS.white} name="log-out-outline" />
      <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>
  );
}
