import { Pie } from "react-chartjs-2"
import { addComma } from "../../../utils/Utils"
import StatisticsViewModel from "./Statistics.viewmodel"
import { StatisticsViewContainer } from "./styles"


export type StatisticsViewProps = {
  year: string
  month: string
}

export default function StatisticsView(props: StatisticsViewProps) {

  const viewModel = StatisticsViewModel(props);

  return (
    <StatisticsViewContainer className="main_cont">
      <div className="card">
        {viewModel.expenseHistory.length === 0 && (
          <p className="data-none">지출 내역이 없습니다.</p>
        )}
        {viewModel.expenseHistory.length !== 0 &&  (
          <>
            <div className="chart_bx">
              <div className="chart_wrap">
                <Pie
                  data={viewModel.expenseData}
                />
              </div>
            </div>
            <ul className="list_bx">
              {viewModel.expenseSecondNameArray.map((item, index) => (
                <li key={`item${index}`} className="flex">
                  <p className="flex1">{item}</p>
                  <p>{addComma(viewModel.expenseHistory.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0))}</p>
                  {/* <p className="badge flex-c fs12" style={{backgroundColor: expenseBgColor[index]}}>{Math.round((historyExpense.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0) / historyExpense.map(v => v.price).reduce((price, curr) => price + curr, 0))*100)}%</p> */}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="card">
        {viewModel.savingHistory.length === 0 && (
          <p className="data-none">저축 내역이 없습니다.</p>
        )}
        {viewModel.savingHistory.length !== 0 && (
          <>
            <div className="chart_bx">
              <div className="chart_wrap">
                <Pie
                  data={viewModel.savingData}
                />
              </div>
            </div>
            <ul className="list_bx">
              {viewModel.savingSecondNameArray.map((item, index) => (
                <li key={`item${index}`} className="flex">
                  <p className="flex1">{item}</p>
                  <p>{addComma(viewModel.savingHistory.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0))}</p>
                  {/* <p className="badge flex-c fs12" style={{backgroundColor: savingBgColor[index]}}>{Math.round((historySaving.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0) / historySaving.map(v => v.price).reduce((price, curr) => price + curr, 0))*100)}%</p> */}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="card">
        {viewModel.incomeHistory.length === 0 && (
          <p className="data-none">수입 내역이 없습니다.</p>
        )}
        {viewModel.incomeHistory.length !== 0 && (
          <>
          <div className="chart_bx">
            <div className="chart_wrap">
              <Pie
                data={viewModel.incomeData}
              />
            </div>
          </div>
          <ul className="list_bx">
            {viewModel.incomeSecondNameArray.map((item, index) => (
              <li key={`item${index}`} className="flex">
                <p className="flex1">{item}</p>
                <p>{addComma(viewModel.incomeHistory.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0))}</p>
                {/* <p className="badge flex-c fs12" style={{backgroundColor: incomeBgColor[index]}}>{Math.round((historyIncome.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0) / historyIncome.map(v => v.price).reduce((price, curr) => price + curr, 0))*100)}%</p> */}
              </li>
            ))}
          </ul>
          </>
          )}
      </div>
    </StatisticsViewContainer>
  )
}