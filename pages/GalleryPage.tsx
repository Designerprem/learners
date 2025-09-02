

import React, { useState, useEffect } from 'react';
import { GALLERY_IMAGES } from '../constants';
import type { GalleryImage } from '../types';

const ImageModal: React.FC<{
    image: GalleryImage;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}> = ({ image, onClose, onPrev, onNext }) => {
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onPrev, onNext]);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
                <img 
                    src={image.src.replace('600/400', '1200/800')} // Load a larger image
                    alt={image.alt} 
                    className="w-full h-full object-contain"
                />
            </div>
             {/* Close Button */}
            <button onClick={onClose} className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors" aria-label="Close image viewer">&times;</button>

            {/* Prev Button */}
            <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full text-3xl hover:bg-opacity-75 transition-colors" aria-label="Previous image">&#8249;</button>

            {/* Next Button */}
            <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full text-3xl hover:bg-opacity-75 transition-colors" aria-label="Next image">&#8250;</button>
        </div>
    );
};


const GalleryPage: React.FC = () => {
    const [filter, setFilter] = useState('All');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const categories = ['All', ...Array.from(new Set(GALLERY_IMAGES.map(img => img.category)))];
    const filteredImages = filter === 'All' ? GALLERY_IMAGES : GALLERY_IMAGES.filter(img => img.category === filter);

    const handleOpenModal = (image: GalleryImage) => {
        const index = filteredImages.findIndex(img => img.id === image.id);
        setSelectedImageIndex(index);
    };

    const handleCloseModal = () => {
        setSelectedImageIndex(null);
    };

    const handleNext = () => {
        if (selectedImageIndex === null) return;
        setSelectedImageIndex((prevIndex) => (prevIndex! + 1) % filteredImages.length);
    };
    
    const handlePrev = () => {
        if (selectedImageIndex === null) return;
        setSelectedImageIndex((prevIndex) => (prevIndex! - 1 + filteredImages.length) % filteredImages.length);
    };
    

    return (
         <div className="bg-white">
            <div className="bg-brand-dark text-white py-12 md:py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Gallery</h1>
                    <p className="mt-4 text-lg max-w-3xl mx-auto">A glimpse into life at Learners Academy.</p>
                </div>
            </div>
            <div className="container mx-auto px-6 py-12 md:py-20">
                {/* Filter Buttons */}
                <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
                                filter === category 
                                ? 'bg-brand-red text-white shadow-md' 
                                : 'bg-gray-200 text-brand-dark hover:bg-gray-300'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredImages.map((image) => (
                        <div 
                            key={image.id} 
                            className="overflow-hidden rounded-lg shadow-lg group cursor-pointer"
                            onClick={() => handleOpenModal(image)}
                        >
                            <img 
                                src={image.src} 
                                alt={image.alt} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
            {selectedImageIndex !== null && (
                <ImageModal 
                    image={filteredImages[selectedImageIndex]}
                    onClose={handleCloseModal}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            )}
        </div>
    );
};

export default GalleryPage;
