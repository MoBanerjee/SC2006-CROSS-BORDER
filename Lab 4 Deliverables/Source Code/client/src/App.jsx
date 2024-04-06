
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import PhonenumOTP from "./pages/PhonenumOTP.jsx";
import AmenitiesFinder from "./pages/Amenities.jsx";
import CurrencyConverter from "./pages/Currency.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import HomeLayout from "./pages/HomeLayout.jsx";
import Logout from "./pages/Logout.jsx";
import NewsComponent from "./pages/News.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import MapWithRoute from "./pages/Navigate.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import TandC from "./pages/T&C.jsx";
import Help from "./pages/HelpManual.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import SecurityQuestion from "./pages/SecurityQ.jsx";
import ChangePhoneNumber from "./pages/ChangePhNum.jsx";
import ProfilePic from "./pages/ProfilePic.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { ToastContainer, toast } from 'react-toastify';
import { UserProvider } from './contexts/UserContext';
import Settings from "./pages/Settings.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "profilepic",
        element: <ProfilePic />,
      },
      {
        path: "changepassword",
        element: <ChangePassword />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "reset",
        element: <ResetPassword />,
      },
      {
        path: "changephonenum",
        element: <ChangePhoneNumber />,
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "tandc",
        element: <TandC />,
      },
      {
        path: "amenities",
        element: <AmenitiesFinder/>,
      },
      {
        path: "navigate",
        element: <MapWithRoute />,
      },
      {
        path: "edit",
        element: <EditProfile />,
      },
      {
        path: "phonenumotp",
        element: <PhonenumOTP />,
      },
      {
        path: "currency",
        element: <CurrencyConverter />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "news",
        element: <NewsComponent/>,
      },
      {
        path: "securityq",
        element: <SecurityQuestion/>,
      }


    ],
  },
]);

function App() {


  return (
    <UserProvider>
        <RouterProvider router={router} />
        <ToastContainer position='top-center' />
    </UserProvider>
  )
}

export default App
