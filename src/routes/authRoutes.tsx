import { lazy } from "react";
import MultiStepTimelineAccordion from "../components/common/MultiStepForm";
const Home = lazy(() => import("../pages/Home"));
const BenefitsForm = lazy(() => import("../pages/benefits/form/Form"));
const BenefitSummary = lazy(() => import("../pages/dashboard/BenefitSummary"));
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
    path: "/*",
    component: Home,
  },
];

export default routes;
