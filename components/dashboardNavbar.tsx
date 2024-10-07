"use client";
import React from "react";
import { FaCog } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

function DashboardNavbar() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col justify-between h-screen p-4 w-80 bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg shadow-gray-500">
      <div className="flex flex-col items-center">
        {session?.user?.image && (
          <div className="flex items-center mb-4">
            <Image
              src={session.user.image}
              alt="User profile"
              width={50}
              height={50}
              className="rounded-full shadow-2xl"
            />
            <span className="ml-4 text-m font-semibold text-gray-800">{session.user.email}</span>
          </div>
        )}
        <nav className="mb-4">
          <NavItem icon={<FaCog className="text-xl text-gray-800" />} label="Edit Profile" />
        </nav>
      </div>
      <button
        className="bg-white rounded-full border border-gray-200 text-gray-800 px-4 py-2 flex items-center space-x-2 hover:bg-gray-200 transform hover:translate-y-1 hover:shadow-2xl transition-all duration-300"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        {session?.user?.image && (
          <img className="h-8 w-8 rounded-full shadow-md" src={session.user.image} alt="User profile" />
        )}
        <span className="font-semibold">Logout</span>
      </button>
    </div>
  );
}

const NavItem = ({ icon, label }) => (
  <div className="mb-2 hover:bg-gray-300 rounded-full py-2 px-4 flex items-center space-x-2 shadow-sm transform transition-all duration-200 active:scale-95">
    {icon}
    <span className="font-semibold text-gray-800">{label}</span>
  </div>
);

export default DashboardNavbar;
