// src/components/layout/Navbar.tsx
import React, { useEffect, useState } from "react";
import { Search, Bell,  Plus } from "lucide-react";
import { Notification } from "../../types";
import { getCookie } from "@/utils/cookieUtils";

interface NavbarProps {
  isSidebarOpen: boolean;
  notifications: Notification[];
  setIsAddingTransaction: (adding: boolean) => void;
}
interface UserProfile {
  email: string;
  username: string;
  // Add other profile fields as needed
}
const Navbar: React.FC<NavbarProps> = ({
  isSidebarOpen,
  notifications,
  setIsAddingTransaction,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = () => {
      try {
        const userData = getCookie("user_data");
        if (!userData) {
          throw new Error("No data found");
        }

        // Parse the cookie string into an object
        const parsedUserData =
          typeof userData === "string" ? JSON.parse(userData) : userData;

        // Set profile from parsed data
        setProfile(parsedUserData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
console.log(profile)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed top-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 ${
        isSidebarOpen ? "left-64" : "left-20"
      }`}
    >
      <h2 className="text-xl font-semibold">{profile?.username} Finance Management</h2>
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsAddingTransaction(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="mr-2" /> Add Transaction
        </button>
        <div className="relative">
          <Bell className="cursor-pointer" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
