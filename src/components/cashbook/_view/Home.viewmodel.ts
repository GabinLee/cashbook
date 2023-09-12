import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import Cashbook from "../../../models/Cashbook.model"
import CashbookHistory from "../../../models/CashbookHistory.model"
import { CashbookApi } from "../../../api/Cashbook.api"
import { UserApi } from "../../../api/User.api"


export default function HomeViewModel() {
  const {id} = useParams()

  const [cashbookList, setCashbookList] = useState<Cashbook[]>([])
  const [cashbook, setCashbook] = useState<Cashbook>()
  const [historyList, setHistoryList] = useState<CashbookHistory[]>([])

  const [year, setYear] = useState(moment().format('YYYY'))
  const [month, setMonth] = useState(moment().format('MM'))

  const [yearMonth] = useState(moment().format('YYYY-MM'))
  const [balance, setBalance] = useState(0)
  const [monthlyExpense, setMonthlyExpense] = useState(0)
  const [monthlySaving, setMonthlySaving] = useState(0)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  

  const expenseList = historyList.filter(v => moment(v.date).format('YYYY-MM') === yearMonth).filter(v => v.firstCategory?.name === '지출')
  const incomeList = historyList.filter(v => moment(v.date).format('YYYY-MM') === yearMonth).filter(v => v.firstCategory?.name === '수입')
  const savingList = historyList.filter(v => moment(v.date).format('YYYY-MM') === yearMonth).filter(v => v.firstCategory?.name === '저축')

  
  useEffect(() => {
    getHistory();
    getCashbookList();
  }, [id])

  useEffect(() => {
    if(cashbookList.length === 0) return;

    if(id === undefined) return;
    
    setCashbook(cashbookList.find(v => v.id === parseInt(id)));
  }, [id, cashbookList])

  useEffect(() => {
    calcBalance();

    setMonthlyExpense(expenseList.map(v => v.price).reduce((price, cur) => price + cur, 0))
    
    setMonthlyIncome(incomeList.map(v => v.price).reduce((price, cur) => price + cur, 0))
    
    setMonthlySaving(savingList.map(v => v.price).reduce((price, cur) => price + cur, 0))
  }, [id, historyList])


  const getCashbookList = async () => {
    try {
      const result = await UserApi.getCashbookList();

      console.log('캐쉬북 리스트 조회 성공', result)
      
      setCashbookList(result)
    } catch (error) {
      console.log(error)
    }
  }

  const getHistory = async () => {
    if(id === undefined) return;

    try {
      const result = await CashbookApi.getHistoryList(parseInt(id), year, month, 0, 0);

      console.log('내역 조회 성공', result)

      setHistoryList(result.results);

    } catch (error) {
      console.log(error)
    }
  }

  const calcBalance = () => {
    let totalExpense = historyList.filter(history => history.firstCategory?.name === '지출').map(history => history.price).reduce((price, cur) => price + cur, 0);
    
    let totalIncome = historyList.filter(history => history.firstCategory?.name === '수입').map(history => history.price).reduce((price, cur) => price + cur, 0);

    setBalance(totalIncome - totalExpense)
  }

  return {
    cashbook, balance,
    monthlyExpense, monthlyIncome, monthlySaving,
    expenseList, incomeList, savingList
  }
}