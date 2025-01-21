import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Layout from "./dashboard/layout/Layout";
import HomeApp from "./Home";
import { getCookie } from "./utils/cookieUtils";

import Dashboard from "./dashboard/Dashboard";
import { DashboardProvider } from "./dashboard/layout/DashboardContext";
import BudgetManager from "./dashboard/budget/BudgetManager";
import TransactionList from "./dashboard/component/TransactionList";
import CategoryManager from "./dashboard/category/CategoryManager";
import ReportGenerator from "./dashboard/report/ReportGenerator";

export default function App() {
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const token = getCookie("auth_token");

    if (!token) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeApp />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashboardProvider>
            <Layout />
          </DashboardProvider>
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Dashboard />,
        },

        {
          path: "transactions",
          element: <TransactionList />,
        },
        {
          path: "categories",
          element: <CategoryManager />,
        },
        {
          path: "budgets",
          element: <BudgetManager />,
        },
        {
          path: "reports",
          element: <ReportGenerator />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
