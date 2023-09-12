import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import moment from "moment"
import { CashbookApi } from "../../../api/Cashbook.api"
import CashbookHistory from "../../../models/CashbookHistory.model"
import FirstCategory, { SecondCategory, ThirdCategory } from "../../../models/Category.model"
import PaymentMethod from "../../../models/PaymentMethod.model"
import { ModalData } from "../../../models/Modal.model"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { StatisticsViewProps } from "./StatisticsView"


export default function StatisticsViewModel(props: StatisticsViewProps) {
  const {id} = useParams()

  const [year, setYear] = useState(props.year)
  const [month, setMonth] = useState(props.month)

  const [historyList, setHistoryList] = useState<CashbookHistory[]>([])
  const [cateogryList, setCategoryList] = useState<FirstCategory[]>([])


  const [expenseHistory, setExpenseHistory] = useState<CashbookHistory[]>([])
  const [expenseSecondNameArray, setExpenseSecondNameArray] = useState<string[]>([])
  const [incomeHistory, setIncomeHistory] = useState<CashbookHistory[]>([])
  const [incomeSecondNameArray, setIncomeSecondNameArray] = useState<string[]>([])  
  const [savingHistory, setSavingHistory] = useState<CashbookHistory[]>([])
  const [savingSecondNameArray, setSavingSecondNameArray] = useState<string[]>([])
  
  const backgroundColor1 = ['#fe7877bf', '#f7d021bf','#2dcc70bf', '#5fa9ffbf', '#c29effbf']
  const backgroundColor2 = ['#fe7877bf', '#fd925ebf', '#FCB100bf', '#f7d021bf', '#88e18ebf', '#6AD922bf', '#2dcc70bf', '#99e1ffbf','#55CDFFbf', '#5fa9ffbf', '#c29effbf', '#8e77bbbf', '#fb88ffbf', '#B79470bf']


  useEffect(() => {
    getCategory();
  }, [id])

  useEffect(() => {
    setYear(props.year)
    setMonth(props.month)
  }, [props.year, props.month])

  useEffect(() => {
    getHistory();
  }, [id, year, month])

  useEffect(() => {
    cateogryList.filter(first => first.name === "지출").forEach(v => {
      setExpenseSecondNameArray(v.secondCategoryList.map(v => v.name))
    })
    cateogryList.filter(first => first.name === "수입").forEach(v => {
      setIncomeSecondNameArray(v.secondCategoryList.map(v => v.name))
    })
    cateogryList.filter(first => first.name === "저축").forEach(v => {
      setSavingSecondNameArray(v.secondCategoryList.map(v => v.name))
    })
  }, [cateogryList])

  useEffect(() => {
    setExpenseHistory(historyList.filter(v => v.firstCategory?.name === '지출'))
    setIncomeHistory(historyList.filter(v => v.firstCategory?.name === '수입'))
    setSavingHistory(historyList.filter(v => v.firstCategory?.name === '저축'))
  }, [historyList])
  

  const getCategory = async () => {
    if(id === undefined) return;

    try {
      const result = await CashbookApi.getCategoryList(parseInt(id))

      console.log('카테고리 조회 성공', result)

      setCategoryList(result)

    } catch (error) {
      console.log(error)
    }
  }

  const getHistory = async () => {
    if(id === undefined) return;

    try {
      const result = await CashbookApi.getHistoryList(parseInt(id), year, month);

      console.log('내역 조회 성공', result)

      setHistoryList(result.results)
      // setFilteredHistoryList(response.data.data.results)

    } catch (error) {
      console.log(error)
    }
  }


  // chart
  ChartJS.register(ArcElement, Tooltip, Legend);

  const expenseData = {
    labels: expenseSecondNameArray,
    datasets: [
      {
        data: expenseSecondNameArray.map(categoryName => (
          expenseHistory.filter(history => history.secondCategory?.name === categoryName).map(v => v.price).reduce((price, cur) => price + cur, 0)
        )),
        backgroundColor: expenseSecondNameArray.length < 6 ? backgroundColor1 : backgroundColor2,
        borderColor: [
          '#f5f5f5'
        ],
        borderWidth: 2,
      }
    ]
  }

  const incomeData = {
    labels: incomeSecondNameArray,
    datasets: [
      {
        data: incomeSecondNameArray.map(categoryName => (
          incomeHistory.filter(history => history.secondCategory?.name === categoryName).map(v => v.price).reduce((price, cur) => price + cur, 0)
        )),
        backgroundColor: incomeSecondNameArray.length < 6 ? backgroundColor1 : backgroundColor2,
        borderColor: [
          '#f5f5f5'
        ],
        borderWidth: 2,
      }
    ]
  }

  const savingData = {
    labels: savingSecondNameArray,
    datasets: [
      {
        data: savingSecondNameArray.map(categoryName => (
          savingHistory.filter(history => history.secondCategory?.name === categoryName).map(v => v.price).reduce((price, cur) => price + cur, 0)
        )),
        backgroundColor: savingSecondNameArray.length < 6 ? backgroundColor1 : backgroundColor2,
        borderColor: [
          '#f5f5f5'
        ],
        borderWidth: 2,
      }
    ]
  }

  return {
    year, month, setYear, setMonth,
    expenseHistory, incomeHistory, savingHistory,
    expenseSecondNameArray, incomeSecondNameArray, savingSecondNameArray,
    expenseData, incomeData, savingData
  }
}