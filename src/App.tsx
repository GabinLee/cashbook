import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import './style/reset.scss';
import './style/global.scss';
import SignInPage from "./pages/signIn";
import MainPage from "./pages/main";
import HomePage from "./pages/home";
import CashBookPage from "./pages/cashbook";
import SettingsPage from "./pages/settings";


function App() {
  const tokenRef = useRef('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''

  }, [])

  useEffect(() => {
    const token = tokenRef.current
    
    if(token === undefined) return

    if(token === null || token === '') {
      navigate('/sign-in')
    } else {
      if(location.pathname === '/' || location.pathname === '/sign-in') {
        navigate('/')
      }
      else {
        navigate(`${location.pathname}`)
      }
    }

  }, [tokenRef.current])


  return (
    <Routes>
      <Route path="sign-in" element={<SignInPage />} />

      <Route path="" element={<MainPage />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/:id" element={<CashBookPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
      </Route>
    </Routes>
  );
}

export default App;
