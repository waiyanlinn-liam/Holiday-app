import { GlassCard } from "@/components/GlassCard";
import { HOLIDAYS_2026 } from "@/constants/HolidayCard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * CultureScreen:
 * A specialized horizontal carousel showcasing Myanmar's cultural public holidays for 2026.
 * It uses paging logic to provide a focused "One Card at a Time" user experience.
 */
export default function CultureScreen() {
  // Maps holiday names to descriptive 'vibe' suffixes
  const getVibeSuffix = (name: string) => {
    if (name.includes("Thingyan")) return "of water & joy";
    if (name.includes("New Year")) return "of fresh potential";
    if (name.includes("Thadingyut") || name.includes("Tazaungmone"))
      return "of light & magic";
  };

  return (
    <View style={styles.screen}>
      {/* --- Page Header --- */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>2026</Text>
        <View style={styles.subHeaderRow}>
          <Text style={styles.subHeader}>MYANMAR PUBLIC HOLIDAYS</Text>
        </View>
      </View>

      {/* --- Horizontal Carousel Section --- 
          snapToInterval: Locks the scroll to the width of the cards + margin.
      */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={SCREEN_WIDTH * 0.85} // Matches card width + horizontal spacing
        decelerationRate="fast"
        contentContainerStyle={styles.horizontalContainer}
      >
        {HOLIDAYS_2026.map((item, index) => (
          <View key={index} style={styles.cardWrapper}>
            {/* Temporal Marker (The Month) */}
            <View style={styles.monthLabelContainer}>
              <Text style={styles.monthLabel}>{item.month}</Text>
            </View>

            {/* Cultural Information Card */}
            <GlassCard style={styles.horizontalCard}>
              <View>
                <View style={styles.cardHeader}>
                  {/* Dynamic Color Palette based on Holiday Type */}
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

              {/* --- Data Visualization Footer --- */}
              <View>
                <View style={styles.divider} />
                <View style={styles.footerRow}>
                  <View>
                    <Text style={styles.metaTitle}>HOLIDAY VIBE</Text>
                    {/* Spirit Rating: Visualizes holiday duration/intensity using icons */}
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

                  {/* Duration Badge */}
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

                {/* Contextual Vibe Text */}
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
    width: SCREEN_WIDTH * 0.8, // 🔒 lock width
    padding: 30,
    borderRadius: 45,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    alignSelf: "stretch",
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
