import { useEffect, useState } from "react";
import { Container } from "./styles";
import CashbookHome from "../../component/cashbook/HomeView";
import ListView from "../../component/cashbook/ListView";
import CashbookStatistics from "../../component/cashbook/StatisticsView";
import SettingsView from "../../component/cashbook/SettingsView";
import { useParams, useSearchParams } from "react-router-dom";


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
        >Statistics</button>
        <button
          type="button"
          className={activeTab === 4 ? 'active' : ''}
          onClick={() => setSearchParams({tab: '4'})}
        >Settings</button>
      </div>

      {activeTab === 1 && (
        <CashbookHome />
      )}

      {activeTab === 2 && (
        <ListView />
      )}

      {activeTab === 3 && (
        <CashbookStatistics />
      )}

      {activeTab === 4 && (
        <SettingsView />
      )}
    </Container>
  )
}