export const emotions = [
  {
    id: "anger",
    name: 'Anger',
  },
  {
    id: "frustration",
    
    name: 'Frustration',
  },
  {
    id: "sadness",
    name: 'Sadness',
  },
  {
    id: "disappointment",
    name: 'Disappointment',
  },
  {
    id: "confusion",
    name: 'Confusion',
  },
  {
    id: "fear",
    name: 'Fear',
  },
  {
    id: "anxiety",
    name: 'Anxiety',
  },
  {
    id: "irritation",
    name: 'Irritation',
  },
  {
    id: "guilt",
    name: 'Guilt',
  },
  {
    id: "shame",
    name: 'Shame',
  },
  {
    id: "insecurity",
    name: 'Insecurity',
  },
  {
    id: "uncertainty",
    name: 'Uncertainty',
  },
  {
    id: "powerlessness",
    name: 'Powerlessness',
  },
  {
    id: "loneliness",
    name: 'Loneliness',
  },
  {
    id: "embarrassment",
    name: 'Embarrassment',
  },
  {
    id: "numbness",
    name: 'Numbness',
  },
  {
    id: "hopelessness",
    name: 'Hopelessness',
  },
  {
    id: "despair",
    name: 'Despair',
  },
  {
    id: "doubt",
    name: 'Doubt',
  },
  {
    id: "pressure",
    name: 'Pressure',
  },
  {
    id: "stress",
    name: 'Stress',
  },
  {
    id: "betrayal",
    name: 'Betrayal',
  },
  {
    id: "unworthiness",
    name: "Unworthiness",
  },
  {
    id: "envy",
    name: "Envy",
  },
] as const;

export type Emotion = (typeof emotions)[number]['id'];

