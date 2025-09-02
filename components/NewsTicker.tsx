import React, { useState, useEffect } from 'react';
import { NEWS_TICKER_MESSAGES } from '../constants';

const NewsTicker: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % NEWS_TICKER_MESSAGES.length);
        }, 5000); // Change message every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-brand-dark text-white py-3 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="relative h-6">
                    {NEWS_TICKER_MESSAGES.map((message, index) => (
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