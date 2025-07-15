import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

type SignInButtonProps = {
  provider: "google" | "facebook";
  onClick?: () => void;
};

const SignInButton: React.FC<SignInButtonProps> = ({ provider, onClick }) => {
  const isGoogle = provider === "google";

  const providerText = isGoogle ? "Sign in with Google" : "Sign in with Facebook";
  const providerIcon = isGoogle ? (
    <FcGoogle size={22} />
  ) : (
    <FaFacebook size={22} className="text-[#1877F2]" />
  );

  return (
    <button
      onClick={onClick}
      className="cursor-pointer relative inline-flex items-center gap-3 p-[2px] rounded-xl text-sm font-medium  text-white shadow-lg group transition-transform duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.97]"
    >
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

      <span className="w-full h-full relative z-10 flex items-center gap-3 bg-(--secondary-theme) px-6 py-3 rounded-xl">
        {providerIcon}
        {providerText}
      </span>
    </button>
  );
};

export default SignInButton;
