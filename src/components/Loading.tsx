import React from 'react'

interface LoadingScreenProps{
    showLoading:boolean;
}
function LoadingScreen({showLoading}:LoadingScreenProps) {
    console.log(showLoading)
  return (
    <div className={`fixed w-full h-full z-50 bg-transparent backdrop-blur-xl ${showLoading === true ? 'flex':'hidden'} items-center justify-center`}>
        <span className="loader"></span>
    </div>
  )
}

export default LoadingScreen