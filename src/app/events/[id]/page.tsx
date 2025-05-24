import { getEventById } from '@/lib/data/events';
import EventDetailsClient from './EventDetailsClient';
import { notFound } from 'next/navigation';

interface EventDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }
  
  return <EventDetailsClient event={event} />;
} 