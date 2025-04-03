import Link from 'next/link';

export default function EventCard({ event }) {
    // Check if event date has passed
    const today = new Date();
    const eventDate = new Date(event.date);
    eventDate.setHours(23, 59, 59, 999); // Set to end of day
    const isEventEnded = today > eventDate;

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-xl font-bold text-gray-800">{event.eventName}</h3>
                </div>

                {/* Event Details */}
                <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{event.date}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location}</span>
                    </div>
                </div>

                {/* Status Badge */}
                {!isEventEnded ? (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Registration Open
                    </div>
                ) : (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Registration Closed
                    </div>
                )}

                {/* Action Button */}
                <div className="pt-4">
                    {!isEventEnded ? (
                        <Link
                            href={`/register/${event.eventId}`}
                            className="w-full inline-flex justify-center items-center px-6 py-2.5 text-center 
                                bg-blue-600 hover:bg-blue-700 text-white
                                font-medium rounded-lg transition-all duration-300 space-x-2"
                        >
                            <span>Register Now</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="w-full inline-flex justify-center items-center px-6 py-2.5 text-center 
                                bg-gray-100 text-gray-400 cursor-not-allowed
                                font-medium rounded-lg transition-all duration-300"
                        >
                            <span>Registration Closed</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}