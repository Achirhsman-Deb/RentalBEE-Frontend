import React, { useEffect, useState } from 'react';
import './CarImageViewer.css'; 

interface CarImageViewerProps {
  images: string[];
  status: string;
  className?: string;
}

const CarImageViewer: React.FC<CarImageViewerProps> = ({ images, status, className }) => {
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]); 
    }
  }, [images]);

  return (
    <div className={`flex flex-col lg:flex-row gap-4 ${className || ''}`}>
      {/* Main Image */}
      <div className="relative w-full lg:w-[1000px] h-[250px] sm:h-[300px] md:h-[375px] lg:h-[400px]">
        <img
          className="w-full h-full object-contain rounded-lg"
          src={selectedImage}
          alt="Main"
        />
      </div>

      {/* Thumbnails */}
      <div
        className="
          flex lg:grid lg:grid-rows-5 
          gap-2.5
          overflow-x-auto lg:overflow-visible
          w-full lg:w-auto
          h-[100px] lg:h-[400px]
        "
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className={`
              flex-shrink-0
              w-[100px] sm:w-[120px] md:w-[150px] lg:w-[200px] xl:w-[220px]
              h-full lg:h-auto
              object-cover rounded-md
              cursor-pointer opacity-70
              border-2 border-transparent
              transition-all duration-200
              ${selectedImage === img ? 'border-black opacity-100' : 'hover:border-black hover:opacity-100'}
            `}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
    </div>
  );
};

export default CarImageViewer;
