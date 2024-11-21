import { lazy } from "react";
const UserRegister = lazy(() => import("../pages/auth/UserRegister"));
const Login = lazy(() => import("../pages/auth/Login"));
const OTP = lazy(() => import("../pages/auth/OTP"));
import BenefitFormUI from "../pages/benefits/benefitFormUI/BenefitFormUI";

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
  {
    path: "/benefit/:id/apply",
    component: BenefitFormUI,
  },
];

export default routes;
