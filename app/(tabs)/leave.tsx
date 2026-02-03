import { GlassCard } from "@/components/GlassCard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Expanded 2026 Holiday Data
const HOLIDAYS_2026 = [
  {
    name: "New Year Break",
    dates: "Jan 1 - Jan 4",
    days: 4,
    icon: "sparkles",
    color: "#FF9500",
  },
  {
    name: "Union Day",
    dates: "Feb 12",
    days: 1,
    icon: "people",
    color: "#FF3B30",
  },
  {
    name: "Peasants' Day",
    dates: "Mar 2",
    days: 1,
    icon: "leaf",
    color: "#4CD964",
  },
  {
    name: "Thingyan Festival",
    dates: "Apr 11 - Apr 19",
    days: 9,
    icon: "water",
    color: "#007AFF",
  },
  {
    name: "May Day",
    dates: "May 1",
    days: 1,
    icon: "hammer",
    color: "#5856D6",
  },
  {
    name: "Full Moon of Kason",
    dates: "May 31",
    days: 1,
    icon: "moon",
    color: "#FFCC00",
  },
  {
    name: "Martyrs' Day",
    dates: "July 19",
    days: 1,
    icon: "ribbon",
    color: "#8E8E93",
  },
  {
    name: "Thadingyut Break",
    dates: "Oct 24 - Oct 26",
    days: 3,
    icon: "sunny",
    color: "#FF2D55",
  },
  {
    name: "Tazaungdaing",
    dates: "Nov 23 - Nov 24",
    days: 2,
    icon: "flame",
    color: "#AF52DE",
  },
  {
    name: "National Day",
    dates: "Dec 4",
    days: 1,
    icon: "flag",
    color: "#00C7BE",
  },
  {
    name: "Christmas Day",
    dates: "Dec 25",
    days: 1,
    icon: "gift",
    color: "#FF3B30",
  },
];

export default function LeaveScreen() {
  const handleSetReminder = (holidayName: string) => {
    // Logic for app/reminder.tsx will go here
    Alert.alert(
      "Reminder Set",
      `We'll remind you to book leaves for ${holidayName}!`,
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>2026 Leave Planner</Text>
        <Text style={styles.subHeader}>Maximize your time off</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={SCREEN_WIDTH * 0.85}
        decelerationRate="fast"
        contentContainerStyle={styles.horizontalContainer}
      >
        {HOLIDAYS_2026.map((item, index) => (
          <GlassCard key={index} style={styles.horizontalCard}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: item.color + "20" },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={30}
                  color={item.color}
                />
              </View>
              <View style={[styles.badge, { backgroundColor: item.color }]}>
                <Text style={styles.badgeText}>
                  {item.days} {item.days > 1 ? "Days" : "Day"}
                </Text>
              </View>
            </View>

            <View>
              <Text style={styles.holidayName}>{item.name}</Text>
              <Text style={styles.dates}>{item.dates}</Text>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.reminderBtn, { borderColor: item.color }]}
              onPress={() => handleSetReminder(item.name)}
            >
              <Ionicons
                name="notifications-outline"
                size={18}
                color={item.color}
              />
              <Text style={[styles.reminderText, { color: item.color }]}>
                Set Reminder
              </Text>
            </TouchableOpacity>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  screen: { flex: 1 },
  headerContainer: {
    marginTop: 80,
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1a1a1a",
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  horizontalContainer: {
    paddingLeft: 25,
    paddingRight: 50,
    alignItems: "center",
    paddingBottom: 40,
  },
  horizontalCard: {
    width: SCREEN_WIDTH * 0.8,
    height: 380,
    marginRight: 20,
    padding: 25,
    borderRadius: 32,
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    // Shadow for iOS/Android depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  holidayName: { fontSize: 26, fontWeight: "800", color: "#1a1a1a" },
  dates: { fontSize: 18, opacity: 0.6, marginTop: 5, color: "#444" },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: 15,
  },
  reminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  reminderText: {
    marginLeft: 8,
    fontWeight: "700",
    fontSize: 14,
  },
  badge: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  badgeText: { color: "#fff", fontWeight: "bold" },
});
