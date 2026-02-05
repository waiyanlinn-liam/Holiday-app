import holidayData from "@/assets/holidays.json";
import { GlassCard } from "@/components/GlassCard";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";

interface Holiday {
  name: string;
  description: string;
  date: { iso: string };
  type: string[];
  urlid: string;
}

interface HolidaySection {
  title: string;
  monthYear: string;
  data: Holiday[];
  holidayCount: number;
}

/**
 * HolidayList Component:
 * The primary entry point for browsing upcoming events.
 * Features a high-performance SectionList with hero-item highlighting.
 */
export default function HolidayList() {
  const router = useRouter();

  // Data Processing Pipeline:Filters out past events, Sorts by date,  Groups by "YYYY-MM
  const holidaySections = useMemo(() => {
    const today = new Date();

    const upcoming = holidayData.response.holidays
      .filter((h) => new Date(h.date.iso) >= today)
      .sort(
        (a, b) =>
          new Date(a.date.iso).getTime() - new Date(b.date.iso).getTime(),
      );

    const grouped: { [key: string]: Holiday[] } = {};
    upcoming.forEach((holiday) => {
      const date = new Date(holiday.date.iso);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!grouped[monthYear]) grouped[monthYear] = [];
      grouped[monthYear].push(holiday);
    });

    return Object.keys(grouped)
      .sort()
      .map((key) => {
        const [year, month] = key.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return {
          title: date.toLocaleString("en-US", { month: "long" }),
          monthYear: year,
          data: grouped[key],
          holidayCount: grouped[key].length,
        };
      });
  }, []);

  /**
   * Section Header Renderer:
   * Provides contextual grouping (Month/Year) and a summary count of events.
   */
  const renderSectionHeader = ({ section }: { section: HolidaySection }) => (
    <View style={styles.sectionHeaderContainer}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.sectionMonth}>{section.title}</Text>
          <View style={styles.yearBadge}>
            <Text style={styles.sectionYear}>{section.monthYear}</Text>
          </View>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{section.holidayCount} Events</Text>
        </View>
      </View>
    </View>
  );

  /**
   * Item Renderer:
   * Implements "Hero" logic for the single most imminent holiday.
   * Encapsulates navigation logic and date formatting.
   */
  const renderItem = ({
    item,
    section,
    index,
  }: {
    item: Holiday;
    section: HolidaySection;
    index: number;
  }) => {
    // isHero: True only for the very first item in the upcoming section list
    const isHero = section === holidaySections[0] && index === 0;
    const dateObj = new Date(item.date.iso);

    // Composite ID used for deep-linking and state isolation in detail views
    const combinedId = `${item.date.iso}|${item.urlid}`;

    const handlePress = () => {
      router.push({
        pathname: "/details/[id]",
        params: {
          id: encodeURIComponent(combinedId),
          name: item.name,
          desc: item.description,
        },
      });
    };

    return (
      <GlassCard
        style={[styles.card, isHero && styles.heroCard]}
        isInteractive={true}
        onPress={handlePress}
      >
        <View style={styles.cardLayout}>
          {/* Calendar-style Date Indicator */}
          <View style={[styles.datePill, isHero && styles.heroDatePill]}>
            <Text style={[styles.dayText, isHero && styles.heroDayText]}>
              {dateObj.getDate()}
            </Text>
            <Text style={[styles.monthText, isHero && styles.heroMonthText]}>
              {dateObj
                .toLocaleString("en-US", { month: "short" })
                .toUpperCase()}
            </Text>
          </View>

          {/* Holiday Information Content */}
          <View style={styles.infoContent}>
            {isHero && (
              <Text style={styles.upNextLabel}>UPCOMING CELEBRATION</Text>
            )}
            <Text
              style={[styles.holidayName, isHero && styles.heroName]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Text style={[styles.typeText, isHero && styles.heroTypeText]}>
              {item.type[0]}
            </Text>
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <SectionList
      sections={holidaySections}
      keyExtractor={(item, index) => item.urlid + index}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={false} // Maintains glass effect visibility during scroll
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 150,
  },
  sectionHeaderContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionMonth: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  yearBadge: {
    backgroundColor: "rgb(48, 100, 255)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: -4,
  },
  sectionYear: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFF",
  },
  countBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  countText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFF",
  },
  card: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 24,
  },
  heroCard: {
    borderWidth: 1.5,
  },
  cardLayout: {
    flexDirection: "row",
    alignItems: "center",
  },
  datePill: {
    width: 60,
    height: 70,
    backgroundColor: "#FFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  heroDatePill: {
    backgroundColor: "#007AFF",
  },
  dayText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1c1c1e",
  },
  heroDayText: { color: "#FFF" },
  monthText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8e8e93",
  },
  heroMonthText: { color: "rgba(255,255,255,0.8)" },
  infoContent: {
    flex: 1,
    paddingLeft: 20,
  },
  upNextLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#007AFF",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  holidayName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1c1c1e",
  },
  heroName: {
    fontSize: 24,
    color: "#000",
  },
  typeText: {
    fontSize: 13,
    color: "#636366",
    marginTop: 4,
  },
  heroTypeText: {
    color: "#636366",
    fontWeight: "600",
  },
  heroDesc: {
    marginTop: 15,
    fontSize: 15,
    color: "#3a3a3c",
    lineHeight: 22,
  },
});
