import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import axios from "axios"
import FirstCategory, { SecondCategory } from "../../models/Category.model"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import moment from "moment"
import { Colors } from "../../style/Styles"
import CashbookHistory from "../../models/CashbookHistory.model"
import { addComma } from "../../utils/utils"


export default function CashbookStatistics() {
  const {id} = useParams()
  const tokenRef = useRef('')

  const [month, setMonth] = useState(moment().format('YYYY-MM'))
  const [cateogryList, setCategoryList] = useState<FirstCategory[]>([])
  const [historyList, setHistoryList] = useState<CashbookHistory[]>([])
  const [filteredHistoryList, setFilteredHistoryList] = useState<CashbookHistory[]>([])

  const [expenseSecondList, setExpenseSecondList] = useState<string[]>([])
  const [expensePriceArray, setExpensePriceArray] = useState<number[]>([])
  const [incomeSecondList, setIncomeSecondList] = useState<string[]>([])
  const [incomePriceArray, setIncomePriceArray] = useState<number[]>([])
  const [savingSecondList, setSavingSecondList] = useState<string[]>([])
  const [savingPriceArray, setSavingPriceArray] = useState<number[]>([])

  const historyExpense = filteredHistoryList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '지출').map(v => v)
  const historyIncome = filteredHistoryList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '수입').map(v => v)
  const historySaving = filteredHistoryList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '저축').map(v => v)

  const [expenseBgColor, setExpenseBgColor] = useState<string[]>([]) 
  const [incomeBgColor, setIncomeBgColor] = useState<string[]>([])
  const [savingBgColor, setSavingBgColor] = useState<string[]>([])
  const backgroundColor5 = ['#fe7877bf', '#f7d021bf','#2dcc70bf', '#5fa9ffbf']
  const backgroundColor9 = ['#fe7877bf', '#fd925ebf', '#f7d021bf', '#88e18ebf', '#2dcc70bf', '#99e1ffbf', '#5fa9ffbf', '#c29effbf', '#fb88ffbf']


  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''
  }, [])

  useEffect(() => {
    getCategory();
    getHistory();

    setMonth(moment().format('YYYY-MM'))
  }, [id])

  useEffect(() => {
    setFilteredHistoryList(historyList.filter(v => moment(v.date).format('YYYY-MM') === month))

  }, [month])

  useEffect(() => {
    cateogryList.filter(first => first.name === "지출").forEach(v => {
      setExpenseSecondList(v.secondCategoryList.map(v => v.name))
    })

    cateogryList.filter(first => first.name === "수입").forEach(v => {
      setIncomeSecondList(v.secondCategoryList.map(v => v.name))
    })
    cateogryList.filter(first => first.name === "저축").forEach(v => {
      setSavingSecondList(v.secondCategoryList.map(v => v.name))
    })
  }, [cateogryList])

  useEffect(() => {
    historyList.filter(v => moment(v.date).format('YYYY-MM') === month)

    if(expenseSecondList.length < 5) {
      setExpenseBgColor(backgroundColor5)
    } else{
      setExpenseBgColor(backgroundColor9)
    }
    if(incomeSecondList.length < 5) {
      setIncomeBgColor(backgroundColor5)
    } else{
      setIncomeBgColor(backgroundColor9)
    }
    if(savingSecondList.length < 5) {
      setSavingBgColor(backgroundColor5)
    } else{
      setSavingBgColor(backgroundColor9)
    }

    setExpensePriceArray(expenseSecondList.map(category => (
      historyExpense.filter(historyItem => historyItem.secondCategory?.name === category).map(v => v.price).reduce((price, curr) => price + curr, 0)
    )))

    setIncomePriceArray(incomeSecondList.map(category => (
      historyIncome.filter(historyItem => historyItem.secondCategory?.name === category).map(v => v.price).reduce((price, curr) => price + curr, 0)
    )))

    setSavingPriceArray(savingSecondList.map(category => (
      historySaving.filter(historyItem => historyItem.secondCategory?.name === category).map(v => v.price).reduce((price, curr) => price + curr, 0)
    )))

  }, [historyList])


  const getCategory = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}/trade-category`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('카테고리 조회 성공', response.data.data)

        setCategoryList(response.data.data)
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
        console.log('내역 조회 성공', response.data.data.results)

        setHistoryList(response.data.data.results)
        setFilteredHistoryList(response.data.data.results)
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }


  // chart
  ChartJS.register(ArcElement, Tooltip, Legend);

  const expenseData = {
    labels: expenseSecondList,
    datasets: [
      {
        data: expensePriceArray,
        backgroundColor: expenseBgColor,
        borderColor: [
          '#f5f5f5'
        ],
        borderWidth: 2,
      },
    ],
  }
  const incomeData = {
    labels: incomeSecondList,
    datasets: [
      {
        data: incomePriceArray,
        backgroundColor: incomeBgColor,
        borderColor: [
          '#f5f5f5'
        ],
        borderWidth: 2,
      },
    ],
  }

  const savingData = {
    labels: savingSecondList,
    datasets: [
      {
        data: savingPriceArray,
        backgroundColor: savingBgColor,
        borderColor: [
          '#f5f5f5'
        ],
        borderWidth: 2,
      },
    ],
  }

  return (
    <Container className="contents statistics">
      <div className="input_field standard flex1 month">
        <input type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
        />
      </div>

      <ul className="flex chart_group">
        <li className="card">
          {historyExpense.length !== 0 ?
            <>
            <div className="chart_bx">
              <div className="chart_wrap">
                <Pie
                  data={expenseData}
                />
              </div>
            </div>
            <ul className="list_bx">
              {expenseSecondList.map((item, index) => (
                <li key={`item${index}`} className="flex">
                  <p className="flex1">{item}</p>
                  <p>{addComma(historyExpense.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0))}</p>
                  <p className="badge flex-c fs12" style={{backgroundColor: expenseBgColor[index]}}>{Math.round((historyExpense.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0) / historyExpense.map(v => v.price).reduce((price, curr) => price + curr, 0))*100)}%</p>
                </li>
              ))}
            </ul>
            </>
          : <p className="data-none">지출 내역이 없습니다.</p>}
        </li>

        <li className="card">
          {historySaving.length !== 0 ?
            <>
            <div className="chart_bx">
              <div className="chart_wrap">
                <Pie
                  data={savingData}
                />
              </div>
            </div>
            <ul className="list_bx">
              {savingSecondList.map((item, index) => (
                <li key={`item${index}`} className="flex">
                  <p className="flex1">{item}</p>
                  <p>{addComma(historySaving.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0))}</p>
                  <p className="badge flex-c fs12" style={{backgroundColor: savingBgColor[index]}}>{Math.round((historySaving.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0) / historySaving.map(v => v.price).reduce((price, curr) => price + curr, 0))*100)}%</p>
                </li>
              ))}
            </ul>
            </>
          : <p className="data-none">저축 내역이 없습니다.</p>}
        </li>

        <li className="card">
          {historyIncome.length !== 0 ?
            <>
            <div className="chart_bx">
              <div className="chart_wrap">
                <Pie
                  data={incomeData}
                />
              </div>
            </div>
            <ul className="list_bx">
              {incomeSecondList.map((item, index) => (
                <li key={`item${index}`} className="flex">
                  <p className="flex1">{item}</p>
                  <p>{addComma(historyIncome.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0))}</p>
                  <p className="badge flex-c fs12" style={{backgroundColor: incomeBgColor[index]}}>{Math.round((historyIncome.filter(historyItem => historyItem.secondCategory?.name === item).map(v => v.price).reduce((price, curr) => price + curr, 0) / historyIncome.map(v => v.price).reduce((price, curr) => price + curr, 0))*100)}%</p>
                </li>
              ))}
            </ul>
            </>
          : <p className="data-none">수입 내역이 없습니다.</p>}
        </li>
      </ul>
      <div>
      </div>
    </Container>
  )
}

const Container = styled.div`
  .month{
    width: 140px;
    height: 40px;
    border-bottom: 1px solid ${Colors.gray_be};
    input{
      height: 100%;
    }
  }

  .chart_group{
    padding-top: 24px;
  }

  .card{
    flex: 1;
    padding: 24px 12px;
    border-radius: 24px;
    + .card{
      margin-left: 24px;
    }

    .chart_bx{
      padding-bottom: 100%;
      position: relative;

      .chart_wrap{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }

    .list_bx{
      padding: 24px 12px 0;
      li{
        + li{
          margin-top: 12px;
        }

        p{
          &:nth-child(2){
            padding: 0 12px;
          }
          &.badge{
            width: 40px;
            height: 20px;
            border-radius: 6px;
            color: white;
          }
        }
      }
    }

    .data-none{
      padding: 24px 0;
      text-align: center;
    }
  }
`


// [
//   '#fe7877bf',
//   '#fd925ebf',
//   '#f7d021bf',
//   '#88e18ebf',
//   '#2dcc70bf',
//   '#99e1ffbf',
//   '#5fa9ffbf',
//   '#c29effbf',
//   '#fb6a87bf'
//   // '#fcb100',
//   // '#9ff23a',
//   // '#6ad922',
//   // '#2acec6',
//   // '#04e6f7',
//   // '#70ffd9',
//   // '#55cdff',
//   // '#fb88ff',
//   // '#fc889f',
//   // '#fb6a87',
//   // '#b79470',
// ]