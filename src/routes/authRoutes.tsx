import { lazy } from "react";
const Home = lazy(() => import("../pages/Home"));
const BenefitsForm = lazy(() => import("../pages/benefits/form/Form"));

//lazy loading
const routes = [
  {
    path: "/benefits/create",
    component: BenefitsForm,
  },
  {
    path: "/*",
    component: Home,
  },
];

export default routes;
