import React from "react";

interface NavItemProps {
  icon: string;
  label: string;
  active: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ icon, label, active }) => {
  return (
    <div
      className={`flex gap-4 px-4 py-3 rounded-lg cursor-pointer hover:bg-indigo-600 ${
        active ? "bg-indigo-600" : ""
      }`}
    >
      <img
        loading="lazy"
        src={icon}
        alt=""
        className="object-contain shrink-0 w-6 aspect-square"
      />
      <div className="flex-auto my-auto">{label}</div>
    </div>
  );
};
