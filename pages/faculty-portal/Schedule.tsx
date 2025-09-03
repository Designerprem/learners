

import React, { useState } from 'react';
import { CALENDAR_EVENTS } from '../../constants';
import type { CalendarEvent } from '../../types';
import AddClassModal from '../../components/faculty-portal/AddClassModal';
import { useFaculty } from '../FacultyPortalPage';

const eventColors: { [key in CalendarEvent['type']]: string } = {
    class: 'bg-blue-500',
    deadline: 'bg-yellow-500',
    exam: 'bg-brand-red',
};

const AgendaItem = ({ event, onEdit, onDelete }: { event: CalendarEvent, onEdit: (event: CalendarEvent) => void, onDelete: (id: number | string) => void }) => (
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
                <div className="flex items-center space-x-2 flex-shrink-0">
                    {event.type === 'class' && event.joinLink && (
                        <a href={event.joinLink} target="_blank" rel="noopener noreferrer" className="bg-brand-red text-white text-xs font-bold py-1 px-3 rounded-full hover:bg-red-700 transition-colors">
                            Start Class
                        </a>
                    )}
                    {event.type === 'class' && (
                        <>
                            <button onClick={() => onEdit(event)} className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
                            <button onClick={() => onDelete(event.id)} className="text-xs font-semibold text-brand-red hover:underline">Delete</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
);


const Schedule: React.FC = () => {
    const { facultyMember } = useFaculty();
    const [currentDate, setCurrentDate] = useState(new Date('2024-07-22T10:00:00Z'));
    const [selectedDate, setSelectedDate] = useState(new Date('2024-07-22T10:00:00Z'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    
    const facultyEvents = CALENDAR_EVENTS.filter(event => event.instructor === facultyMember.name || event.type === 'deadline');
    const [events, setEvents] = useState<CalendarEvent[]>(facultyEvents);


    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    
    const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();
    const isToday = (d: Date) => isSameDay(d, new Date('2024-07-22T10:00:00Z'));

    const changeMonth = (offset: number) => {
        setCurrentDate(current => {
            const newDate = new Date(current);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const handleSaveClass = (classData: Omit<CalendarEvent, 'type'>) => {
        if (classData.id) { // This is an update
            setEvents(prev => prev.map(e => e.id === classData.id ? { ...e, ...classData, type: 'class' } : e));
        } else { // This is a new class
             const newEvent: CalendarEvent = {
                ...classData,
                id: Date.now(),
                type: 'class',
                instructor: facultyMember.name,
            };
            setEvents(prev => [...prev, newEvent]);
        }
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    const handleEditClick = (event: CalendarEvent) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: number | string) => {
        if (window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            setEvents(prev => prev.filter(e => e.id !== id));
        }
    };
    
    const selectedDayEvents = events
        .filter(event => event.date === selectedDate.toISOString().split('T')[0])
        .sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));

    if (!facultyMember) return null;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-brand-dark">My Schedule</h1>
                <button
                    onClick={() => {
                        setEditingEvent(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                    Schedule New Class
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
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
                        const dayEvents = events.filter(e => e.date === dateStr);
                        const isSelected = isSameDay(d, selectedDate);

                        return (
                            <div 
                                key={i}
                                onClick={() => setSelectedDate(d)}
                                className={`h-28 md:h-32 p-2 border rounded-md flex flex-col overflow-hidden cursor-pointer transition-colors ${
                                    isSelected ? 'bg-red-100 border-brand-red' : 
                                    isToday(d) ? 'bg-red-50' : 
                                    isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                            >
                                <span className={`font-bold ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {d.getDate()}
                                </span>
                                <div className="mt-1 flex-grow overflow-y-auto text-xs space-y-1">
                                    {dayEvents.map((event, eventIndex) => (
                                        <div key={eventIndex} className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full ${eventColors[event.type]} mr-1.5 flex-shrink-0`}></span>
                                            <span className="truncate">{event.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

             <div className="mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">
                        Agenda for: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>
                     <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {selectedDayEvents.length > 0 ? (
                            selectedDayEvents.map(event => <AgendaItem key={event.id} event={event} onEdit={handleEditClick} onDelete={handleDeleteClick} />)
                        ) : (
                            <p className="text-gray-500 text-center py-8">No events scheduled for this day.</p>
                        )}
                    </div>
                </div>
            </div>

            <AddClassModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingEvent(null);
                }}
                onSaveClass={handleSaveClass}
                assignedPapers={facultyMember.assignedPapers}
                eventToEdit={editingEvent}
            />
        </div>
    );
};

export default Schedule;