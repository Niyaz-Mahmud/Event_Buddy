export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  capacity: number;
  registrations: number;
  tags: string[];
  isPast: boolean;
}

// Base event template
const eventTemplate = {
  title: "Tech Conference 2025",
  time: "3-5 PM",
  location: "San Francisco, CA",
  description: "We'll get you directly seated and inside for you to enjoy the conference.",
  image: "/placeholder-event.jpeg",
  capacity: 100,
  tags: ["Tech", "Conference", "AI"],
};

// Define upcoming events data (differences from template)
const upcomingEventsData = [
  { id: "1", date: "Sunday, 14 April, 2025", registrations: 80 },
  { id: "2", date: "Sunday, 14 April, 2025", registrations: 80 },
  { id: "3", date: "Sunday, 14 April, 2025", registrations: 80 },
  { id: "4", date: "Sunday, 14 April, 2025", registrations: 80 },
  { id: "5", date: "Sunday, 14 April, 2025", registrations: 80 },
  { id: "6", date: "Sunday, 14 April, 2025", registrations: 80 },
];

// Define past events data (differences from template)
const pastEventsData = [
  { id: "7", date: "Sunday, 14 April, 2024", registrations: 100 },
  { id: "8", date: "Sunday, 14 April, 2024", registrations: 100 },
  { id: "9", date: "Sunday, 14 April, 2024", registrations: 100 },
];

// Generate upcoming events
const upcomingEvents: Event[] = upcomingEventsData.map(data => ({
  ...eventTemplate,
  ...data,
  isPast: false
}));

// Generate past events
const pastEvents: Event[] = pastEventsData.map(data => ({
  ...eventTemplate,
  ...data,
  isPast: true
}));

// Combine all events
export const events: Event[] = [...upcomingEvents, ...pastEvents];

export const getUpcomingEvents = () => events.filter(event => !event.isPast);
export const getPastEvents = () => events.filter(event => event.isPast);
export const getEventById = (id: string) => events.find(event => event.id === id); 