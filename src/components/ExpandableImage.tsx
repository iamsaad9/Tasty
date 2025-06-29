import React, { useState } from "react";

const ExpandableImage = ({ src, alt }: { src: string; alt?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Image with full width and no spacing */}
      <div className="absolute h-full w-full bg-[#404044] opacity-20 hover:opacity-70 transition-colors-opacity duration-300 cursor-zoom-in"onClick={() => setIsOpen(true)} />

      <img
        src={src}
        alt={alt}
        
        className="w-full h-60 object-cover cursor-pointer"
      />

      {/* Fullscreen overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50 "
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
      )}
    </>
  );
};

export default ExpandableImage;
