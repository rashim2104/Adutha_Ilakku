import Form from "@/components/Form";
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default function EventRegistration({ params }) {
  const eventId = params.eventId;
  
  // Read events data from JSON file
  const eventsFilePath = path.join(process.cwd(), 'public', 'data', 'Events.json');
  const eventsData = JSON.parse(fs.readFileSync(eventsFilePath, 'utf8'));
  
  // Find the specific event
  const event = eventsData.find(event => event.eventId === eventId);
  
  // If event not found, return 404
  if (!event) {
    notFound();
  }

  // Check if event has ended
  const today = new Date();
  let isEventEnded = false;

  if (event.date) {
    const eventDateParts = event.date.split('-');
    if (eventDateParts.length === 3) {
      const eventDate = new Date(eventDateParts.reverse().join('-')); // Convert DD-MM-YYYY to YYYY-MM-DD
      eventDate.setHours(23, 59, 59, 999); // Set to end of day
      isEventEnded = today > eventDate;
    }
  }
  
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Event Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {event.eventName}
                </h1>
                <div className="space-y-1">
                  <p className="text-gray-600 flex items-center">
                    <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {event.date && event.date.split('-').length === 3
                        ? event.date.split('-').reverse().join('-')
                        : 'Invalid date'}
                    </span>
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </p>
                  {isEventEnded && (
                    <p className="text-red-600 font-medium mt-2">
                      Registration for this event has ended
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="p-4 rounded-full bg-[#10283d]">
                  <Image
                    src="/image/sairam_logo.svg"
                    alt="Sairam Logo"
                    width={120}
                    height={120}
                    className="w-24 h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl border border-gray-200">
          <Form eventId={eventId} isDisabled={isEventEnded} />
        </div>
      </div>
    </div>
  );
}