import { lazy } from "react";
const Login = lazy(() => import("../pages/auth/Login"));

//lazy loading
const routes = [
  {
    path: "*",
    component: Login,
  },
];

export default routes;
