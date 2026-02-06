export type Holiday = {
  month: string;
  name: string;
  dates: string;
  days: number;
  icon: string;
  color: string;
  vibe: string;
  spiritIcon: string;
};

export const HOLIDAYS_2026: Holiday[] = [
  {
    month: "JANUARY",
    name: "New Year Break",
    dates: "Jan 1 - 4",
    days: 4,
    icon: "sparkles",
    color: "#FF9F0A",
    vibe: "FRESH STARTS",
    spiritIcon: "rocket",
  },

  {
    month: "APRIL",
    name: "Thingyan Festival",
    dates: "Apr 11 - 19",
    days: 9,
    icon: "water",
    color: "#007AFF",
    vibe: "PURE CELEBRATION",
    spiritIcon: "rainy",
  },

  {
    month: "OCTOBER",
    name: "Thadingyut",
    dates: "Oct 25 - 27",
    days: 3,
    icon: "flame",
    color: "#FF375F",
    vibe: "LIGHT FESTIVAL",
    spiritIcon: "moon",
  },
];
