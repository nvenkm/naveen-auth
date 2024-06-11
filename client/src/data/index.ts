export const categories = [
  "Groceries",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Dining",
];

export interface ExpenseInterface {
  id: number;
  name: string;
  amount: number;
  category: string;
  data: number[];
  date: string;
}

export const expenses = [
  {
    id: 1,
    name: "Groceries",
    amount: 100,
    category: "Groceries",
    data: [120],
    date: "2022-11-25",
  },
  {
    id: 2,
    name: "Bus Pass",
    amount: 50,
    category: "Transportation",
    data: [120],
    date: "2022-11-20",
  },
  {
    id: 3,
    name: "Movie Tickets",
    amount: 30,
    category: "Entertainment",
    data: [120],
    date: "2022-11-15",
  },
  {
    id: 4,
    name: "Electric Bill",
    amount: 120,
    category: "Utilities",
    data: [120],
    date: "2022-11-10",
  },
  {
    id: 5,
    name: "Dinner at Restaurant",
    amount: 60,
    category: "Dining",
    data: [120],
    date: "2022-11-05",
  },
  {
    id: 6,
    name: "Weekly Groceries",
    amount: 85,
    category: "Groceries",
    data: [120],
    date: "2022-11-27",
  },
  {
    id: 7,
    name: "Taxi Ride",
    amount: 20,
    category: "Transportation",
    data: [120],
    date: "2022-11-22",
  },
  {
    id: 8,
    name: "Concert Tickets",
    amount: 150,
    category: "Entertainment",
    data: [120],
    date: "2022-11-18",
  },
  {
    id: 9,
    name: "Water Bill",
    amount: 45,
    category: "Utilities",
    data: [120],
    date: "2022-11-12",
  },
  {
    id: 10,
    name: "Lunch at Cafe",
    amount: 25,
    category: "Dining",
    data: [120],
    date: "2022-11-08",
  },
];
