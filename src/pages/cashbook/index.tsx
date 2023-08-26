import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Container } from "./styles";
import CashbookHome from "../../components/cashbook/HomeView";
import ListView from "../../components/cashbook/ListView";
import CalendarView from "../../components/cashbook/CalendarView";
import CashbookStatistics from "../../components/cashbook/StatisticsView";
import SettingsView from "../../components/cashbook/SettingsView";


export default function CashbookPage() {
  const {id} = useParams()
  const [activeTab, setActiveTab] = useState(1)

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setActiveTab(1)
  }, [id])

  useEffect(() => {
    const tab = searchParams.get('tab');
    if(tab !== null) {
      setActiveTab(parseInt(tab));
    }
  }, [searchParams])
  
  return (
    <Container>
      <div className="tabs">
        <button
          type="button"
          className={activeTab === 1 ? 'active' : ''}
          onClick={() => setSearchParams({tab: '1'})}
        >Home</button>
        <button
          type="button"
          className={activeTab === 2 ? 'active' : ''}
          onClick={() => setSearchParams({tab: '2'})}
        >List</button>
        <button
          type="button"
          className={activeTab === 3 ? 'active' : ''}
          onClick={() => setSearchParams({tab: '3'})}
        >Calendar</button>
        <button
          type="button"
          className={activeTab === 4 ? 'active' : ''}
          onClick={() => setSearchParams({tab: '4'})}
        >Statistics</button>
        <button
          type="button"
          className={activeTab === 5 ? 'active' : ''}
          onClick={() => setSearchParams({tab: '5'})}
        >Settings</button>
      </div>

      {activeTab === 1 && (
        <CashbookHome />
      )}

      {activeTab === 2 && (
        <ListView />
      )}

      {activeTab === 3 && (
        <CalendarView />
      )}

      {activeTab === 4 && (
        <CashbookStatistics />
      )}

      {activeTab === 5 && (
        <SettingsView />
      )}
    </Container>
  )
}