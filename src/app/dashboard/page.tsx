'use client';

import { useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

// Icon components
const Icon = memo(({ path, className = "w-4 h-4 mr-2 text-gray-400" }: { path: string; className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
));

const CalendarIcon = memo(() => <Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />);
const ClockIcon = memo(() => <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />);
const LocationIcon = memo(() => <Icon path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />);

interface EventDetailsProps {
  date: string;
  time: string;
  location: string;
}

interface BookedEventProps {
  id: string;
  month: string;
  day: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

const EventDetails = memo(({ date, time, location }: EventDetailsProps) => {
  const details = [
    { icon: <CalendarIcon />, value: date },
    { icon: <ClockIcon />, value: time },
    { icon: <LocationIcon />, value: location }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-gray-500">
      {details.map((detail, index) => (
        <div key={index} className="flex items-center">
          {detail.icon}
          <span className="text-sm">{detail.value}</span>
        </div>
      ))}
    </div>
  );
});

const BookedEvent = memo(({ id, month, day, title, date, time, location }: BookedEventProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
    {/* Mobile Layout */}
    <div className="block sm:hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <span className="text-blue-600 font-bold text-xs uppercase">{month}</span>
            <span className="text-2xl font-bold text-gray-900">{day}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <EventDetails date={date} time={time} location={location} />
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => console.log(`Cancel clicked for event ${id}`)}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
        >
          Cancel registration
        </button>
      </div>
    </div>

    {/* Desktop Layout */}
    <div className="hidden sm:block">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center">
            <span className="text-blue-600 font-bold text-sm uppercase">{month}</span>
            <span className="text-4xl font-bold text-gray-900">{day}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <EventDetails date={date} time={time} location={location} />
          </div>
        </div>
        <button
          onClick={() => console.log(`Cancel clicked for event ${id}`)}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
        >
          Cancel registration
        </button>
      </div>
    </div>
  </div>
));

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user, isAdmin } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    } else if (isAdmin) {
      router.push('/admin');
    }
  }, [isAuthenticated, isAdmin, router]);
  
  if (!isAuthenticated || !user) return null;
  
  const eventTemplate = {
    title: "Tech Conference 2025",
    month: "APR",
    day: "14",
    date: "Sunday",
    time: "3-5 PM",
    location: "San Francisco, CA"
  };
  
  const fixedEvents = Array(2).fill(null).map((_, index) => ({
    ...eventTemplate,
    id: `event${index + 1}`
  }));

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-blue-600 mb-8">
          Welcome back, {user.name}! Here you can manage your event registrations.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Registered Events</h2>
          
          <div className="space-y-4">
            {fixedEvents.map((event) => (
              <BookedEvent key={event.id} {...event} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
            >
              Browse more events
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
} 