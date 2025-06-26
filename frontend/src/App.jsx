import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Feedback from './components/Feedback';
import Forgot from './components/auth/Forgot';
import ResetPassword from './components/auth/ResetPassword';
import Profile from './components/Profile';
import Browse from './components/Browse';
import About from './components/About';
import MealConfirmation from './components/MealConfirmation';
import UpdateConfirmation from './components/UpdateConfirmation';
import MessConnect from './components/admin/MessConnect';
import Announce from './components/admin/Announce';
import Mess from './components/admin/Mess';
import SelectMess from './components/SelectMess';
import Confirmations from './components/admin/Confirmations';
import Adminfeedback from './components/admin/Adminfeedback';
import SetCutoffTime from './components/admin/SetCutoffTime';
import ProtectedRoute from './components/admin/ProtectedRoute';


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot",
    element: <Forgot />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword/>
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/feedback/:id",
    element: <Feedback />,
  },
{
    path: "/browse",
    element: <Browse />,
},
{
  path: "/about-us",
  element: <About/>
},{
  path: "/meal-confirmation",
  element: <MealConfirmation/>
},
{
  path: "/update-meal",
  element : <UpdateConfirmation/>
},
{
  path: "/select-mess",
  element: <SelectMess/>
},
//Admin side paths
{
  path: "/register-mess",
  element : <ProtectedRoute> <MessConnect/> </ProtectedRoute>
},{
  path: "/announcement",
  element :  <Announce/>
},{
  path: "/getMess",
  element: <ProtectedRoute><Mess/> </ProtectedRoute>
},{
  path : "/confirmations",
  element: <ProtectedRoute><Confirmations/></ProtectedRoute>
},{
  path: "/viewFeedback",
  element: <ProtectedRoute><Adminfeedback/></ProtectedRoute>
},{
  path: "/settings/:id",
  element: <ProtectedRoute><SetCutoffTime/></ProtectedRoute>
}
]);
function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App
