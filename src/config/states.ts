
export const states = [
  { id: "off", name: "Off" },
  { id: "confused", name: "Confused" },
  { id: "hurt", name: "Hurt" },
  { id: "uncomfortable", name: "Uncomfortable" },
  { id: "irritated", name: "Irritated" },
  { id: "anxious", name: "Anxious" },
  { id: "overwhelmed", name: "Overwhelmed" },
  { id: "sad", name: "Sad" },
] as const;

export type State = (typeof states)[number]['id'];
