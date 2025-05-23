// src/router/mainRouter.tsx
import { useRoutes } from "react-router-dom";
import { Suspense, lazy } from "react";
import publicRoutes from "./routes/public";
import privateRoutes from "./routes/private";
import adminRoutes from "./routes/admin";
import Loader from "../components/ui/Loader"; 

const NotFound = lazy(() => import("../pages/NotFound"));

const MainRouter = () => {
  const routing = useRoutes([
    ...publicRoutes,
    ...privateRoutes,
    ...adminRoutes,
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <Suspense fallback={<Loader />}>
      {routing}
    </Suspense>
  );
};

export default MainRouter;
