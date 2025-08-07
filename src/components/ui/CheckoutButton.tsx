import { ArrowRight } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

const CheckoutButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/checkout")}
      className="relative bg-theme text-white font-medium text-[17px] px-4 py-[0.35em] pl-5 h-[2.8em] rounded-[0.9em] flex items-center overflow-hidden cursor-pointer shadow-[inset_0_0_1.6em_-0.6em_#714da6] group"
    >
      <span className="mr-10 text-black">Checkout</span>
      <div className="absolute right-[0.3em] bg-white h-[2.2em] w-[2.2em] rounded-[0.7em] flex items-center justify-center transition-all duration-300 group-hover:w-[calc(100%-0.6em)]  active:scale-95">
        <ArrowRight size={20} color="black" />
      </div>
    </button>
  );
};

export default CheckoutButton;
