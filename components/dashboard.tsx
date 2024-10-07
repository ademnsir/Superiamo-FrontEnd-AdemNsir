import React from "react";
import Image from "next/image";

interface DashboardProps {
  user: { image?: string; email?: string; name?: string };
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center border-b border-gray-600 p-4 max-w-2xl">
      {user?.image && (
        <Image
          src={user.image}
          alt="User Image"
          width={80}
          height={80}
          className="rounded-full mb-4"
        />
      )}
      <h3>Welcome to your Dashboard</h3>
      <p>{user?.email}</p>
      <p>{user?.name}</p>
    </div>
  );
};

export default Dashboard;
