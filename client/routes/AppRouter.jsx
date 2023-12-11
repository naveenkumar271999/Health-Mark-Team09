import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ErrorPage from '../utils/ErrorBoundary/ErrorPage';
import Home from '../src/components/Pages/Home/Home';
import Login from '../src/components/Pages/Login/Login';
import Register from '../src/components/Pages/Register/Register';
import VerifyEmail from '../src/components/Pages/VerifyEmail/VerifyEmail';
import SetNewPassword from '../src/components/Pages/SetNewPassword/SetNewPassword';
import PasswordResetInstructions from '../src/components/Pages/PasswordResetInstructions/PasswordResetInstructions';
import SendPasswordResetMail from '../src/components/Pages/SendPasswordResetMail/SendPasswordResetMail';
import UserProfile from '../src/components/Pages/UserProfile/UserProfile';
import Admin from '../src/components/Pages/Admin/Admin';
import Vendor from '../src/components/Pages/Vendor/Vendor';
import Doctor from '../src/components/Pages/Doctor/Doctor';

const AppRouter = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.user?.role);
  const storedToken = localStorage.getItem('authToken');

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={((isAuthenticated && !!storedToken) ?
          (
            role === 'admin' ? <Admin /> :
              (
                role === 'user' ? <Home /> :
                  (
                    role === 'doctor' ? <Doctor /> :
                      (
                        role === 'vendor' ? <Vendor /> :
                          <Home />
                      )
                  )
              )
          ) : <Login />)} />
        <Route path='/register' element={isAuthenticated ? <Home /> : <Register />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />
        <Route path="/sendPasswordResetMail" element={<SendPasswordResetMail />} />
        <Route path="/passwordResetInstructions/:email" element={<PasswordResetInstructions />} />
        <Route path="/setNewPassword/:passwordResetToken" element={<SetNewPassword />} />
        <Route path="/userProfile" element={isAuthenticated ? <UserProfile /> : <Login />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
