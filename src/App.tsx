import "./App.css";
import Login from "./pages/login";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Admin from "./pages/adminManagement";
import SiteManagement from "./pages/siteManagement";
import Homepage from "./pages/pageManagement/homepage";
import TopStories from "./pages/pageManagement/topStories";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route index element={<Login />} />
        <Route path="admin" element={<RootLayout />}>
          <Route path="adminManagement" element={<Admin />} />
          <Route path="siteManagement" element={<SiteManagement />} />
          <Route path="homepageManagement" element={<Homepage />} />
          <Route path="topStories" element={<TopStories />} />
        </Route>
      </>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
