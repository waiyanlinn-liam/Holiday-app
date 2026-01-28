import { GlassCard } from "@/components/GlassCard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

export default function LeaveScreen() {
  const headerColor = "#007AFF";
  // These are your 2026 High-Value targets
  const longWeekends = [
    {
      name: "New Year Break",
      dates: "Jan 1 - Jan 4",
      days: 4,
      icon: "sparkles",
    },
    {
      name: "Thingyan Festival",
      dates: "Apr 11 - Apr 19",
      days: 9,
      icon: "water",
    },
    {
      name: "Thadingyut Break",
      dates: "Oct 25 - Oct 27",
      days: 3,
      icon: "sunny",
    },
  ];

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>2026 Leave Planner</Text>

      <ScrollView
        horizontal // <--- THE MAGIC PROP
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={SCREEN_WIDTH * 0.85} // Makes it "click" into place
        decelerationRate="fast"
        contentContainerStyle={styles.horizontalContainer}
      >
        {longWeekends.map((item, index) => (
          <GlassCard key={index} style={styles.horizontalCard}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: headerColor + "20" },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={30}
                  color={headerColor}
                />
              </View>
              <View style={[styles.badge, { backgroundColor: headerColor }]}>
                <Text style={styles.badgeText}>{item.days} Days</Text>
              </View>
            </View>

            <Text style={styles.holidayName}>{item.name}</Text>
            <Text style={styles.dates}>{item.dates}</Text>

            <View style={styles.divider} />

            <View style={styles.tipBox}>
              <Text style={[styles.tip, { color: headerColor }]}>
                💡 Tip: Use this to travel to Bagan or Inle!
              </Text>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    fontSize: 28,
    fontWeight: "900",
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: "absolute",
    top: 100,
    zIndex: 10,
    left: 50,
    color: "#2259ab",
    backgroundColor: "rgba(214, 215, 217, 0.1)",
    borderRadius: 12,
  },

  horizontalContainer: {
    paddingLeft: 25, // Aligns first card with the header
    paddingRight: 50,
    alignItems: "center",
  },
  horizontalCard: {
    width: SCREEN_WIDTH * 0.8, // Fixed width for horizontal feel
    height: 350, // Taller, more "pro" look
    marginRight: 20,
    padding: 25,
    borderRadius: 32,
    justifyContent: "space-between",
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
  holidayName: { fontSize: 24, fontWeight: "800", marginTop: 20 },
  dates: { fontSize: 16, opacity: 0.6, marginTop: 5 },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 20,
  },
  tipBox: {
    backgroundColor: "rgba(0,122,255,0.05)",
    padding: 15,
    borderRadius: 15,
  },
  tip: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  badge: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  badgeText: { color: "#fff", fontWeight: "bold" },
});
