import { Plus } from 'lucide-react';
import React from 'react';

const AddItemButton = () => {
  return (
    <button className="rounded-lg relative w-36 h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500">
      <span className="text-gray-200 font-semibold ml-8 transform group-hover:opacity-0 transition-all duration-300">Add Item</span>
      <span className="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
        <Plus size={20} className="text-white" />
      </span>
    </button>
  );
}

export default AddItemButton;
