import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useHolidayNotes = (holidayId: string) => {
  // Initialize as an empty array instead of a string
  const [notes, setNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const storageKey = `@note_${holidayId}`;

  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      try {
        const savedData = await AsyncStorage.getItem(storageKey);
        if (savedData !== null) {
          // Parse the JSON string back into a TypeScript array
          setNotes(JSON.parse(savedData));
        } else {
          setNotes([]);
        }
      } catch (e) {
        console.error("Failed to load notes", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [holidayId]);

  /**
   * Saves the entire array of notes to AsyncStorage
   * @param newNotesArray - The updated list of strings
   */
  const saveNotes = async (newNotesArray: string[]) => {
    setIsSaving(true);
    try {
      // Update local state immediately for a snappy UI
      setNotes(newNotesArray);

      // Convert array to string for AsyncStorage
      const jsonValue = JSON.stringify(newNotesArray);
      await AsyncStorage.setItem(storageKey, jsonValue);
    } catch (e) {
      console.error("Failed to save notes", e);
    } finally {
      // Optional: small delay so the 'Saving' state is visible to the user
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  return {
    notes, // The array of strings
    saveNotes, // Function to update the list
    isSaving, // Loading state for the save button
    isLoading, // Loading state for initial fetch
  };
};
