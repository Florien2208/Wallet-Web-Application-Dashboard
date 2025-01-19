// src/components/layout/Sidebar.tsx
import React from "react";
import {

  DollarSign,
 
  Menu,
  LayoutDashboard,
  Tags,
  PieChart,
  FileText,
} from "lucide-react";
import { MenuItem } from "../../types";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const menuItems: MenuItem[] = [
  
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'transactions', icon: DollarSign, label: 'Transactions' },
    { id: 'categories', icon: Tags, label: 'Categories' },
    { id: 'budgets', icon: PieChart, label: 'Budgets' },
    { id: 'reports', icon: FileText, label: 'Reports' },

];

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
}) => {
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
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-800 ${
              activeTab === item.id ? "bg-gray-800" : ""
            }`}
          >
            <item.icon className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-4">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
