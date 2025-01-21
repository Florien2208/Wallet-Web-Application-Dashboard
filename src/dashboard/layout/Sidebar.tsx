import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DollarSign,
  Menu,
  LayoutDashboard,
  Tags,
  PieChart,
  FileText,
  LogOut,
} from "lucide-react";
import { MenuItem } from "../../types";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "",
  },
  {
    id: "transactions",
    icon: DollarSign,
    label: "Transactions",
    path: "transactions",
  },
  { id: "categories", icon: Tags, label: "Categories", path: "categories" },
  { id: "budgets", icon: PieChart, label: "Budgets", path: "budgets" },
  { id: "reports", icon: FileText, label: "Reports", path: "reports" },
];

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,

  setActiveTab,
}) => {
  const location = useLocation();

  const handleLogout = () => {
    // Clear cookies
    document.cookie =
      "auth_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie = "user_data=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    // Refresh the page or redirect to login
    window.location.reload();
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <h1 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>
          MyWallet
        </h1>
        <Menu
          className="cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
      <div className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-800 ${
              location.pathname === item.path ? "bg-gray-800" : ""
            }`}
          >
            <item.icon className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-4">{item.label}</span>}
          </Link>
        ))}
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700"
          >
            <LogOut
              className={`w-5 h-5 mr-2${isSidebarOpen ? "hidden" : "hidden"} `}
            />
            {isSidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
