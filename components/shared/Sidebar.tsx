"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <aside className="flex fixed top-0 left-0 z-10 flex-col px-4 pt-4 pb-8 h-auto min-h-screen bg-indigo-700 min-w-[240px] w-[312px] max-md:pb-24">
      <div className="flex gap-10 justify-between px-2 w-full min-h-[35px]">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/b076d6349980020e4d366e9fc2fd20689191596aa6b5a95042d7234934305016?apiKey=27ce83af570848e9b22665bc31a03bc0&"
          alt="Company logo"
          className="object-contain shrink-0 aspect-[3.09] w-[108px]"
        />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/ff95333ad0e3117d2d91da798dc69063004adaae58e73d5c088e39ad426c6411?apiKey=27ce83af570848e9b22665bc31a03bc0&"
          alt="Menu icon"
          className="object-contain shrink-0 my-auto w-6 aspect-square"
        />
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