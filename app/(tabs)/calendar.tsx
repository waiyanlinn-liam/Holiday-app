import holidayData from "@/assets/holidays.json";
import { GlassCard } from "@/components/GlassCard";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";

const { width } = Dimensions.get("window");

export default function RemindScreen() {
  const markedDates = useMemo(() => {
    const marks: any = {};

    // 1. Mark Holidays (Gold)
    holidayData.response.holidays.forEach((holiday) => {
      marks[holiday.date.iso] = {
        selected: true,
        selectedColor: "#FFD700", // Gold
        selectedTextColor: "#000000",
        marked: true,
        dotColor: "#FF3B30",
      };
    });

    // 2. Mark Today (Blue Circle)
    const today = new Date().toISOString().split("T")[0];

    // If today is ALSO a holiday, you might want to decide which color wins.
    // Here, we let the Blue Today circle override or merge:
    marks[today] = {
      ...marks[today], // Keep the holiday dot if it exists
      selected: true,
      selectedColor: "#007AFF", // Bright Blue circle
      selectedTextColor: "#FFFFFF",
    };

    return marks;
  }, []);

  return (
    <View style={styles.container}>
      <GlassCard style={styles.glassAdjust}>
        <Calendar
          hideExtraDays={false}
          enableSwipeMonths={true}
          // Pass the memoized marks here
          markedDates={markedDates}
          theme={{
            calendarBackground: "transparent",
            monthTextColor: "#007AFF",
            textMonthFontWeight: "800",
            textMonthFontSize: 18,
            textSectionTitleColor: "#0056b3",
            arrowColor: "#007AFF",
            dayTextColor: "#2C3E50",
            textDayFontWeight: "600",
            textDisabledColor: "rgba(0, 0, 0, 0.25)",
            // We disable the default today text color so our
            // blue "selected" circle is the primary focus
            todayTextColor: "#007AFF",
          }}
          onDayPress={(day) => {
            const selectedHoliday = holidayData.response.holidays.find(
              (h) => h.date.iso === day.dateString,
            );

            if (selectedHoliday) {
              const combinedId = `${selectedHoliday.date.iso}|${selectedHoliday.urlid}`;
              router.push({
                pathname: "/details/[id]",
                params: {
                  id: encodeURIComponent(combinedId),
                  name: selectedHoliday.name,
                  desc: selectedHoliday.description,
                },
              });
            } else {
              router.push({
                pathname: "/details/[id]",
                params: {
                  id: day.dateString,
                  name: `Date: ${day.dateString}`,
                  desc: "There are no national holidays on this day.",
                },
              });
            }
          }}
        />
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
  },
  glassAdjust: {
    width: width * 0.95,
    padding: 10,
    borderRadius: 20,
  },
});
