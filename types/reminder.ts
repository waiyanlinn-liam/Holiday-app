// types/reminder.ts

export interface ReminderItem {
  holidayId: string;
  body: string;
  type: "reminder";
  scheduledTime: string;
  name: string;
  description: string;
}

export interface NoteItem {
  holidayId: string;
  items: string[];
  type: "note";
  name: string;
  description: string;
}

export type ListItem = ReminderItem | NoteItem;
