import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Layout from "./components/layout";
import DndNativeCorners from "./pages/dnd-native-closest-corners";
import DndNativeDistance from "./pages/dnd-native-distance";
import DndNativeDroppable from "./pages/dnd-native-droppable";
import DraggablePage from "./pages/draggable";
import Home from "./pages/home";
import Native from "./pages/native";
import OverlapTest from "./pages/test";

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
        path: "test",
        element: <OverlapTest />,
      },
      {
        path: "dnd-native-distance",
        element: <DndNativeDistance />,
      },
      {
        path: "dnd-native-droppable",
        element: <DndNativeDroppable />,
      },
      {
        path: "dnd-native-corners",
        element: <DndNativeCorners />,
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
