import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Container } from "./styles";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Cashbook from "../../models/Cashbook.model";
import EditCashbookModal from "../../component/EditCashbookModal";


export default function LayoutPage() {
  const {id} = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const tokenRef = useRef('')

  const [cashbookList, setCashbookList] = useState<Cashbook[]>([])
  const [userNickname, setUserNickname] = useState('')
  const [userSocialId, setUserSocialId] = useState('')
  
  const [showEditCashbook, setShowEditCashbook] = useState(false)
  const [selectedCashbook, setSelectedCashbook] = useState<Cashbook>()


  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''
  }, [])

  useEffect(() => {
    if(localStorage.getItem('user') !==  null && localStorage.getItem('user') !== ''){
      const user = JSON.parse(`${localStorage.getItem('user')}`)

      setUserNickname(user.nickname)
      setUserSocialId(user.socialId)
    }

    if(tokenRef.current !== '' && tokenRef.current !== null){
      getCashbookList();
      getUser();
    }
  }, [id])

  const getCashbookList = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/user/me/cash-book`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        setCashbookList(response.data.data)
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
        setUserNickname(response.data.data.nickname)
        setUserSocialId(response.data.data.socialId)
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const signout = () => {
    localStorage.setItem('token', '')
    setUserNickname('')
    setUserSocialId('')
    navigate('/sign-in')
  }

  const addCashbook = (cashbookName: string, isGroup: boolean) => {
    axios.post(`${process.env.REACT_APP_HOST_URL}v1/cash-book`, {
      name: cashbookName,
      isGroup: isGroup
    }, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('addCashbook 성공')
        setShowEditCashbook(false)
        getCashbookList()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const editCashbook = (id: number, cashbookName: string, isGroup: boolean) => {
    axios.patch(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}`, {
      id: id,
      name: cashbookName,
      isGroup: isGroup
    }, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('editCashbook')
        setShowEditCashbook(false)
        setSelectedCashbook(undefined)
        getCashbookList()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const deleteCashbook = (id: number) => {
    axios.delete(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success) {
        console.log('deleteCashbook')
        getCashbookList()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }


  return (
    <Container>
      <div className="header_nav">
        <header>
          <button type="button" className=""
            onClick={e => navigate('/')}
          >
            <img src="images/logo_white.svg" alt="로고 이미지" />
          </button>
        </header>

        <nav>
          {cashbookList.map((cashbook, nIndex) => (
            <div
              key={`navCashbook ${nIndex}`}
              className={`btn_nav${(cashbook.isActive || (location.pathname === `/${cashbook.id}`)) ? ' active' : ''}`}
              onClick={e => {
                navigate(`/${cashbook.id}`)
              }}
              onMouseOver={e => {
                setCashbookList(cashbookList.map((v, i) => {
                  if(nIndex === i) v.isActive = true
                  return v
                }))
              }}
              onMouseOut={e => {
                setCashbookList(cashbookList.map((v, i) => {
                  if(nIndex === i) v.isActive = false
                  return v
                }))
              }}
            >
              <img src={`images/nav_ic/cashbook${(cashbook.isActive || (location.pathname === `/${cashbook.id}`)) ? '_main' : ''}.svg`} alt={cashbook.name} />
              <span className="flex1">{cashbook.name}</span>

              <div className="popover">
                <button type="button" className={`btn_ic more${cashbook.isShowMoreMenu ? ' active' : ''}`}
                  onClick={e => {
                    e.stopPropagation()
                    setCashbookList(cashbookList.map(value => {
                      if(value.id === cashbook.id) value.isShowMoreMenu = !value.isShowMoreMenu
                      return value
                    }))
                  }}
                />
                <div className="popover_menu">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      setShowEditCashbook(true)
                      setSelectedCashbook(cashbook)
                      setCashbookList(cashbookList.map(value => {
                        value.isShowMoreMenu = false
                        return value
                      }))
                    }}
                  >수정</button>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      deleteCashbook(cashbook.id)
                    }}
                  >삭제</button>
                </div>
              </div>
            </div>
          ))}

          {/* <button
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
          </button> */}
        </nav>

        <div className="area add_cashbook">
          <button type="button" className="contained main"
            onClick={() => {
              setShowEditCashbook(true)
              setCashbookList(cashbookList.map(value => {
                value.isShowMoreMenu = false
                return value
              }))
            }}
          >캐쉬북 추가하기</button>
        </div>
        
        <div className="area profile flex ai-c">
          <p className="flex1">{userNickname}</p>
          <button className="fs12"
            onClick={() => signout()}
          >로그아웃</button>
        </div>
      </div>

      <Outlet />

      {showEditCashbook && (
        <EditCashbookModal
          cashbook={selectedCashbook}
          onClickCancel={() => {
            setShowEditCashbook(false)
            setSelectedCashbook(undefined)
          }}
          addCashbook={addCashbook}
          editCashbook={editCashbook}
        />
      )}
    </Container>
  )
}