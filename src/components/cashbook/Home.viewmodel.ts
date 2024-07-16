import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import Cashbook from "../../models/Cashbook.model"
import CashbookHistory from "../../models/CashbookHistory.model"
import axios from "axios"


export default function HomeViewModel() {
  const {id} = useParams()
  const tokenRef = useRef('')

  const [cashbookList, setCashbookList] = useState<Cashbook[]>([])
  const [cashbook, setCashbook] = useState<Cashbook>()
  const [historyList, setHistoryList] = useState<CashbookHistory[]>([])

  const [month] = useState(moment().format('YYYY-MM'))
  const [balance, setBalance] = useState(0)
  const [monthlyExpense, setMonthlyExpense] = useState(0)
  const [monthlySaving, setMonthlySaving] = useState(0)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  

  const expenseList = historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '지출')
  const incomeList = historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '수입')
  const savingList = historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '저축')

  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''
  }, [])

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


  const getCashbookList = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/user/me/cash-book`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){

        setCashbookList(response.data.data);
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const getHistory = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}/detail`, {
      params: {
        page: 1,
        pageSize: 100
      },
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success) {
        // console.log('내역 조회 성공', response.data.data.results)

        setHistoryList(response.data.data.results);
        
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
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