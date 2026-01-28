import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useHolidayReminder = (holidayId: string, name: string) => {
  const [reminderId, setReminderId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const reminderKey = `@reminder_${holidayId}`;

  useEffect(() => {
    (async () => {
      console.log(`[Init] Checking storage for key: ${reminderKey}`);
      const saved = await AsyncStorage.getItem(reminderKey);
      if (saved) {
        console.log(`[Init] Found existing reminder ID: ${saved}`);
        setReminderId(saved);
      } else {
        console.log(`[Init] No reminder found for this holiday.`);
      }
    })();
  }, [holidayId]);

  const scheduleHolidayReminder = async (bodyContent: string) => {
    console.log(`[Schedule] Starting schedule process for: ${name}`);

    try {
      // 1. Handle existing notification cleanup
      if (reminderId) {
        console.log(
          `[Update] Cancelling previous notification ID: ${reminderId}`,
        );
        await Notifications.cancelScheduledNotificationAsync(reminderId);
        console.log(`[Update] Previous notification cancelled.`);
      }

      // 2. Calculate Target Date
      const [year, month, day] = holidayId.split("-").map(Number);
      const targetDate = new Date(
        year,
        month - 1,
        day,
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0,
      );

      console.log(`[Logic] Target Notification Date: ${targetDate.toString()}`);

      // 3. Calculate Seconds from NOW
      const secondsUntilHoliday = Math.floor(
        (targetDate.getTime() - Date.now()) / 1000,
      );

      console.log(`[Logic] Current Time: ${new Date().toString()}`);
      console.log(`[Logic] Seconds until trigger: ${secondsUntilHoliday}`);

      if (secondsUntilHoliday <= 0) {
        console.warn(
          `[Error] Calculated seconds is negative: ${secondsUntilHoliday}`,
        );
        Alert.alert("Time Error", "The selected time is in the past!");
        return;
      }

      // 4. Schedule Notification
      console.log(`[Expo] Calling scheduleNotificationAsync...`);
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

      console.log(`[Expo] Successfully scheduled. New ID: ${newId}`);

      // 5. Update AsyncStorage
      console.log(`[Storage] Saving new ID to ${reminderKey}`);
      await AsyncStorage.setItem(reminderKey, newId);

      // Save body text separately if you're using it in your list
      await AsyncStorage.setItem(`@reminder_body_${holidayId}`, bodyContent);

      setReminderId(newId);
      setShowPicker(false);

      console.log(`[Success] Process complete.`);
      Alert.alert("Reminder Set", "Notification scheduled successfully!");
    } catch (e) {
      console.error(`[Fatal Error]`, e);
      Alert.alert("Error", "Could not schedule reminder.");
    }
  };

  const deleteReminder = async () => {
    console.log(`[Delete] Attempting to delete: ${reminderId}`);
    if (reminderId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(reminderId);
        console.log(`[Delete] Expo notification cancelled.`);

        await AsyncStorage.removeItem(reminderKey);
        await AsyncStorage.removeItem(`@reminder_body_${holidayId}`);
        console.log(`[Delete] Storage keys removed.`);

        setReminderId(null);
        Alert.alert("Removed", "Reminder deleted.");
      } catch (e) {
        console.error(`[Delete Error]`, e);
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
