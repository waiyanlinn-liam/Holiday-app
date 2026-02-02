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
      if (saved) setReminderId(saved);
    })();
  }, [holidayId]);

  const scheduleHolidayReminder = async (
    bodyContent: string,
    holidayDesc: string,
  ) => {
    try {
      if (reminderId) {
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

      const secondsUntilHoliday = Math.floor(
        (targetDate.getTime() - Date.now()) / 1000,
      );

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

      // Save all keys including metadata
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
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not schedule reminder.");
    }
  };

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
        console.error(e);
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
