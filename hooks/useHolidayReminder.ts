import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

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
    (async () => {
      const saved = await AsyncStorage.getItem(reminderKey);
      if (saved) {
        console.log(
          `[Init] Found existing reminder for ${holidayId}: ${saved}`,
        );
        setReminderId(saved);
      }
    })();
  }, [holidayId]);

  const scheduleHolidayReminder = async (
    bodyContent: string,
    holidayDesc: string,
  ) => {
    console.log("--- Starting Schedule Process ---");
    try {
      if (reminderId) {
        console.log(`[1] Cancelling previous notification: ${reminderId}`);
        await Notifications.cancelScheduledNotificationAsync(reminderId);
      }

      const [year, month, day] = holidayId.split("-").map(Number);
      const targetDate = new Date(
        year,
        month - 1,
        day,
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0,
      );

      console.log(`[2] Target Date Constructed: ${targetDate.toString()}`);

      const secondsUntilHoliday = Math.floor(
        (targetDate.getTime() - Date.now()) / 1000,
      );

      console.log(`[3] Seconds until trigger: ${secondsUntilHoliday}`);

      if (secondsUntilHoliday <= 0) {
        console.error("[Error] Calculated time is in the past.");
        Alert.alert("Time Error", "The selected time is in the past!");
        return;
      }

      console.log("[4] Requesting notification schedule...");
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

      console.log(`[5] Notification scheduled successfully. ID: ${newId}`);

      const timeString = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      console.log("[6] Saving metadata to AsyncStorage...");
      await AsyncStorage.multiSet([
        [reminderKey, newId],
        [bodyKey, bodyContent],
        [timeKey, timeString],
        [nameKey, name],
        [descKey, holidayDesc],
      ]);

      setReminderId(newId);
      setShowPicker(false);
      console.log("--- Schedule Process Complete ---");
      Alert.alert("Reminder Set", `Notification scheduled for ${timeString}`);
    } catch (e) {
      console.error("[Critical Error]", e);
      Alert.alert("Error", "Could not schedule reminder.");
    }
  };

  const deleteReminder = async () => {
    if (reminderId) {
      console.log(`[Delete] Removing reminder: ${reminderId}`);
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
        console.log("[Delete] Cleanup complete.");
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
