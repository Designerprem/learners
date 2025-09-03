import React, { useState, useEffect } from 'react';
import { NEWS_TICKER_MESSAGES } from '../constants';

const NewsTicker: React.FC = () => {
    const [messages, setMessages] = useState<string[]>(NEWS_TICKER_MESSAGES);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem('siteContent');
            if (storedData) {
                const content = JSON.parse(storedData);
                if (content.newsTicker && content.newsTicker.length > 0) {
                    setMessages(content.newsTicker);
                }
            }
        } catch (error) {
            console.error("Failed to parse news ticker messages from localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (messages.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 5000); // Change message every 5 seconds

        return () => clearInterval(interval);
    }, [messages]);

    if (messages.length === 0) {
        return null;
    }

    return (
        <div className="bg-brand-dark text-white py-3 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="relative h-6">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`absolute w-full transition-transform duration-1000 ease-in-out ${
                                index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                            }`}
                        >
                            <p className="text-center font-medium truncate">{message}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;