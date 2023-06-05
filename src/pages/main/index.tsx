import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Container } from "./styles";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Cashbook from "../../models/Cashbook.model";


export default function MainPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const tokenRef = useRef('')

  const [navCashbookList, setNavCashbookList] = useState<Cashbook[]>([])
  const [isNavHover, setIsNavHover] = useState(false)

  const [userNickname, setUserNickname] = useState('')
  const [userSocialId, setUserSocialId] = useState('')


  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''
    
    if(localStorage.getItem('user') !==  null){
      const user = JSON.parse(`${localStorage.getItem('user')}`)

      setUserNickname(user.nickname)
      setUserSocialId(user.socialId)
    }

    getCashbookList()
    getUser()
  }, [])


  const getCashbookList = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/user/me/cash-book`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        // console.log('getCashbookList', response.data.data)

        setNavCashbookList(response.data.data)

      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const getUser = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/user/me`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        // console.log('getUser 성공', response.data.data)

        setUserNickname(response.data.data.nickname)
        setUserSocialId(response.data.data.socialId)

        // localStorage.setItem('user', JSON.stringify(response.data.data));
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }


  return (
    <Container>
      <div>
        <header>
          <button type="button" className=""
            onClick={e => navigate('/')}
          >
            <img src="images/logo_white.svg" alt="로고 이미지" />
          </button>
        </header>

        <nav>
          {navCashbookList.map((navCashbook, nIndex) => (
            <button
              type="button"
              key={`navCashbook ${nIndex}`}
              className={(navCashbook.isActive || (location.pathname === `/${navCashbook.id}`)) ? 'active' : ''}
              onClick={e => {
                navigate(`/${navCashbook.id}`)
              }}
              onMouseOver={e => {
                setNavCashbookList(navCashbookList.map((v, i) => {
                  if(nIndex === i) v.isActive = true
                  return v
                }))
              }}
              onMouseOut={e => {
                setNavCashbookList(navCashbookList.map((v, i) => {
                  if(nIndex === i) v.isActive = false
                  return v
                }))
              }}
            >
              <img src={`images/nav_ic/cashbook${(navCashbook.isActive || (location.pathname === `/${navCashbook.id}`)) ? '_main' : ''}.svg`} alt={navCashbook.name} />
              <span>{navCashbook.name}</span>
            </button>
          ))}

          <button
            type="button"
            className={location.pathname === '/settings' ? 'active' : ''}
            onClick={e => {
              navigate('/settings')
            }}
            onMouseOver={() => setIsNavHover(true)}
            onMouseOut={() => setIsNavHover(false)}
          >
            <img src={`images/nav_ic/settings${isNavHover || (location.pathname === '/settings') ? '_main' : ''}.svg`} alt="설정"/>
              <span>설정</span>
          </button>

          {/* {navCashbookList.map((navCashbook, nIndex) => (
            <button
              type="button"
              key={`nav ${nIndex}`}
              className={(location.pathname === navCashbook.path || navCashbook.isActive) ? 'active' : ''}
              onClick={e => {
                navigate(navCashbook.path)
              }}
              onMouseOver={e => {
                setNavCashbookList(navCashbookList.map((v, i) => {
                  if(nIndex === i) v.isActive = true
                  return v
                }))
              }}
              onMouseOut={e => {
                setNavCashbookList(navCashbookList.map((v, i) => {
                  if(nIndex === i) v.isActive = false
                  return v
                }))
              }}
            >
              <img src={`images/nav_ic/${navCashbook.icon}${(location.pathname === navCashbook.path || navCashbook.isActive) ? '_main' : ''}.svg`} alt={navCashbook.name} />
              <span>{navCashbook.name}</span>
            </button>
          ))} */}
        </nav>

        <section className="profile">
          <p>{userNickname}</p>
        </section>
      </div>

      <Outlet />
    </Container>
  )
}