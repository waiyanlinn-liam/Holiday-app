import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// Change this line: remove name and desc from the arguments here
export const useHolidayNotes = (holidayId: string) => {
  const [notes, setNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const storageKey = `@note_${holidayId}`;
  const nameKey = `@note_name_${holidayId}`;
  const descKey = `@note_desc_${holidayId}`;

  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      try {
        const savedData = await AsyncStorage.getItem(storageKey);
        if (savedData !== null) {
          setNotes(JSON.parse(savedData));
        } else {
          setNotes([]);
        }
      } catch (e) {
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotes();
  }, [holidayId]);

  // Keep the 3 arguments HERE, in the save function
  const saveNotes = async (
    newNotesArray: string[],
    holidayName: string,
    holidayDesc: string,
  ) => {
    setIsSaving(true);
    try {
      setNotes(newNotesArray);
      await AsyncStorage.multiSet([
        [storageKey, JSON.stringify(newNotesArray)],
        [nameKey, holidayName],
        [descKey, holidayDesc],
      ]);
    } catch (e) {
      console.error("Failed to save notes", e);
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  return { notes, saveNotes, isSaving, isLoading };
};
