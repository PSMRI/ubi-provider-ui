import { lazy } from "react";
import ViewApplicants from "../pages/benefits/viewAllBenefit/ApplicantDetails";
import ApplicationDetails from "../pages/benefits/viewAllBenefit/ApplicationDetails";
import BenefitFormUI from "../pages/benefits/benefitFormUI/BenefitFormUI";
const BenefitsForm = lazy(() => import("../pages/benefits/form/Form"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

const ViewAllBenefits = lazy(
  () => import("../pages/benefits/viewAllBenefit/ViewAllBenefits")
);

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
    path: "/benefit_list",
    component: ViewAllBenefits,
  },
  {
    path: "/:id/applicants_list",
    component: ViewApplicants,
  },
  {
    path: "/application_detail/:id",
    component: ApplicationDetails,
  },
  {
    path: "/provider.com/:id/apply",
    component: BenefitFormUI,
  },
  // {
  //   path: "*",
  //   component: Dashboard,
  // },
];

export default routes;
