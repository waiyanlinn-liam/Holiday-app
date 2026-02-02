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
    holidayData.response.holidays.forEach((holiday) => {
      marks[holiday.date.iso] = {
        selected: true,
        selectedColor: "rgba(255, 215, 0, 0.8)", // Semi-solid Gold
        selectedTextColor: "#000000",
        marked: true,
        dotColor: "#FF3B30",
      };
    });
    return marks;
  }, []);

  return (
    <View style={styles.container}>
      <GlassCard style={styles.glassAdjust}>
        <Calendar
          // Ensures the 5th and 6th rows aren't hidden by the library
          hideExtraDays={false}
          enableSwipeMonths={true}
          theme={{
            calendarBackground: "transparent",

            // 1. HEADER - Use a strong blue to stand out against the white blur
            monthTextColor: "#007AFF",
            textMonthFontWeight: "800",
            textMonthFontSize: 18,
            textSectionTitleColor: "#0056b3", // Days of week (S, M, T...)
            arrowColor: "#007AFF",

            // 2. NORMAL DATES - Switch to a dark grey/charcoal.
            // Pure white is invisible on your GlassCard.
            dayTextColor: "#2C3E50",
            textDayFontWeight: "600",

            // 3. THE "MISSING" DATES FIX (27, 28, 29...)
            // These are often 'disabled' (next month). We make them darker grey.
            textDisabledColor: "rgba(0, 0, 0, 0.25)",

            // 4. TODAY - A bright red to pop out
            todayTextColor: "#FF3B30",
          }}
          markedDates={useMemo(() => {
            const marks: any = {};
            holidayData.response.holidays.forEach((holiday) => {
              marks[holiday.date.iso] = {
                selected: true,
                // Use a solid, dark, or very vibrant color for the holiday circle
                selectedColor: "#FFD700", // Gold
                selectedTextColor: "#000000", // Black text on the gold circle
                marked: true,
                dotColor: "#FF3B30",
              };
            });
            return marks;
          }, [])}
          onDayPress={(day) => {
            // 1. Try to find if the clicked day is a holiday
            const selectedHoliday = holidayData.response.holidays.find(
              (h) => h.date.iso === day.dateString,
            );

            if (selectedHoliday) {
              // 🔥 FIX: Use the SAME combined ID format as your Home Page
              const combinedId = `${selectedHoliday.date.iso}|${selectedHoliday.urlid}`;

              router.push({
                pathname: "/details/[id]",
                params: {
                  id: encodeURIComponent(combinedId), // This makes the ID match Home Page!
                  name: selectedHoliday.name,
                  desc: selectedHoliday.description,
                },
              });
            } else {
              // For normal days, we use the dateString as the ID
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
    // REMOVE fixed heights here. Let the calendar define the height
    // to prevent cutting off the 30th/31st.
    borderRadius: 20,
  },
  calendarInternal: {
    // Force the internal calendar to not have a background
    backgroundColor: "transparent",
    borderRadius: 15,
    // Add a bit of bottom padding so the last row isn't hugging the edge
    paddingBottom: 10,
  },
});
