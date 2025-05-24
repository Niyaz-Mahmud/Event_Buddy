'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import EventCard from '@/components/ui/EventCard';
import { getUpcomingEvents, getPastEvents } from '@/lib/data/events';

// Ticket component to reduce repetition
const TicketDecoration = ({ 
  position, 
  rotation, 
  bgColor, 
  textColor, 
  qrValue, 
  ticketId,
  isLeft = false 
}: {
  position: string;
  rotation: string;
  bgColor: string;
  textColor: string;
  qrValue: string;
  ticketId: string;
  isLeft?: boolean;
}) => (
        <div className={`absolute ${position} z-10 transform ${rotation}`}>
     <div className={`w-[280px] h-[120px] ${bgColor} relative overflow-visible rounded-[20px] shadow-2xl`} 
          style={{ 
            boxShadow: isLeft 
              ? '0 20px 40px rgba(59, 130, 246, 0.3)' 
              : '0 20px 40px rgba(0, 0, 0, 0.1)',
            maskImage: `
              radial-gradient(circle at 100px -3px, transparent 16px, black 17px),
              radial-gradient(circle at 100px 125px, transparent 16px, black 17px),
              radial-gradient(circle at 0px 0px, transparent 20px, black 17px),
              radial-gradient(circle at 280px 0px, transparent 20px, black 17px),
              radial-gradient(circle at 0px 120px, transparent 20px, black 17px),
              radial-gradient(circle at 280px 120px, transparent 20px, black 17px)
            `,
            maskComposite: 'intersect',
            WebkitMaskImage: `
              radial-gradient(circle at 100px -3px, transparent 16px, black 17px),
              radial-gradient(circle at 100px 125px, transparent 16px, black 17px),
              radial-gradient(circle at 0px 0px, transparent 20px, black 17px),
              radial-gradient(circle at 280px 0px, transparent 20px, black 17px),
              radial-gradient(circle at 0px 120px, transparent 20px, black 17px),
              radial-gradient(circle at 280px 120px, transparent 20px, black 17px)
            `,
            WebkitMaskComposite: 'source-in'
          }}>
      
      {/* QR Code section */}
      <div className={`absolute left-0 top-0 bottom-0 w-[100px] flex items-center justify-center`}>
        <div className="w-[70px] h-[70px] flex items-center justify-center">
          <QRCodeSVG 
            value={qrValue} 
            size={64} 
            bgColor="transparent"
            fgColor={isLeft ? "#ffffff" : "#3b82f6"}
            level="L"
            includeMargin={false}
          />
        </div>
      </div>
      
      {/* Dotted line separator */}
      <div className={`absolute left-[100px] top-2 bottom-2 w-[1px] border-l-2 border-dashed ${isLeft ? 'border-white/40' : 'border-blue-600/40'}`}></div>
      
      {/* Ticket content */}
      <div className="absolute left-[100px] right-0 top-0 bottom-0 flex flex-col justify-center p-3">
        <div className="flex items-center mb-3">
          <Image src="/Logo.png" alt="Event Buddy Logo" width={12} height={12} className="mr-2" />
          <span className={`${textColor} text-sm font-semibold`}>Event buddy.</span>
        </div>
        <div className="space-y-2">
          <div className={`border-t-2 ${isLeft ? 'border-white/60' : 'border-blue-600/60'}`}></div>
          <div className={`${textColor} font-bold text-sm tracking-wider font-mono uppercase whitespace-nowrap`}>
            ONE WAY TICKET
          </div>
          <div className={`border-t-2 ${isLeft ? 'border-white/60' : 'border-blue-600/60'}`}></div>
          <div className="flex justify-center pt-1">
            {Array.from({ length: 3 }, (_, i) => (
              <svg key={i} className={`h-3 w-3 ${textColor} mx-0.5`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Star decoration component
const StarDecoration = ({ position }: { position: string }) => (
  <div className={`absolute ${position} w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20`}>
    <div className="absolute w-full h-full bg-white/30 rounded-full blur-xl"></div>
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-3/4 h-3/4 bg-white rounded-full">
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-1/2 h-1/2 bg-blue-200 ${
            i === 0 ? 'rounded-br-full' : 
            i === 1 ? 'rounded-bl-full' : 
            i === 2 ? 'rounded-tr-full' : 'rounded-tl-full'
          }`}></div>
        ))}
      </div>
    </div>
  </div>
);

// Pagination component
const Pagination = () => (
  <div className="flex justify-center mt-10">
    <nav className="flex items-center">
      {[1, 2, 3].map((num, i) => (
        <a key={num} href="#" className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${
          i === 0 ? 'rounded bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600 mx-1'
        }`}>
          {num}
        </a>
      ))}
      <span className="mx-2 text-gray-400">...</span>
      {[67, 68].map(num => (
        <a key={num} href="#" className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 text-sm font-medium mx-1">
          {num}
        </a>
      ))}
    </nav>
  </div>
);

// Events section component
const EventsSection = ({ title, events }: { title: string; events: any[] }) => (
  <section className="py-12 bg-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <Pagination />
    </div>
  </section>
);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-6 md:py-16 min-h-[500px] md:min-h-[650px] bg-gradient-to-b from-white via-blue-400 ">
        {/* Background patterns and gradients */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4169E150_1.5px,transparent_1.5px),linear-gradient(to_bottom,#4169E150_1.5px,transparent_1.5px)] bg-[size:24px_24px]" />
          <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-white via-white/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-blue-50/50 to-blue-200/70"></div>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-blue-100/30 via-blue-200/20 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-blue-100/30 via-blue-200/20 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-radial from-white/30 via-transparent to-transparent"></div>
        
        {/* Orbit circles - Hidden on mobile for clean experience */}
        <div className="hidden md:block">
          {[
            { 
              sizes: 'w-[800px] h-[800px] lg:w-[1200px] lg:h-[1200px] xl:w-[1700px] xl:h-[1700px]', 
              position: 'top-[130%]' 
            },
            { 
              sizes: 'w-[600px] h-[600px] lg:w-[900px] lg:h-[900px] xl:w-[1200px] xl:h-[1200px]', 
              position: 'top-[120%]' 
            },
            { 
              sizes: 'w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] xl:w-[800px] xl:h-[800px]', 
              position: 'top-[120%]' 
            }
          ].map((circle, i) => (
            <div 
              key={i} 
              className={`absolute border-2 border-white/80 rounded-full left-1/2 ${circle.position} -translate-x-1/2 -translate-y-1/2 ${circle.sizes}`}
            ></div>
          ))}
        </div>

        {/* Star decorations - positioned around "Find Your Next Event" section */}
        <StarDecoration position="left-[3%] top-[36%] sm:left-[8%] sm:top-[38%] md:left-[15%] md:top-[60%]" />
        <StarDecoration position="right-[3%] top-[36%] sm:right-[8%] sm:top-[38%] md:right-[15%] md:top-[60%]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-4 md:mb-20"></div>

          <div className="relative z-20 mt-2 md:mt-8">
            <div className="text-center px-2 sm:px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-blue-900">Discover</span><br />
                <span className="text-blue-600">Amazing</span> <span className="text-blue-900">Events</span>
              </h1>
              <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto px-2 sm:px-4">
                Find and book events that match your interests. From tech conferences to music festivals,
                we've got you covered.
              </p>
            </div>
            
            <div className="mt-6 md:mt-16">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-blue-900 mb-3 md:mb-6 px-2">Find Your Next Event</h2>
              <div className="flex justify-center px-2 sm:px-4">
                <div className="w-full max-w-xl flex flex-col gap-3 sm:flex-row sm:gap-2 relative">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-3 flex items-center z-20">
                      <svg width="24" height="24" viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500">
                        <path fill="currentColor" d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search events"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-4 py-3 text-sm sm:text-base bg-white/30 backdrop-blur-xl border border-white/20 rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] focus:ring-2 focus:ring-white/30 focus:border-white/30 placeholder-gray-500"
                    />
                  </div>
                  <Link
                    href={`/events?search=${searchQuery}`}
                    className="bg-blue-500/80 backdrop-blur-xl hover:bg-blue-600/80 text-white px-4 sm:px-6 md:px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/20 text-center text-sm sm:text-base"
                  >
                    Search Events
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ticket decorations - Responsive positioning */}
          <div className="block">
            {/* Mobile tickets - positioned in top corners as requested */}
            <div className="block lg:hidden">
              <div className="absolute left-2 top-1 transform -rotate-[15deg] scale-[0.35] origin-top-left z-0">
                <TicketDecoration 
                  position="relative"
                  rotation=""
                  bgColor="bg-blue-600"
                  textColor="text-white"
                  qrValue="https://eventbuddy.com/ticket/123"
                  ticketId="T-12345"
                  isLeft={true}
                />
              </div>
              
              <div className="absolute right-2 top-1 transform rotate-[15deg] scale-[0.35] origin-top-right z-0">
                <TicketDecoration 
                  position="relative"
                  rotation=""
                  bgColor="bg-white"
                  textColor="text-blue-600"
                  qrValue="https://eventbuddy.com/ticket/456"
                  ticketId="V-56789"
                  isLeft={false}
                />
              </div>
            </div>

            {/* Desktop tickets - original positioning */}
            <div className="hidden lg:block">
              <TicketDecoration 
                position="left-2 xl:left-5 top-1"
                rotation="-rotate-[20deg]"
                bgColor="bg-blue-600"
                textColor="text-white"
                qrValue="https://eventbuddy.com/ticket/123"
                ticketId="T-12345"
                isLeft={true}
              />
              
              <TicketDecoration 
                position="right-2 xl:right-5 top-1"
                rotation="rotate-[20deg]"
                bgColor="bg-white"
                textColor="text-blue-600"
                qrValue="https://eventbuddy.com/ticket/456"
                ticketId="V-56789"
                isLeft={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events Sections */}
      <EventsSection title="Upcoming Events" events={upcomingEvents} />
      <EventsSection title="Previous Events" events={pastEvents} />
    </div>
  );
}

