import React from "react";
import { Image } from "@heroui/react";

function AboutChefs() {
  const chefData = [
    { name: "Thomas Smith", designation: "Head Chef",image:'https://preview.colorlib.com/theme/tasty/images/chef-1.jpg' },
    { name: "Francis Gibson", designation: "Assistant Chef",image:'https://preview.colorlib.com/theme/tasty/images/chef-2.jpg.webp' },
    { name: "Angelo Maestro", designation: "Assistant Chef",image:'https://preview.colorlib.com/theme/tasty/images/chef-3.jpg' },
  ];
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 my-5 gap-10 md:gap-5">
      {chefData.map((item) => (
        <div className="flex flex-col aspect-square">
            <div className="flex flex-col gap-2 py-2">
                <span className="text-xl text-accent font-semibold">{item.name}</span>
                <span className="text-secondary font-medium text-sm">{item.designation}</span>
            </div>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default AboutChefs;
