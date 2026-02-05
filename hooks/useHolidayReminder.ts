import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * Custom hook for managing Expo Notifications and reminder metadata.
 * Calculates trigger times based on holiday dates and manages local notification IDs.
 */
export const useHolidayReminder = (holidayId: string, name: string) => {
  const [reminderId, setReminderId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const reminderKey = `@reminder_${holidayId}`;
  const bodyKey = `@reminder_body_${holidayId}`;
  const timeKey = `@reminder_time_${holidayId}`;
  const nameKey = `@reminder_name_${holidayId}`;
  const descKey = `@reminder_desc_${holidayId}`;

  useEffect(() => {
    // Sync internal state with persisted notification ID on initialization
    (async () => {
      const saved = await AsyncStorage.getItem(reminderKey);
      if (saved) setReminderId(saved);
    })();
  }, [holidayId]);

  /**
   * Scheduling Logic:
   * 1. Cancels any existing notification for this holiday to avoid overlaps.
   * 2. Calculates the delta in seconds between 'now' and the holiday date.
   * 3. Schedules a TIME_INTERVAL trigger via expo-notifications.
   */
  const scheduleHolidayReminder = async (
    bodyContent: string,
    holidayDesc: string,
  ) => {
    try {
      if (reminderId) {
        await Notifications.cancelScheduledNotificationAsync(reminderId);
      }

      // Parse holidayId (YYYY-MM-DD) to construct target Date object
      const [year, month, day] = holidayId.split("-").map(Number);
      const targetDate = new Date(
        year,
        month - 1,
        day,
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0,
      );

      const secondsUntilHoliday = Math.floor(
        (targetDate.getTime() - Date.now()) / 1000,
      );

      // Validate that the reminder isn't being set for a past date
      if (secondsUntilHoliday <= 0) {
        Alert.alert("Time Error", "The selected time is in the past!");
        return;
      }

      const newId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `📅 ${name} Reminder`,
          body: bodyContent || "Check your plans for today!",
          sound: "default",
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilHoliday,
        },
      });

      const timeString = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Update storage with reminder details for UI display and future management
      await AsyncStorage.multiSet([
        [reminderKey, newId],
        [bodyKey, bodyContent],
        [timeKey, timeString],
        [nameKey, name],
        [descKey, holidayDesc],
      ]);

      setReminderId(newId);
      setShowPicker(false);
      Alert.alert("Reminder Set", `Notification scheduled for ${timeString}`);
    } catch (e: any) {
      Alert.alert("Error", "Could not schedule reminder.");
    }
  };

  /**
   * Teardown Logic: Cancels the scheduled notification and purges
   * all related metadata from AsyncStorage.
   */
  const deleteReminder = async () => {
    if (reminderId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(reminderId);
        await AsyncStorage.multiRemove([
          reminderKey,
          bodyKey,
          timeKey,
          nameKey,
          descKey,
        ]);
        setReminderId(null);
        Alert.alert("Removed", "Reminder deleted.");
      } catch (e) {
        console.error("[Delete Error]", e);
      }
    }
  };

  return {
    reminderId,
    selectedTime,
    setSelectedTime,
    showPicker,
    setShowPicker,
    scheduleHolidayReminder,
    deleteReminder,
  };
};
