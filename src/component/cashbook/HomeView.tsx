import styled from "styled-components";
import moment from "moment";
import { Colors } from "../../style/Styles";
import { useEffect, useRef, useState } from "react";
import CashbookHistory from "../../models/CashbookHistory.model";
import { addComma } from "../../utils/utils";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cashbook from "../../models/Cashbook.model";


export default function CashbookHome() {
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


  return (
    <Container className="contents">
      <div className="flex">
        <div className="month flex1">
          <h1>{moment().format('M')}</h1>
          <span>월</span>
        </div>

        {(cashbook !== undefined && cashbook.isGroup) && (
          <div className="balance">
            <span>잔액: </span>
            <span>{addComma(balance)}</span>
            <span>원</span>
          </div>
        )}
      </div>

      <ul className="group_card">
        <li className="card expense">
          <div className="card_top">
            <p>이달의 지출 현황</p>
            <h5>{addComma(monthlyExpense)}</h5>
          </div>
          <ul className="card_bottom">
            {expenseList.length === 0 && (
              <li>지출 내역이 없습니다.</li>
            )}
            {expenseList.map((expense, index) => index < 10 && (
              <li key={`expense${index}`} className="flex ai-c">
                <p>{moment(expense.date).format('DD')}일</p>
                <p className="flex1">{expense.description}</p>
                <p>{addComma(expense.price)}원</p>
              </li>
            ))}
            {expenseList.length > 9 && (
              <li className="flex-c more">⋮</li>
            )}
          </ul>
        </li>

        <li className="card saving">
          <div className="card_top">
            <p>이달의 저축 현황</p>
            <h5>{addComma(monthlySaving)}</h5>
          </div>
          <ul className="card_bottom">
            {savingList.length === 0 && (
              <li>저축 내역이 없습니다.</li>
            )}
            {savingList.map((saving, index) => (
              <li key={`saving${index}`} className="flex ai-c">
                <p>{moment(saving.date).format('DD')}일</p>
                <p className="flex1">{saving.description}</p>
                <p>{addComma(saving.price)}원</p>
              </li>
            ))}
          </ul>
        </li>

        <li className="card income">
          <div className="card_top">
            <p>이달의 수입 현황</p>
            <h5>{addComma(monthlyIncome)}</h5>
          </div>
          <ul className="card_bottom">
            {incomeList.length === 0 && (
              <li>수입 내역이 없습니다.</li>
            )}
            {incomeList.map((income, index) => (
              <li key={`income${index}`} className="flex ai-c">
                <p>{moment(income.date).format('DD')}일</p>
                <p className="flex1">{income.description}</p>
                <p>{addComma(income.price)}원</p>
              </li>
            ))}
          </ul>
        </li>
      </ul>

      {/* <div className="card event">
        <div className="card_top">
          <p>이달의 특별 지출</p>
          <h5>0</h5>
        </div>
        <div className="card_bottom">
          <p>특별 지출 내역이 없습니다.</p>
        </div>
      </div> */}
    </Container>
  )
}

const Container = styled.div`
  .month{
    display: flex;
    align-items: center;
    span{
      margin: 0 0 -12px 6px;
      display: block;
    }
  }

  .card{
    flex: 1;
    border-radius: 12px;
    &.income{
      border-top: 12px solid ${Colors.green};
      h5{
        color: ${Colors.green};
      }
    }
    &.saving{
      border-top: 12px solid ${Colors.yellow};
      h5{
        color: ${Colors.yellow};
      }
    }
    &.expense{
      border-top: 12px solid ${Colors.red};
      h5{
        color: ${Colors.red};
      }
    }
    &.event{
      border-left: 12px solid ${Colors.purple};
      h5{
        color: ${Colors.purple};
      }
    }

    
    &_top{
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &_bottom{
      min-height: 240px;
      padding: 12px 18px;
      border-top: 1px solid ${Colors.gray_e5};
      li{
        + li{
          margin-top: 6px;
        }
        &.more{
          font-size: 20px;
        }
        .flex1{
          padding: 0 12px;
        }
      }
    }
  }
  
  ul.group_card{
    margin: 24px 0;
    display: flex;
    li.card{
      + li{
        margin-left: 24px;
      }
    }
  }
`