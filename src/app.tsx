
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import Layout from "./dashboard/layout/Layout";
import HomeApp from "./Home";
import { getCookie } from "./utils/cookieUtils";

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
          <Layout />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <div>
      
        <RouterProvider router={router} />
    </div>
  );
}
