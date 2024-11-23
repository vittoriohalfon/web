"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItemProps {
  icon: string;
  label: string;
  isLogout?: boolean;
  onClick?: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ icon, label, isLogout = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex gap-2 items-center px-4 py-2.5 w-full bg-white ${
        isLogout ? "text-red-600 border-t border-solid border-t-zinc-300" : "text-neutral-950"
      }`}
      tabIndex={0}
      aria-label={label}
    >
      <img
        loading="lazy"
        src={icon}
        alt=""
        className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
      />
      <span className="flex-1 shrink self-stretch my-auto basis-0">{label}</span>
    </button>
  );
};

const navigationItems = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/6e96891238ba811e21b60970c4579d00bc1d34f2f6eff6c30be8203f87055791?apiKey=27ce83af570848e9b22665bc31a03bc0&",
    label: "Subscription"
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/48f73ac65e0b752fddf55cb1dbd9bb6a34f0d50c4d101e937222771001b50345?apiKey=27ce83af570848e9b22665bc31a03bc0&",
    label: "Logout",
    isLogout: true
  }
];

const navItems = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/19d02f7ec1d4dd004a533622f4f55be643260fa14716660a4b48ab27b5be172e?apiKey=27ce83af570848e9b22665bc31a03bc0&",
    label: "Home",
    path: "/dashboard",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/501daf0f5e7ebe4b04690fdbdf683e377210318b121a880722a2e28a083d2683?apiKey=27ce83af570848e9b22665bc31a03bc0&",
    label: "My Tenders",
    path: "/my-tenders",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/3d298ce2bb58f794c4e52b12b6cd4fca843f4dbe88f195606449c94caaac4de3?apiKey=27ce83af570848e9b22665bc31a03bc0&",
    label: "Profile",
    path: "/company-profile",
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubscription = () => {
    // Handle subscription logic
    console.log("Subscription clicked");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log("Logout clicked");
    setIsDropdownOpen(false);
  };

  return (
    <aside className="flex fixed top-0 left-0 z-10 flex-col px-4 pt-4 pb-8 h-auto min-h-screen bg-indigo-700 min-w-[240px] w-[312px] max-md:pb-24">
      <div className="flex gap-10 justify-between px-2 w-full min-h-[35px] relative">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/b076d6349980020e4d366e9fc2fd20689191596aa6b5a95042d7234934305016?apiKey=27ce83af570848e9b22665bc31a03bc0&"
          alt="Company logo"
          className="object-contain shrink-0 aspect-[3.09] w-[108px]"
        />
        <button
          ref={buttonRef}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="cursor-pointer"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/ff95333ad0e3117d2d91da798dc69063004adaae58e73d5c088e39ad426c6411?apiKey=27ce83af570848e9b22665bc31a03bc0&"
            alt="Menu icon"
            className="object-contain shrink-0 my-auto w-6 aspect-square"
          />
        </button>

        {isDropdownOpen && (
          <div 
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-[280px] rounded-lg shadow-lg overflow-hidden"
          >
            <NavigationItem
              icon={navigationItems[0].icon}
              label={navigationItems[0].label}
              onClick={handleSubscription}
            />
            <NavigationItem
              icon={navigationItems[1].icon}
              label={navigationItems[1].label}
              isLogout
              onClick={handleLogout}
            />
          </div>
        )}
      </div>
      <nav className="flex flex-col gap-2 pt-8 mt-6 w-full text-base text-white border-t border-solid border-t-indigo-300">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className={`flex gap-3 items-center px-3 py-2 w-full whitespace-nowrap rounded-lg text-white no-underline hover:bg-indigo-600 ${
              pathname === item.path ? "bg-indigo-600 font-medium" : ""
            }`}
          >
            <img
              loading="lazy"
              src={item.icon}
              alt=""
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
            <div className="flex-1 shrink self-stretch my-auto basis-0">
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
