import Home from "../pages/Home";
import CreateForm from "../components/Form/Form";
//lazy loading
const routes = [
  {
    path: "/",
    element: Home,
  },
  {
    path: "/create",
    element: CreateForm,
  },
];

export default routes;
