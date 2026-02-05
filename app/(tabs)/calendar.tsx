import holidayData from "@/assets/holidays.json";
import { GlassCard } from "@/components/GlassCard";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";

const { width } = Dimensions.get("window");

/**
 * Calendar Screen Component:
 * Provides a high-level calendar overview of the year's holidays.
 * Users can tap specific dates to jump to detailed planning views.
 */
export default function CalendarScreen() {
  //Performance Optimization: useMemo
  const markedDates = useMemo(() => {
    const marks: any = {};

    // 1. Data Mapping: Mark Holidays (Gold)
    holidayData.response.holidays.forEach((holiday) => {
      marks[holiday.date.iso] = {
        selected: true,
        selectedColor: "#FFD700", // Aesthetic choice: Gold for celebrations
        selectedTextColor: "#000000",
        marked: true, // Shows the small dot below the number
        dotColor: "#FF3B30", // Red dot to indicate a 'pinned' event
      };
    });

    // 2. Contextual Awareness: Mark Today (Blue Circle)
    // We get the current system date to help the user orient themselves.
    const today = new Date().toISOString().split("T")[0];

    // If today is a holiday, we merge the holiday dot with the "Current Day" blue circle.
    marks[today] = {
      ...marks[today],
      selected: true,
      selectedColor: "#007AFF",
      selectedTextColor: "#FFFFFF",
    };

    return marks;
  }, []);

  return (
    <View style={styles.container}>
      {/* UI Layout: 
         Wrapping the calendar in GlassCard provides a modern, 
         semi-transparent aesthetic consistent with the app's theme.
      */}
      <GlassCard style={styles.glassAdjust}>
        <Calendar
          hideExtraDays={false}
          enableSwipeMonths={true}
          markedDates={markedDates}
          theme={{
            // Theming: Ensuring the calendar looks native to the app
            calendarBackground: "transparent",
            monthTextColor: "#007AFF",
            textMonthFontWeight: "800",
            textMonthFontSize: 18,
            textSectionTitleColor: "#0056b3",
            arrowColor: "#007AFF",
            dayTextColor: "#2C3E50",
            textDayFontWeight: "600",
            textDisabledColor: "rgba(0, 0, 0, 0.25)",
            todayTextColor: "#007AFF",
          }}
          /**
           * Interaction Handler:
           * Checks if a tapped date is a known holiday.
           * Redirects to the detail view with pre-filled holiday info or a blank state.
           */
          onDayPress={(day) => {
            const selectedHoliday = holidayData.response.holidays.find(
              (h) => h.date.iso === day.dateString,
            );

            if (selectedHoliday) {
              // Deep Link to Holiday Details
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
              // Standard Date Navigation (No specific holiday)
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
    width: width * 0.95, // Dynamic width for cross-device compatibility
    padding: 10,
    borderRadius: 20,
  },
});
