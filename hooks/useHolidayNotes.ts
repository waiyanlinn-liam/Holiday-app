import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

/**
 * Custom hook to manage holiday-specific notes using AsyncStorage.
 * Handles state hydration, persistence of note arrays, and metadata
 * (name/description) associated with a specific holiday ID.
 */
export const useHolidayNotes = (holidayId: string) => {
  const [notes, setNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic keys to isolate storage data per holiday
  const storageKey = `@note_${holidayId}`;
  const nameKey = `@note_name_${holidayId}`;
  const descKey = `@note_desc_${holidayId}`;

  useEffect(() => {
    /**
     * Initial Load: Fetches notes from local storage on mount
     * or whenever the holidayId changes.
     */
    const loadNotes = async () => {
      setIsLoading(true);
      try {
        const savedData = await AsyncStorage.getItem(storageKey);
        setNotes(savedData !== null ? JSON.parse(savedData) : []);
      } catch (e) {
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotes();
  }, [holidayId]);

  /**
   * Persistence Layer: Atomically saves notes and holiday metadata.
   * Uses multiSet to ensure data consistency across multiple keys.
   */
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
      // Small delay to prevent UI flickering during rapid save operations
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  return { notes, saveNotes, isSaving, isLoading };
};
