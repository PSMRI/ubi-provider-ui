import { lazy } from "react";
const Home = lazy(() => import("../pages/Home"));
const CreateForm = lazy(() => import("../pages/CreateBenefitForm"));

//lazy loading
const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/create",
    component: CreateForm,
  },
];

export default routes;
