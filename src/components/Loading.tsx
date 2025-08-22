import React from "react";

interface LoadingScreenProps {
  showLoading: boolean;
}

function LoadingScreen({ showLoading }: LoadingScreenProps) {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-50 bg-transparent backdrop-blur-xl 
      ${showLoading ? "flex" : "hidden"} items-center justify-center`}
    >
      <span className="loader"></span>
    </div>
  );
}

export default LoadingScreen;
