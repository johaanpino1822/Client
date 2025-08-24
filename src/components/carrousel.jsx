import React, { useState, useEffect } from 'react';

const Carrousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      image: "https://via.placeholder.com/1200x400?text=Banner+1",
      title: "Ofertas Especiales",
      subtitle: "Hasta 50% de descuento"
    },
    {
      id: 2,
      image: "https://via.placeholder.com/1200x400?text=Banner+2",
      title: "Nuevos Productos",
      subtitle: "Descubre nuestra última colección"
    },
    {
      id: 3,
      image: "https://via.placeholder.com/1200x400?text=Banner+3",
      title: "Envío Gratis",
      subtitle: "En compras mayores a $100"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-64 md:h-96 w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-center">
            <div className="text-white px-4">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">{slide.title}</h2>
              <p className="text-lg md:text-xl">{slide.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carrousel;