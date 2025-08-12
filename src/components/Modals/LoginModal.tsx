"use client";
import { addToast, Modal, ModalContent } from "@heroui/react";
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

interface FormData {
  name?: string;
  email: string;
  password: string;
}

export default function LoginModal({ open, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const pathname = usePathname();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return false;
    }
    if (!isLogin && !formData.name) {
      setError("Name is required for signup");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "user",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      addToast({
        title: "Success",
        description: "Account created successfully! Please log in.",
        color: "success",
      });
      setIsLogin(true);
      setFormData({ name: "", email: "", password: "" });
    } catch (error: any) {
      setError(error.message || "Signup failed. Please try again.");

      addToast({
        title: "Failed",
        description: error.message || "Signup failed. Please try again.",
        color: "danger",
      });
    }
  };

  const handleLogin = async () => {
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        addToast({
          title: "Failed",
          description: "Invalid email or password",
          color: "danger",
        });
        return;
      }

      if (result?.ok) {
        addToast({
          title: "Success",
          description: "Login Successful!",
          color: "success",
        });
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (error: any) {
      addToast({
        title: "Failed",
        description: "Login failed. Please try again!",
        color: "danger",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      classNames={{
        closeButton: "m-2 cursor-pointer",
      }}
      placement="center"
      className="bg-gradient-to-t from-white to-orange-50 rounded-[40px] p-5 max-w-sm border-[5px] border-white shadow-xl shadow-theme/50 m-5"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="heading text-center font-black text-[30px] text-theme">
              {isLogin ? "Log In" : "Sign Up"}
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-2">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-2">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="form mt-5">
              {/* Name field for signup */}
              {!isLogin && (
                <input
                  required
                  className="text-accent w-full bg-white border-none py-[15px] px-[20px] rounded-[20px] mt-[15px] shadow-md shadow-theme/50 border-x-2 border-transparent box-border placeholder-secondary focus:outline-none focus:border-x-2"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Full Name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              )}

              <input
                required
                className="text-accent w-full bg-white border-none py-[15px] px-[20px] rounded-[20px] mt-[15px] shadow-md shadow-theme/50 border-x-2 border-transparent box-border placeholder-secondary focus:outline-none focus:border-x-2"
                type="email"
                name="email"
                id="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <input
                required
                className="text-accent w-full bg-white border-none py-[15px] px-[20px] rounded-[20px] mt-[15px] shadow-md shadow-theme/50 border-x-2 border-transparent box-border placeholder-secondary focus:outline-none focus:border-x-2"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                minLength={6}
              />

              {isLogin && (
                <div className="mt-2">
                  <a
                    href="#"
                    className="text-xs text-blue-500 no-underline mt-4"
                  >
                    Forgot Password ?
                  </a>
                </div>
              )}

              <button
                className={`block w-full font-bold bg-gradient-to-br from-theme to-theme/50 text-white py-[15px] my-2 mx-auto rounded-[20px] shadow-[rgba(133,189,215,0.8784313725)_0px_20px_10px_-15px] border-none transition-all duration-200 ease-in-out cursor-pointer hover:scale-[1.03] hover:shadow-[rgba(133,189,215,0.8784313725)_0px_23px_10px_-20px] active:scale-[0.95] active:shadow-[rgba(133,189,215,0.8784313725)_0px_15px_10px_-10px] ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="miniloader" />
                ) : isLogin ? (
                  "Log In"
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {isLogin && (
              <div className="social-account-container">
                <span className="title block text-center text-[10px] text-gray-400">
                  Or Sign in with
                </span>
                <div className="social-accounts w-full flex justify-center gap-[15px] mt-[5px]">
                  <button
                    onClick={() => signIn("google", { callbackUrl: pathname })}
                    className="social-button google bg-gradient-to-br from-black to-gray-600 border-[5px] border-white p-[5px] rounded-full w-[40px] aspect-square grid place-content-center shadow-md shadow-theme transition-all duration-200 ease-in-out cursor-pointer hover:scale-[1.2] active:scale-[0.9]"
                    disabled={isLoading}
                  >
                    <FcGoogle />
                  </button>
                  <button
                    onClick={() =>
                      signIn("facebook", { callbackUrl: pathname })
                    }
                    className="social-button apple bg-gradient-to-br from-black to-gray-600 border-[5px] border-white p-[5px] rounded-full w-[40px] aspect-square grid place-content-center shadow-md shadow-theme transition-all duration-200 ease-in-out cursor-pointer hover:scale-[1.2] active:scale-[0.9]"
                    disabled={isLoading}
                  >
                    <FaFacebook />
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
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <a
                href="#"
                className="text-xs text-blue-500 no-underline mx-1"
                onClick={toggleAuthMode}
              >
                {isLogin ? "Sign Up" : "Log In"}
              </a>
            </span>
            <span className="agreement block text-center">
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
