import { lazy } from "react";
const BenefitsForm = lazy(() => import("../pages/benefits/form/Form"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

//lazy loading
const routes = [
  {
    path: "/benefits/form",
    component: BenefitsForm,
  },

  {
    path: "/benefits/create/{id}",
    component: BenefitsForm,
  },
  {
    path: "/home",
    component: Dashboard,
  },

  {
    path: "*",
    component: Dashboard,
  },
];

export default routes;
