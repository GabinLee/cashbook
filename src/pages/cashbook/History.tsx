import { HistoryContainer } from "./styles";
import HistoryViewModel from "./History.viewmodel";
import HistoryTop from "../../components/cashbook/HistoryTop.item";
import ListView from "../../components/cashbook/view/ListView";
import CalendarView from "../../components/cashbook/view/CalendarView";
import StatisticsView from "../../components/cashbook/view/StatisticsView";


export default function HistoryPage() {
  
  const viewModel = HistoryViewModel();
  
  return(
    <HistoryContainer>
      <HistoryTop
        year={viewModel.year}
        month={viewModel.month}
        onChangeYear={viewModel.setYear}
        onChangeMonth={viewModel.setMonth}
      />

      <div className="main_tab">
        <ul>
          <li>
            <button
              type="button"
              className={viewModel.activeTab === 1 ? 'active' : ''}
              onClick={() => viewModel.setSearchParams({tab: '1'})}
            >내역</button>
          </li>
          <li>
            <button
              type="button"
              className={viewModel.activeTab === 2 ? 'active' : ''}
              onClick={() => viewModel.setSearchParams({tab: '2'})}
            >월별</button>
          </li>
          <li>
            <button
              type="button"
              className={viewModel.activeTab === 3 ? 'active' : ''}
              onClick={() => viewModel.setSearchParams({tab: '3'})}
            >통계</button>
          </li>
        </ul>
      </div>

      {viewModel.activeTab === 1 && (
        <ListView
          year={viewModel.year}
          month={viewModel.month}
        />
      )}

      {viewModel.activeTab === 2 && (
        <CalendarView
          year={viewModel.year}
          month={viewModel.month}
        />
      )}

      {viewModel.activeTab === 3 && (
        <StatisticsView
          year={viewModel.year}
          month={viewModel.month}
        />
      )}
    </HistoryContainer>
  )
}