import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChatScreen } from "../components/ChatScreen";

export default function Index() {
  const handleNavigateToSettings = () => {
    router.push("/settings");
  };

  const handleNavigateToAbout = () => {
    router.push("/about");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokemon AI Chat</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleNavigateToAbout}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNavigateToSettings}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ChatScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
