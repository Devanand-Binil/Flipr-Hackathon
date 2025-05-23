// src/router/routes/public.jsx
import Home from "../../pages/Home";
import SignInPage from "../../pages/SignInPage";

const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
{
  path: "/sign-in",
  element: <SignInPage />,
},
];

export default publicRoutes;
