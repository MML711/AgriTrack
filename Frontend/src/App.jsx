import { Layout } from "./routes/layout/layout";
import Dashboard from "./routes/dashboard/dashboard"
import HomePage from "./routes/homePage/homePage"
import ProductPage from "./routes/productPage/productPage"
import Login from "./routes/login/login"
import Register from "./routes/register/register"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Cart from "./routes/cart/cart";
import Success from "./routes/Success";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/products",
          element: <ProductPage />,
        },
        {
          path: "/products/:id",
          element: <ProductPage />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/success",
          element: <Success />,
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;