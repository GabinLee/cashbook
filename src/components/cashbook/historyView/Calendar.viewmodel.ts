import { useEffect, useRef, useState } from "react"
import moment from "moment"
import { useParams } from "react-router-dom"
import CashbookHistory from "../../../models/CashbookHistory.model"
import { CashbookApi } from "../../../api/Cashbook.api"
import { CalendarViewProps } from "./CalendarView"


export default function CalendarViewModel(props: CalendarViewProps) {
  const {id} = useParams();

  const [historyList, setHistoryList] = useState<CashbookHistory[]>([]);
  
  const [year, setYear] = useState(props.year)
  const [month, setMonth] = useState(props.month)

  const headList = ['월', '화', '수', '목', '금', '토', '일', 'Settlement'];
  const [dateList, setDateList] = useState<moment.Moment[][]>([]);


  useEffect(() => {
    getHistory();

  }, [id, year, month])

  useEffect(() => {
    setYear(props.year)
    setMonth(props.month)
  }, [props.year, props.month])


  useEffect(() => {
    const startDay = moment(`${year}-${month}`).clone().startOf("month").startOf("week")
    const endDay = moment(`${year}-${month}`).clone().endOf("month").endOf("week")
    
    const day = startDay.clone().subtract(0, "day");
    
    let dateList: moment.Moment[][] = [];

    while (day.isBefore(endDay, "day")) {
      dateList.push(Array(7).fill(0).map(() => day.add(1, "day").clone()));
    }

    setDateList(dateList);
  }, [year, month])

  
  const getHistory = async () => {
    if(id === undefined) return;

    try {
      const result = await CashbookApi.getHistoryList(parseInt(id), year, month);

      console.log('내역 조회 성공', result)

      setHistoryList(result.results);

    } catch (error) {
      console.log(error)
    }
  }


  return {
    historyList, headList, dateList,
    year, month, setYear, setMonth
  }
}