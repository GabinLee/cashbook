import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "./styles";
import Cashbook from "../../models/Cashbook.model";
import EditCashbookModal from "../../component/home/EditCashbookModal";



export default function HomePage() {
  const navigate = useNavigate();

  const [cashbookList, setCashbookList] = useState<Cashbook[]>([])
  const [showEditCashbook, setShowEditCashbook] = useState(false)
  const [selectedCashbook, setSelectedCashbook] = useState<Cashbook>()
  
  const tokenRef = useRef('')
  
  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''
    
    if(tokenRef.current !== '' && tokenRef.current !== null) {
      getCashbookList()
    }
  }, [])

  const getCashbookList = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/user/me/cash-book`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('getCashbookList', response.data.data)

        setCashbookList(response.data.data)

      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const addCashbook = (cashbookName: string) => {
    axios.post(`${process.env.REACT_APP_HOST_URL}v1/cash-book`, {
      name: cashbookName
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

  const editCashbook = (id: number, cashbookName: string) => {
    axios.patch(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}`, {
      id: id,
      name: cashbookName
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
    <>
      <Container className="home">
        <button type="button" className="contained main add_cashbook"
          onClick={() => {
            setShowEditCashbook(true)
            setCashbookList(cashbookList.map(value => {
              value.isShowMoreMenu = false
              return value
            }))
          }}
        >캐쉬북 추가하기</button>

        <ul>
        {cashbookList.map((cashbook, cIndex) => (
          <li key={`item${cIndex}`}>
            <div className="card"
              onClick={() => {navigate(`/${cashbook.id}`)}}
            >
              <div className="name_more flex">
                <h6 className="flex1">{cashbook.name}</h6>

                <div className="popover">
                  <button type="button" className={`btn more${cashbook.isShowMoreMenu ? ' active' : ''}`}
                    onClick={e => {
                      e.stopPropagation()
                      setCashbookList(cashbookList.map(value => {
                        if(value.id === cashbook.id) value.isShowMoreMenu = !value.isShowMoreMenu
                        return value
                      }))
                    }}
                  />
                  {cashbook.isShowMoreMenu && (
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
                  )}
                </div>
              </div>

              {/* <p className="member">보라돌이, 뚜비, 나나, 뽀</p> */}
            </div>
          </li>
        ))}
        </ul>
      </Container>

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
    </>
  )
}