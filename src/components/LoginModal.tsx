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
interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Modal
      isOpen={open}
      placement="top-center"
      onClose={onClose}
      className="py-5"
      classNames={{
        closeButton:'m-2 cursor-pointer'
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 ">
              <h1 className="text-2xl font-bold text-accent">
                {isLogin ? "Log in" : "Create an account"}
              </h1>
            </ModalHeader>
            <ModalBody>
              <Input
                endContent={<Mail className="text-2xl text-default-400" />}
                label="Email"
                placeholder="Enter your email"
                variant="bordered"
                className="text-black font-medium"
              />
              <Input
                endContent={<Lock className="text-2xl text-default-400" />}
                label="Password"
                placeholder="Enter your password"
                type="password"
                variant="bordered"
                className="text-black font-medium"
              />
              <div className="flex py-2 px-1 justify-between">
                {isLogin && (
                  <Link
                    href="#"
                    size="sm"
                    className="w-full flex justify-end text-blue-500 font-medium"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <Button
                className="w-full mt-2 bg-theme text-medium"
                onPress={() => {
                  // Handle email login/signup logic here
                  isLogin ? signIn("credentials") : alert("Sign up logic");
                }}
              >
                {isLogin ? "Log In" : "Sign Up"}
              </Button>

              <Divider className="my-4" />
              {isLogin && (
                <div className="flex flex-col gap-2">
                  <SignInButton
                    provider="google"
                    onClick={() => signIn("google")}
                  />
                  <SignInButton
                    provider="facebook"
                    onClick={() => signIn("facebook")}
                  />
                </div>
              )}
            </ModalBody>

            <ModalFooter className="justify-center text-sm text-accent">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    className="text-blue-500 font-medium ml-1 cursor-pointer"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    className="text-blue-500 font-medium ml-1 cursor-pointer"
                    onClick={() => setIsLogin(true)}
                  >
                    Log in
                  </button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
