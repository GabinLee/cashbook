import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import './style/reset.scss';
import './style/global.scss';
import { useAppDispatch, useAppSelector } from "./store";
import { setToken, setUser } from "./store/appSlice";
import SignInPage from "./pages/signIn";
import LayoutPage from "./pages/layout";
import MainPage from "./pages/main";
import CashBookPage from "./pages/cashbook";
import SettingsPage from "./pages/settings";


function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const token = useAppSelector(state => state.app.token);
  const user = useAppSelector(state => state.app.user);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token === null) { // 로그인 안한 상황
      dispatch(setToken(null));
    }
    else { // 로그인 이력이 있는 상황
      dispatch(setToken(token));
    }
  }, [])

  useEffect(() => {
    
    if(token === undefined) return;

    if(token !== null){
      getUser();
    }
    else {
      dispatch(setUser(null));
    }
  }, [token])

  useEffect(() => {
    console.log('app - token', token);
    console.log('app - user', user);

    if(user === undefined) return;

    if(user === null) {
      navigate('/sign-in');
    } else {
      if(location.pathname === '/' || location.pathname === '/sign-in') {
        navigate('/')
      }
      else {
        navigate(`${location.pathname}${location.search}`)
      }
    }
  }, [user])
  
  // useEffect(() => {
  //   console.log('app - token', token);
  //   console.log('app - user', user);

  //   if(token === undefined) return;

  //   if(token === null) {
  //     navigate('/sign-in')
  //   } else {
  //     if(location.pathname === '/' || location.pathname === '/sign-in') {
  //       navigate('/')
  //     }
  //     else {
  //       navigate(`${location.pathname}${location.search}`)
  //     }
  //   }
  // }, [token])

  const getUser = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('app - getUser')
      if(response.data.success){
        dispatch(setUser({nickname: response.data.data.nickname, name: response.data.data.name, email: response.data.data.email}));
      } else{
        alert('error');
      }
    }).catch(error => {
      console.log(error);
      dispatch(setUser(null));
    })
  }

  // 랜더링 순서에 의한 문제 발생으로 추가
  if(user === undefined) return (<></>);

  return (
    <Routes>
      <Route path="sign-in" element={<SignInPage />} />

      <Route path="/" element={<LayoutPage />}>
        <Route path="" element={<MainPage />} />
        <Route path="/:id" element={<CashBookPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
