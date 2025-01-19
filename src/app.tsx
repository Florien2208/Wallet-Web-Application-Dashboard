
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./dashboard/layout/Layout";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
    },
    
  ]);

  return (
    <div>
      
        <RouterProvider router={router} />
    </div>
  );
}
