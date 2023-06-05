import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "./styles";
import CashbookHome from "../../component/cashbook/HomeView";
import ListView from "../../component/cashbook/ListView";
import CashbookStatistics from "../../component/cashbook/StatisticsView";
import SettingsView from "../../component/cashbook/SettingsView";
import CashbookHistory from "../../models/CashbookHistory.model";
import ListView0531 from "../../component/cashbook/ListView0531";


export default function CashbookPage() {
  const {id} = useParams()
  const tokenRef = useRef('')
  
  const [activeTab, setActiveTab] = useState(2)


  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''
    
    // console.log('캐쉬북 페이지 - 토큰ref', tokenRef.current)
  }, [])

  useEffect(() => {
    getCashbook()
  }, [id])

  const getCashbook = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}/detail`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success) {
        // console.log('캐쉬북 조회 성공')
        
        // console.log('캐쉬북 페이지 - response data', response.data.data)

      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }


  return (
    <Container>
      <div className="tabs">
        <button
          type="button"
          className={activeTab === 1 ? 'active' : ''}
          onClick={() => setActiveTab(1)}
        >Home</button>
        <button
          type="button"
          className={activeTab === 2 ? 'active' : ''}
          onClick={() => setActiveTab(2)}
        >List</button>
        {/* <button
          type="button"
          className={activeTab === 3 ? 'active' : ''}
          onClick={() => setActiveTab(3)}
        >Statistics</button> */}
        <button
          type="button"
          className={activeTab === 4 ? 'active' : ''}
          onClick={() => setActiveTab(4)}
        >Settings</button>
      </div>

      {activeTab === 1 && (
        <CashbookHome />
      )}

      {activeTab === 2 && (
        <ListView />
        // <ListView0531 />
      )}

      {/* {activeTab === 3 && (
        <CashbookStatistics />
      )} */}

      {activeTab === 4 && (
        <SettingsView />
      )}
    </Container>
  )
}