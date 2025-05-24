'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/lib/data/events';

interface EventCardProps {
  event: Event;
}

interface InfoItemProps {
  icon: React.ReactNode;
  text: string;
}

interface DateDisplayProps {
  month: string;
  day: string;
}

// Components
const InfoItem = ({ icon, text }: InfoItemProps) => (
  <div className="flex items-center text-sm text-gray-600">
    <div className="h-5 w-5 mr-1.5 text-blue-400">{icon}</div>
    {text}
  </div>
);

const DateDisplay = ({ month, day }: DateDisplayProps) => (
  <div className="mr-4 text-center">
    <div className="text-xs text-blue-500 uppercase font-medium">{month}</div>
    <div className="font-bold text-2xl text-gray-800">{day}</div>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex gap-2 mb-5">
    {tags.map((tag) => (
      <span key={tag} className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-md">
        • {tag}
      </span>
    ))}
  </div>
);

// Icon components
const CalendarIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LocationIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function EventCard({ event }: EventCardProps) {
  const dateObj = new Date(event.date);
  const day = dateObj.getDate().toString();
  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();

  const eventInfo = [
    { icon: <CalendarIcon />, text: event.date.split(',')[0] },
    { icon: <ClockIcon />, text: event.time },
    { icon: <LocationIcon />, text: event.location }
  ];

  return (
    <Link href={`/events/${event.id}`} className="block">
      <div className="shadow-sm w-full max-w-[400px] mx-auto bg-[#f9fafb] rounded-md overflow-hidden transition-transform duration-200 ease-in-out hover:scale-[1.02] cursor-pointer [clip-path:polygon(0_25px,25px_0,100%_0,100%_calc(100%-25px),calc(100%-25px)_100%,0_100%)]">
        <div className="relative h-56 w-full">
          <Image
            src={event.image || "/placeholder-event.jpeg"}
            alt={event.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="p-6 bg-white">
          <div className="flex mb-4">
            <DateDisplay month={month} day={day} />
            <h3 className="text-xl font-semibold text-blue-900">{event.title}</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-5 line-clamp-2">{event.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 mb-5">
            {eventInfo.map((info, index) => (
              <InfoItem key={index} {...info} />
            ))}
          </div>
          
          <EventTags tags={event.tags} />
          
          <div className="border-t border-gray-200 mb-5"></div>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <InfoItem 
              icon={<UsersIcon />} 
              text={`${event.capacity - event.registrations} Spots Left`} 
            />
            <div>Total {event.capacity} Seats</div>
          </div>
        </div>
      </div>
    </Link>
  );
} 