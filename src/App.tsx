import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import './style/reset.scss';
import './style/global.scss';
import SignInPage from "./pages/signIn";
import MainPage from "./pages/main";
import HomePage from "./pages/home";
import CashBookPage from "./pages/cashbook";
import SettingsPage from "./pages/settings";


function App() {

  useEffect(() => {
    // const token = localStorage.getItem('token')
    // console.log('토큰', token)
  }, [])


  return (
    <BrowserRouter>
      <Routes>
        <Route path="sign-in" element={<SignInPage />} />

        <Route path="" element={<MainPage />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/:id" element={<CashBookPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
