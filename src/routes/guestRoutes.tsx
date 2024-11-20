import { lazy } from "react";
const UserRegister = lazy(() => import("../pages/auth/UserRegister"));
const Login = lazy(() => import("../pages/auth/Login"));
const OTP = lazy(() => import("../pages/auth/OTP"));

//lazy loading
const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/otp",
    component: OTP,
  },
  {
    path: "/user/register",
    component: UserRegister,
  },
];

export default routes;
