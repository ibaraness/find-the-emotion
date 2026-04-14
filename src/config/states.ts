// export const states = [
//   {
//     id: "hurt",
//     name: 'Hurt',
//   },
//   {
//     id: "uncomfortable",
//     name: 'Uncomfortable',
//   },
//   {
//     id: "irritated",
//     name: 'Irritated',
//   },
//   {
//     id: "tense",
//     name: 'Tense',
//   },
//   {
//     id: "overwhelmed",
//     name: 'Overwhelmed',
//   },
//   {
//     id: "sad",
//     name: 'Sad',
//   },
//   {
//     id: "anxious",
//     name: 'Anxious',
//   },
//   {
//     id: "off",
//     name: 'Off',
//   },
//   {
//     id: "confused",
//     name: 'Confused',
//   },
// ] as const;

export const states = [
  { id: "off", name: "Off" },
  { id: "confused", name: "Confused" },
  { id: "irritated", name: "Irritated" },
  { id: "anxious", name: "Anxious" },
  { id: "overwhelmed", name: "Overwhelmed" },
  { id: "sad", name: "Sad" },
] as const;

export type State = (typeof states)[number]['id'];
