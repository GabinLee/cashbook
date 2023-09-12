import moment from "moment"
import { addComma } from "../../../utils/Utils"
import CalendarViewModel from "./Calendar.viewmodel"
import { CalendarViewContainer } from "./styles"


export type CalendarViewProps = {
  year: string
  month: string
}

export default function CalendarView(props: CalendarViewProps) {

  const viewModel = CalendarViewModel(props)


  return (
    <CalendarViewContainer className="main_cont card">
      <ul className="area_head">
        {viewModel.headList.map((head, hIndex) => (
          <li key={`head${hIndex}`} className="fs12">{head}</li>
        ))}
      </ul>

      <div className="area_body">
        {viewModel.dateList.map((week, wIndex) => (
          <ul key={`week${wIndex}`} className="flex flex1">
            {week.map((date, dIndex) => (
              <li key={`date${dIndex}`}>
                {(date.format('YYYY') === viewModel.year) && date.format('MM') === viewModel.month && (
                  <>
                  <p className="date">{date.format('D')}</p>
                  {viewModel.historyList.filter(v => moment(v.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')).map((history, hIndex) => (
                    <div key={`history${wIndex}-${hIndex}`} className={`row flex jc-sb ${history.firstCategory?.name === '지출' ? 'expense' : history.firstCategory?.name === '수입' ? 'income' : 'saving'}`}>
                      <p className="description">{history.description}</p>
                      <p className="price">{addComma(history.price)}</p>
                    </div>
                  ))}
                  </>
                )}
              </li>
            ))}
            {/* <li>memo</li> */}
            <li>
              <div>
                {/* {thisMonthHistoryList.filter(v => getWeek(moment(v.date)) === wIndex+1).filter(v => v.secondCategory?.name === )} */}


                {/* <p>{addComma(expenseList.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0))}</p> */}
                {/* {historyList.filter(v => getWeek(moment(v.date)) === wIndex+1).map(v => v.description)} */}
              </div>
            </li>
          </ul>
        ))}
      </div>
    </CalendarViewContainer>
  )
}