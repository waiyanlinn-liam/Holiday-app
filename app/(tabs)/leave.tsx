import { GlassCard } from "@/components/GlassCard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Mapped from your JSON data
const HOLIDAYS_2026 = [
  {
    month: "JANUARY",
    name: "New Year Break",
    dates: "Jan 1 - 4",
    days: 4,
    icon: "sparkles",
    color: "#FF9F0A",
    vibe: "FRESH STARTS",
    spiritIcon: "rocket",
  },
  {
    month: "FEBRUARY",
    name: "Union Day",
    dates: "Feb 12 - 13",
    days: 2,
    icon: "people",
    color: "#FF453A",
    vibe: "UNITY & PRIDE",
    spiritIcon: "heart",
  },
  {
    month: "FEBRUARY",
    name: "Chinese New Year",
    dates: "Feb 16 - 17",
    days: 2,
    icon: "moon-outline",
    color: "#FF375F",
    vibe: "LUNAR CELEBRATION",
    spiritIcon: "star",
  },
  {
    month: "MARCH",
    name: "Peasants' Day",
    dates: "Mar 2",
    days: 1,
    icon: "leaf",
    color: "#32D74B",
    vibe: "HARVEST ENERGY",
    spiritIcon: "leaf",
  },
  {
    month: "MARCH",
    name: "Armed Forces' Day",
    dates: "Mar 27",
    days: 1,
    icon: "shield-checkmark",
    color: "#8E8E93",
    vibe: "HONOR & DUTY",
    spiritIcon: "medal",
  },
  {
    month: "APRIL",
    name: "Thingyan Festival",
    dates: "Apr 11 - 19",
    days: 9,
    icon: "water",
    color: "#007AFF",
    vibe: "PURE CELEBRATION",
    spiritIcon: "rainy",
  },
  {
    month: "APRIL",
    name: "Full Moon Kasong",
    dates: "Apr 30",
    days: 1,
    icon: "sunny",
    color: "#FFD60A",
    vibe: "SPIRITUAL LIGHT",
    spiritIcon: "flower",
  },
  {
    month: "MAY",
    name: "Labor Day",
    dates: "May 1",
    days: 1,
    icon: "hammer",
    color: "#FF9F0A",
    vibe: "WORKER'S PRIDE",
    spiritIcon: "construct",
  },
  {
    month: "JULY",
    name: "Martyrs' Day",
    dates: "July 19",
    days: 1,
    icon: "ribbon",
    color: "#FF453A",
    vibe: "REMEMBRANCE",
    spiritIcon: "flag",
  },
  {
    month: "JULY",
    name: "Full Moon Waso",
    dates: "July 29",
    days: 1,
    icon: "book",
    color: "#AF52DE",
    vibe: "BUDDHIST LENT",
    spiritIcon: "infinite",
  },
  {
    month: "OCTOBER",
    name: "Thadingyut",
    dates: "Oct 25 - 27",
    days: 3,
    icon: "flame",
    color: "#FF375F",
    vibe: "LIGHT FESTIVAL",
    spiritIcon: "moon",
  },
  {
    month: "NOVEMBER",
    name: "Tazaungmone",
    dates: "Nov 23 - 24",
    days: 2,
    icon: "balloon",
    color: "#BF5AF2",
    vibe: "BALLOON MAGIC",
    spiritIcon: "star",
  },
  {
    month: "DECEMBER",
    name: "National Day",
    dates: "Dec 4",
    days: 1,
    icon: "flag",
    color: "#007AFF",
    vibe: "NATIONAL UNITY",
    spiritIcon: "people",
  },
  {
    month: "DECEMBER",
    name: "Christmas Day",
    dates: "Dec 25",
    days: 1,
    icon: "gift",
    color: "#FF453A",
    vibe: "JOY & GIVING",
    spiritIcon: "gift",
  },
];

export default function CultureScreen() {
  const getVibeSuffix = (name: string) => {
    if (name.includes("Thingyan")) return "of water & joy";
    if (name.includes("New Year")) return "of fresh potential";
    if (name.includes("Thadingyut") || name.includes("Tazaungmone"))
      return "of light & magic";
    if (name.includes("Full Moon")) return "of spiritual reflection";
    return "of cultural discovery";
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>2026</Text>
        <View style={styles.subHeaderRow}>
          <Text style={styles.subHeader}>MYANMAR PUBLIC HOLIDAYS</Text>
        </View>
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
          <View key={index} style={styles.cardWrapper}>
            <View style={styles.monthLabelContainer}>
              <Text style={styles.monthLabel}>{item.month}</Text>
            </View>

            <GlassCard style={styles.horizontalCard}>
              <View>
                <View style={styles.cardHeader}>
                  <View
                    style={[styles.iconCircle, { backgroundColor: item.color }]}
                  >
                    <Ionicons name={item.icon as any} size={28} color="#FFF" />
                  </View>
                  <View style={[styles.vibeBadge, { borderColor: item.color }]}>
                    <Text style={[styles.vibeText, { color: item.color }]}>
                      {item.vibe}
                    </Text>
                  </View>
                </View>

                <Text style={styles.holidayName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.dates}>{item.dates}</Text>
              </View>

              <View>
                <View style={styles.divider} />
                <View style={styles.footerRow}>
                  <View>
                    <Text style={styles.metaTitle}>HOLIDAY VIBE</Text>
                    <View style={styles.spiritContainer}>
                      {[1, 2, 3, 4, 5].map((step) => (
                        <Ionicons
                          key={step}
                          name={item.spiritIcon as any}
                          size={20}
                          color={
                            step <= (item.days > 2 ? 5 : 3)
                              ? item.color
                              : "#C7C7CC"
                          }
                        />
                      ))}
                    </View>
                  </View>
                  <View
                    style={[
                      styles.daysCircle,
                      { borderColor: item.color + "40" },
                    ]}
                  >
                    <Text style={styles.daysNumber}>{item.days}</Text>
                    <Text style={styles.daysText}>DAYS</Text>
                  </View>
                </View>
                <Text style={[styles.durationNote, { color: item.color }]}>
                  {getVibeSuffix(item.name)}
                </Text>
              </View>
            </GlassCard>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  headerContainer: { marginTop: 80, paddingHorizontal: 30, marginBottom: 60 },
  header: {
    fontSize: 52,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 52,
    letterSpacing: -2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
  },
  accentLine: {
    width: 40,
    height: 4,
    backgroundColor: "#FF9F0A",
    borderRadius: 2,
  },
  subHeader: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  horizontalContainer: {
    paddingLeft: 25,
    paddingRight: 50,
    paddingTop: 40,
    paddingBottom: 60,
  },
  cardWrapper: {
    alignItems: "center",
    marginRight: 20,
    width: SCREEN_WIDTH * 0.8,
  },
  monthLabelContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  monthLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 3,
  },
  horizontalCard: {
    width: "100%",
    padding: 30,
    borderRadius: 45,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  vibeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  vibeText: { fontSize: 10, fontWeight: "900" },
  holidayName: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1C1C1E",
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  dates: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3A3A3C",
    marginTop: 8,
  },
  divider: { height: 1, backgroundColor: "#D1D1D6", marginBottom: 20 },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8E8E93",
    marginBottom: 8,
    letterSpacing: 1,
  },
  spiritContainer: { flexDirection: "row", gap: 6 },
  daysCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  daysNumber: { color: "#1C1C1E", fontSize: 22, fontWeight: "900" },
  daysText: { color: "#8E8E93", fontSize: 9, fontWeight: "900" },
  durationNote: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 15,
    fontStyle: "italic",
  },
});
