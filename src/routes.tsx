import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Native from "./pages/native";
import Layout from "./components/layout";
import Home from "./pages/home";
import DraggablePage from "./pages/draggable";

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,

    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "app",
        element: <App />,
      },
      {
        path: "native",
        element: <Native />,
      },
      {
        path: "draggable",
        element: <DraggablePage />,
      },
    ],
  },
]);

export default router;