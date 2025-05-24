export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  seats: number;
  bookedAt: string;
}

// Define user roles and their templates
const userTemplates = {
  admin: {
    role: 'admin' as const,
    password: 'admin123',
  },
  user: {
    role: 'user' as const,
    password: 'user123',
  }
};

// Define specific user data with proper roles
const userData = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const,
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user' as const,
  }
];

// Generate users dynamically
export const users: User[] = userData.map(user => ({
  ...user,
  password: userTemplates[user.role].password,
}));

// Generate bookings array dynamically when needed
