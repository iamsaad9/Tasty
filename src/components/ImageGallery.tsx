import React from "react";
import ExpandableImage from "./Dashboard/ExpandableImage";
import FadeInSection from "./ui/scrollAnimated";
const images = [
  "/images/Gallery/insta-1.jpg.webp",
  "/images/Gallery/insta-2.jpg.webp",
  "/images/Gallery/insta-3.jpg.webp",
  "/images/Gallery/insta-4.jpg.webp",
  "/images/Gallery/insta-5.jpg.webp"
];

function ImageGallery() {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-foreground">
        <h2 className="text-xl text-center font-semibold my-10 p-2 px-3 border-2 border-black/70 text-black/70">INSTAGRAM</h2>

    <div className="w-full flex flex-col sm:flex-row">
      {images.map((src, index) => (
        <FadeInSection delay={index*0.1} className="flex-1 relative">
          <ExpandableImage src={src} alt={`Special ${index + 1}`} />
        </FadeInSection>
      ))}
    </div>
    </div>
  );
}

export default ImageGallery;
