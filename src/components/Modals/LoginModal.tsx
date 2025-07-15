"use client";
import { Modal, ModalContent } from "@heroui/react";
import { Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import SignInButton from "../ui/SignInButton";
import { usePathname } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const pathname = usePathname();

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      classNames={{
        closeButton: "m-2 cursor-pointer",
      }}
      // Converted inline styles to Tailwind classes
      className=" bg-gradient-to-t from-white to-orange-50 rounded-[40px] p-5 max-w-sm border-[5px] border-white shadow-xl shadow-theme/50 m-5"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="heading text-center font-black text-[30px] text-theme">
              {isLogin ? "Log In" : "Sign Up"}
            </div>
            <form action="" className="form mt-5">
              <input
                required
                className="text-accent w-full bg-white border-none py-[15px] px-[20px] rounded-[20px] mt-[15px] shadow-md shadow-theme/50 border-x-2 border-transparent box-border placeholder-secondary focus:outline-none focus:border-x-2"
                type="email"
                name="email"
                id="email"
                placeholder="E-mail"
              />
              
              <input
                required
                className="text-accent w-full bg-white border-none py-[15px] px-[20px] rounded-[20px] mt-[15px] shadow-md shadow-theme/50 border-x-2 border-transparent box-border placeholder-secondary focus:outline-none focus:border-x-2"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
              />

              <div className="mt-2">
                <a href="#" className="text-xs text-blue-500 no-underline mt-4">
                  Forgot Password ?
                </a>
              </div>
              <input
                className="block w-full font-bold bg-gradient-to-br from-theme to-theme/50 text-white py-[15px] my-2 mx-auto rounded-[20px] shadow-[rgba(133,189,215,0.8784313725)_0px_20px_10px_-15px] border-none transition-all duration-200 ease-in-out cursor-pointer hover:scale-[1.03] hover:shadow-[rgba(133,189,215,0.8784313725)_0px_23px_10px_-20px] active:scale-[0.95] active:shadow-[rgba(133,189,215,0.8784313725)_0px_15px_10px_-10px]"
                type="submit"
                value={isLogin ? "Log In" : "Sign Up"}
                onClick={() => {
                  // Handle email login/signup logic here
                  isLogin ? signIn("credentials") : alert("Sign up logic");
                }}
              />
            </form>
            {isLogin && (
              <div className="social-account-container">
                <span className="title block text-center text-[10px] text-gray-400">
                  Or Sign in with
                </span>
                <div className="social-accounts w-full flex justify-center gap-[15px] mt-[5px]">
                  <button onClick={() => signIn("google",{callbackUrl:pathname})} className="social-button google bg-gradient-to-br from-black to-gray-600 border-[5px] border-white p-[5px] rounded-full w-[40px] aspect-square grid place-content-center shadow-md shadow-theme transition-all duration-200 ease-in-out cursor-pointer hover:scale-[1.2] active:scale-[0.9]">
                    <FcGoogle/>
                  </button>
                  <button onClick={() => signIn("facebook",{callbackUrl:pathname})} className="social-button apple bg-gradient-to-br from-black to-gray-600 border-[5px] border-white p-[5px] rounded-full w-[40px] aspect-square grid place-content-center shadow-md shadow-theme transition-all duration-200 ease-in-out cursor-pointer hover:scale-[1.2] active:scale-[0.9]">
                    <FaFacebook/>
                  </button>
                  <button className="social-button twitter bg-gradient-to-br from-black to-gray-600 border-[5px] border-white p-[5px] rounded-full w-[40px] aspect-square grid place-content-center shadow-md shadow-theme transition-all duration-200 ease-in-out cursor-pointer hover:scale-[1.2] active:scale-[0.9]">
                    <svg
                      className="svg fill-white m-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                    >
                      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <span className="text-accent text-xs text-center my-5">
              {isLogin ? "Dont have an account?" : "Already have an account?"}
              <a
                href="#"
                className="text-xs text-blue-500 no-underline mx-1"
                onClick={() => {
                  isLogin ? setIsLogin(false) : setIsLogin(true);
                }}
              >
                {isLogin ? "Sign Up" : "Log In"}
              </a>
            </span>
            <span className="agreement block text-center ">
              <a href="#" className="no-underline text-blue-500 text-xs">
                Learn user licence agreement
              </a>
            </span>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
