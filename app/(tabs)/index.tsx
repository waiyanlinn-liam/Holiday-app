import holidayData from "@/assets/holidays.json";
import { GlassCard } from "@/components/GlassCard";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function HolidayList() {
  const upcomingHolidays = useMemo(() => {
    const today = new Date();
    // Filter and sort by date
    return holidayData.response.holidays
      .filter((h) => new Date(h.date.iso) >= today)
      .sort(
        (a, b) =>
          new Date(a.date.iso).getTime() - new Date(b.date.iso).getTime(),
      );
  }, []);

  const router = useRouter();

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isHero = index === 0;

    const handlePress = () => {
      // We encode the urlid because it contains a "/"

      const encodedId = encodeURIComponent(item.urlid);

      console.log("Navigating to details for ID:", encodedId);

      router.push({
        pathname: "/details/[id]",

        params: {
          id: encodedId,

          name: item.name, // You can pass extra data as params to avoid re-fetching

          desc: item.description,
        },
      });
    };

    return (
      <GlassCard
        style={[styles.card, isHero && styles.heroCard]}
        isInteractive={true}
        hero={isHero} // NEW
        onPress={handlePress}
      >
        {isHero && (
          <View style={styles.nextBadge}>
            <Text style={styles.badgeText}>UPCOMING NEXT</Text>
          </View>
        )}

        <View style={styles.row}>
          <View style={styles.dateBox}>
            <Text style={styles.day}>{new Date(item.date.iso).getDate()}</Text>
            <Text style={styles.month}>
              {new Date(item.date.iso)
                .toLocaleString("en-US", { month: "short" })
                .toUpperCase()}
            </Text>
          </View>

          <View style={styles.contentBox}>
            <Text style={[styles.name, isHero && styles.heroName]}>
              {item.name}
            </Text>
            <Text style={styles.type}>{item.type[0]}</Text>
          </View>
        </View>

        {isHero && (
          <Text style={styles.desc} numberOfLines={3}>
            {item.description ||
              "Prepare for the festivities! This is a national public holiday in Myanmar."}
          </Text>
        )}
      </GlassCard>
    );
  };

  return (
    <FlatList
      data={upcomingHolidays}
      keyExtractor={(item) => item.urlid + item.date.iso}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 120, // Starts below the status bar mask
    paddingBottom: 160, // Ends above the tab bar mask
  },
  card: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 24,
  },
  heroCard: {
    backgroundColor: "rgba(255, 255, 255, 0.4)", // Brighter for the hero item
    borderWidth: 1.5,
    borderColor: "#007AFF",
  },
  nextBadge: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.05)",
  },
  day: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1B",
  },
  month: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
  },
  contentBox: {
    paddingLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1B",
  },
  heroName: {
    fontSize: 22,
  },
  type: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  desc: {
    marginTop: 15,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    fontStyle: "italic",
  },
});
