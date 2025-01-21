import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AddTransactionModal from "../component/AddTransactionModal";
import { useDashboard } from "./DashboardContext";


const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const {
    isAddingTransaction,
    setIsAddingTransaction,
    notifications,
    accounts,
    categories,
    handleAddTransaction,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <Navbar
        isSidebarOpen={isSidebarOpen}
        notifications={notifications}
        setIsAddingTransaction={setIsAddingTransaction}
      />
      <div className={`pt-24 pb-8 px-8 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <Outlet />
      </div>
      {isAddingTransaction && (
        <AddTransactionModal
          accounts={accounts}
          categories={categories}
          onAdd={handleAddTransaction}
          onClose={() => setIsAddingTransaction(false)}
        />
      )}
    </div>
  );
};

export default Layout;
