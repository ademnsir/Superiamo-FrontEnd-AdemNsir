import React from "react";

interface DashboardProps {
  user: { image?: string; email?: string; name?: string };
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center border-b border-gray-600 p-4 max-w-2xl">
      {user?.image && <img src={user.image} alt="User Image" className="h-20 w-20 rounded-full mb-4" />}
      <h3>Welcome to your Dashboard</h3>
      <p>{user?.email}</p>
      <p>{user?.name}</p>
    </div>
  );
};

export default Dashboard;
