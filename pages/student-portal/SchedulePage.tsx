

import React, { useState } from 'react';
import { CALENDAR_EVENTS } from '../../constants';
import type { CalendarEvent } from '../../types';

const eventColors: { [key in CalendarEvent['type']]: string } = {
    class: 'bg-blue-500',
    deadline: 'bg-yellow-500',
    exam: 'bg-brand-red',
};

const AgendaItem = ({ event }: { event: CalendarEvent }) => (
    <div className="flex items-start p-3 bg-gray-50 rounded-lg">
        <div className="w-24 text-right pr-4 flex-shrink-0">
            <p className="font-bold text-brand-dark">{event.startTime || 'All Day'}</p>
            {event.endTime && <p className="text-sm text-gray-500">to {event.endTime}</p>}
        </div>
        <div className="flex-grow">
            <div className="flex justify-between items-center">
                 <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full ${eventColors[event.type]} mr-3 flex-shrink-0`}></span>
                    <div>
                        <p className="font-semibold text-gray-800">{event.title}</p>
                        {event.paper && <p className="text-sm text-gray-500">{event.paper}</p>}
                    </div>
                </div>
                {event.type === 'class' && event.joinLink && (
                    <a href={event.joinLink} target="_blank" rel="noopener noreferrer" className="bg-brand-red text-white text-xs font-bold py-1 px-3 rounded-full hover:bg-red-700 transition-colors flex-shrink-0">
                        Join Now
                    </a>
                )}
            </div>
        </div>
    </div>
);


const SchedulePage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date('2024-07-22T10:00:00Z'));
    const [selectedDate, setSelectedDate] = useState(new Date('2024-07-22T10:00:00Z'));

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Adjust start date to the beginning of the week (Sunday)
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Adjust end date to the end of the week (Saturday)
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    
    const isSameDay = (d1: Date, d2: Date) => 
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const isToday = (d: Date) => isSameDay(d, new Date('2024-07-22T10:00:00Z'));

    const changeMonth = (offset: number) => {
        setCurrentDate(current => {
            const newDate = new Date(current);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };
    
    const selectedDayEvents = CALENDAR_EVENTS
        .filter(event => event.date === selectedDate.toISOString().split('T')[0])
        .sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-8">My Schedule</h1>

            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => changeMonth(-1)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">&larr; Previous</button>
                        <h2 className="text-2xl font-bold text-brand-dark">
                            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                        </h2>
                        <button onClick={() => changeMonth(1)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">Next &rarr;</button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days.map((d, i) => {
                            const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                            const dateStr = d.toISOString().split('T')[0];
                            const dayEvents = CALENDAR_EVENTS.filter(e => e.date === dateStr);
                            const isSelected = isSameDay(d, selectedDate);

                            return (
                                <div 
                                    key={i}
                                    onClick={() => setSelectedDate(d)}
                                    className={`h-28 md:h-32 p-2 border rounded-md flex flex-col overflow-hidden cursor-pointer transition-colors ${
                                        isSelected ? 'bg-red-100 border-brand-red scale-105 shadow-lg' : 
                                        isToday(d) ? 'bg-red-50' : 
                                        isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className={`font-bold ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}`}>
                                        {d.getDate()}
                                    </span>
                                    <div className="mt-1 flex-grow overflow-y-auto text-xs space-y-1">
                                        {dayEvents.slice(0, 3).map((event, eventIndex) => (
                                            <div key={eventIndex} className={`flex items-center p-1 rounded-md text-white ${eventColors[event.type]}`}>
                                                <span className="truncate">{event.title}</span>
                                            </div>
                                        ))}
                                        {dayEvents.length > 3 && <div className="text-center text-gray-500 font-bold">...</div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 lg:mt-0">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-10">
                        <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">
                            Daily Agenda: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h3>
                         <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                            {selectedDayEvents.length > 0 ? (
                                selectedDayEvents.map(event => <AgendaItem key={event.id} event={event} />)
                            ) : (
                                <p className="text-gray-500 text-center py-8">No events scheduled for this day.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;