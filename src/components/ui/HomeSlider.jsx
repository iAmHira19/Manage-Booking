'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    image: '/SliderImages/slider1.jpg',
    alt: 'Travel Destination 1',
    title: 'Discover Amazing Destinations',
    subtitle: 'Find the best travel deals for your next adventure'
  },
  {
    id: 2,
    image: '/SliderImages/slider2.jpg',
    alt: 'Travel Destination 2',
    title: 'Best Flight Deals',
    subtitle: 'Book your flights at the best prices'
  },
  {
    id: 3,
    image: '/SliderImages/slider3.jpg',
    alt: 'Travel Destination 3',
    title: 'Luxury Stays',
    subtitle: 'Experience comfort like never before'
  }
];

const HomeSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <div 
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative">
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white">
              <div className="text-center px-4">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl md:text-2xl">{slide.subtitle}</p>
              </div>
            </div>
            <div className="w-full h-[500px] relative">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSlider;
