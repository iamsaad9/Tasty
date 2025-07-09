"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Checkbox,
  Link,
  Divider,
} from "@heroui/react";
import { Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import SignInButton from "./SignInButton";
import { usePathname } from "next/navigation";

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
            <div
              className="heading text-center font-black text-[30px] text-theme"
            >
              Log In
            </div>
            <form
              action=""
              className="form mt-5"
            >
              <input
                required
                className="text-accent w-full bg-white border-none py-[15px] px-[20px] rounded-[20px] mt-[15px] shadow-md shadow-theme/50 border-x-2 border-transparent box-border placeholder-gray-400 focus:outline-none focus:border-x-2 focus:border-[#12B1D1]"
                type="email"
                name="email"
                id="email"
                placeholder="E-mail"
              />
              <input
                required
                className="text-accent w-full bg-white border-none py-[15px] px-[20px] rounded-[20px] mt-[15px] shadow-md shadow-theme/50 border-x-2 border-transparent box-border placeholder-gray-400 focus:outline-none focus:border-x-2 focus:border-[#12B1D1]"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
              />
              <span
                className="forgot-password block mt-[10px] ml-[10px]"
              >
                <a
                  href="#"
                  className="text-[11px] text-blue-500 no-underline"
                >
                  Forgot Password ?
                </a>
              </span>
              <input
                className="login-button block w-full font-bold bg-gradient-to-br from-theme to-theme/50 text-white py-[15px] my-5 mx-auto rounded-[20px] shadow-[rgba(133,189,215,0.8784313725)_0px_20px_10px_-15px] border-none transition-all duration-200 ease-in-out cursor-pointer hover:scale-[1.03] hover:shadow-[rgba(133,189,215,0.8784313725)_0px_23px_10px_-20px] active:scale-[0.95] active:shadow-[rgba(133,189,215,0.8784313725)_0px_15px_10px_-10px]"
                type="submit"
                value="Sign In"
              />
            </form>
            <div
              className="social-account-container mt-[25px]"
            >
              <span
                className="title block text-center text-[10px] text-gray-400"
              >
                Or Sign in with
              </span>
              <div
                className="social-accounts w-full flex justify-center gap-[15px] mt-[5px]"
              >
                <button
                  className="social-button google bg-gradient-to-br from-black to-gray-600 border-[5px] border-white p-[5px] rounded-full w-[40px] aspect-square grid place-content-center shadow-md shadow-theme transition-all duration-200 ease-in-out cursor-pointer hover:scale-[1.2] active:scale-[0.9]"
                >
                  <svg
                    className="svg fill-white m-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 488 512"
                  >
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                  </svg>
                </button>
                <button
                  className="social-button apple bg-gradient-to-br from-black to-gray-600 border-[5px] border-white p-[5px] rounded-full w-[40px] aspect-square grid place-content-center shadow-md shadow-theme transition-all duration-200 ease-in-out cursor-pointer hover:scale-[1.2] active:scale-[0.9]"
                >
                  <svg
                    className="svg fill-white m-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 384 512"
                  >
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                </button>
                <button
                  className="social-button twitter bg-gradient-to-br from-black to-gray-600 border-[5px] border-white p-[5px] rounded-full w-[40px] aspect-square grid place-content-center shadow-md shadow-theme transition-all duration-200 ease-in-out cursor-pointer hover:scale-[1.2] active:scale-[0.9]"
                >
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
            <span
              className="agreement block text-center mt-[15px]"
            >
              <a
                href="#"
                className="no-underline text-blue-500 text-[9px]"
              >
                Learn user licence agreement
              </a>
            </span>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
