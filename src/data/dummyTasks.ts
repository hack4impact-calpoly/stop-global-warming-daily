export interface Task {
  id: string;
  date: Date;
  title: string;
  category: string;
  description: string;
  minEstimate: number;
  completed: boolean;
}

export const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    date: new Date(2025, 0, 4),
    title: "Sort Recycling Bin",
    category: "Waste Reduction",
    description: "Separate paper, plastic, and glass into the correct recycling bins.",
    minEstimate: 15,
    completed: true,
  },
  {
    id: "2",
    date: new Date(2025, 0, 5),
    title: "Switch to LED Bulbs",
    category: "Energy Saving",
    description: "Replace old bulbs with LEDs.",
    minEstimate: 20,
    completed: false,
  },
  {
    id: "3",
    date: new Date(2025, 0, 6),
    title: "Plan a Meatless Meal",
    category: "Diet",
    description: "Cook one plant-based dinner this week.",
    minEstimate: 20,
    completed: false,
  },
  {
    id: "4",
    date: new Date(2025, 0, 7),
    title: "Take Public Transit",
    category: "Transport",
    description: "Use the bus or train instead of driving for one commute today.",
    minEstimate: 10,
    completed: false,
  },
  {
    id: "5",
    date: new Date(2025, 0, 8),
    title: "Unplug Idle Electronics",
    category: "Energy Saving",
    description: "Unplug chargers and devices that are not currently in use.",
    minEstimate: 10,
    completed: false,
  },
  {
    id: "6",
    date: new Date(2025, 0, 9),
    title: "Bring a Reusable Bag",
    category: "Waste Reduction",
    description: "Use a reusable bag for groceries or shopping.",
    minEstimate: 5,
    completed: false,
  },
  {
    id: "7",
    date: new Date(2025, 0, 10),
    title: "Take a Shorter Shower",
    category: "Water Conservation",
    description: "Reduce your shower time by 2 minutes to conserve water.",
    minEstimate: 5,
    completed: false,
  },
];
