import React from "react";

interface NavItemProps {
  icon: string;
  label: string;
  active: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ icon, label, active }) => {
  return (
    <div
      className={`flex gap-3 items-center px-3 py-2 w-full ${
        active
          ? "font-medium whitespace-nowrap bg-indigo-600 rounded-lg"
          : "mt-2 rounded-lg"
      }`}
    >
      <img
        loading="lazy"
        src={icon}
        alt=""
        className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
      />
      <div className="flex-1 shrink self-stretch my-auto basis-0">{label}</div>
    </div>
  );
};
