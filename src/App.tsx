import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import './style/reset.scss';
import './style/global.scss';
import SignInPage from "./pages/signIn";
import LayoutPage from "./pages/layout";
import MainPage from "./pages/main";
import CashBookPage from "./pages/cashbook";
// // import HomePage from "./pages/home";
// import SettingsPage from "./pages/settings";


function App() {
  const tokenRef = useRef('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''

    console.log('APP - token', tokenRef.current)

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
        // console.log(location);
        navigate(`${location.pathname}${location.search}`)
      }
    }

  }, [tokenRef.current])


  return (
    <Routes>
      <Route path="sign-in" element={<SignInPage />} />

      <Route path="" element={<LayoutPage />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/:id" element={<CashBookPage />} />
        {/* <Route path="/settings" element={<SettingsPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
