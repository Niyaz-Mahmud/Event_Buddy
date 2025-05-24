'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/lib/data/events';
import { useAuth } from '@/lib/auth-context';

interface EventDetailsClientProps {
  event: Event;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface SeatOptionProps {
  num: number;
  isSelected: boolean;
  onClick: (num: number) => void;
}

interface MessageProps {
  type: 'error' | 'success';
  message: string;
}

// Components
const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <div className="flex items-center gap-3">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const SeatOption = ({ num, isSelected, onClick }: SeatOptionProps) => (
  <div
    onClick={() => onClick(num)}
    className={`flex flex-col items-center p-4 sm:p-6 rounded-lg cursor-pointer border transition-colors ${
      isSelected ? 'bg-blue-50 border-blue-600' : 'bg-white border-gray-200 hover:border-blue-600'
    }`}
  >
    <div className="flex items-center justify-center mb-3">
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    </div>
    <span className="text-2xl font-bold text-gray-900 mb-1">{num}</span>
    <span className="text-sm text-gray-500">{num === 1 ? 'Seat' : 'Seats'}</span>
  </div>
);

const Message = ({ type, message }: MessageProps) => (
  <div className={`mt-4 p-4 border-l-4 ${
    type === 'error' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'
  }`}>
    {message}
  </div>
);

const BackButton = () => (
  <Link href="/" className="inline-flex items-center text-sm text-gray-600 mb-8">
    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    Back to event
  </Link>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
    {tags.map((tag) => (
      <span key={tag} className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
        • {tag}
      </span>
    ))}
  </div>
);

const EventAbout = () => (
  <div className="mb-8 sm:mb-12">
    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">About this event</h2>
    <div className="prose max-w-none">
      <p className="text-gray-600">
        Join us for Tech Future Expo 2025, an immersive one-day technology event bringing together developers, startups, and industry leaders to explore the future of software, AI, blockchain, and cloud computing.
      </p>
      <p className="text-gray-600 mt-4">This event will feature:</p>
      <ul className="list-disc list-inside text-gray-600 mt-2">
        <li>Keynote talks from industry pioneers</li>
        <li>Live demos of upcoming tech products</li>
        <li>Startup pitching sessions, Hands-on coding workshops</li>
        <li>Networking lounge for professionals and students</li>
        <li>Whether you're an aspiring developer, a seasoned engineer, or just curious about what's next in tech, this event offers something for everyone.</li>
      </ul>
      <p className="text-gray-600 mt-4">
        Reserve your seat today and be part of tomorrow's innovation. Limited seats available. Advance booking required.
      </p>
    </div>
  </div>
);

// Icon components
const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function EventDetailsClient({ event }: EventDetailsClientProps) {
  const [selectedSeats, setSelectedSeats] = useState<number>(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingId, setBookingId] = useState<string>('');
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const handleBooking = () => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    if (!user) {
      setBookingError('User information not available. Please try signing in again.');
      return;
    }
    
    if (event.registrations + selectedSeats > event.capacity) {
      setBookingError('Not enough seats available');
      return;
    }
    
    try {
      const newBookingId = `BK-${Math.floor(Math.random() * 10000)}`;
      event.registrations += selectedSeats;
      setBookingId(newBookingId);
      setBookingSuccess(true);
      setBookingError('');
    } catch (error) {
      setBookingError('Failed to book the event. Please try again.');
    }
  };

  const eventInfo = [
    { icon: <CalendarIcon />, label: 'Date', value: event.date },
    { icon: <ClockIcon />, label: 'Time', value: event.time },
    { icon: <LocationIcon />, label: 'Location', value: event.location }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />

        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="relative h-[250px] sm:h-[350px] md:h-[400px] w-full">
            <Image
              src={event.image || "/placeholder-event.jpeg"}
              alt={event.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <EventTags tags={event.tags} />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">{event.title}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-12 border rounded-lg p-4 sm:p-6 bg-gray-50">
              {eventInfo.map((info, index) => (
                <InfoItem key={index} {...info} />
              ))}
            </div>

            <div className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Select Number of Seats</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <SeatOption
                    key={num}
                    num={num}
                    isSelected={selectedSeats === num}
                    onClick={setSelectedSeats}
                  />
                ))}
              </div>
              <div className="mt-6 sm:mt-8 flex justify-center">
                <button
                  onClick={handleBooking}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
                >
                  Book {selectedSeats} {selectedSeats === 1 ? 'Seat' : 'Seats'}
                </button>
              </div>
            </div>

            <EventAbout />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t pt-6 sm:pt-8 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <UsersIcon />
                <span className="text-sm sm:text-base">{event.capacity - event.registrations} Spots Left ({event.registrations} registered)</span>
              </div>
            </div>

            {bookingError && <Message type="error" message={bookingError} />}
            {bookingSuccess && <Message type="success" message={`Booking successful! Your booking ID is ${bookingId}`} />}
          </div>
        </div>
      </div>
    </div>
  );
} 