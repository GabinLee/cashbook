import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Colors } from "../../style/Styles"
import moment from "moment"
import axios from "axios"
import { useParams } from "react-router-dom"
import CashbookHistory from "../../models/CashbookHistory.model"
import { addComma } from "../../utils/Utils"


export default function CalendarView() {
  const {id} = useParams();
  const tokenRef = useRef('');

  const [historyList, setHistoryList] = useState<CashbookHistory[]>([]);

  const [month, setMonth] = useState(moment().format('YYYY-MM'));
  // const [selectedCalendarMonth, setSelectedCalendarMonth] = useState(moment())

  const expenseList = historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '지출');
  const incomeList = historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '수입');
  const savingList = historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '저축');

  const [totalExpense, setTotalExpense] = useState(0);
  const [totalSaving, setTotalSaving] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const headList = ['월', '화', '수', '목', '금', '토', '일', 'Settlement'];
  const [dateList, setDateList] = useState<moment.Moment[][]>([]);
  /* const startDay = moment().clone().startOf("month").startOf("week");
  const endDay = moment().clone().endOf("month").endOf("week"); */
  /* const [startDay, setStartDay] = useState(moment().clone().startOf("month").startOf("week"));
  const [endDay, setEndDay] = useState(moment().clone().endOf("month").endOf("week")); */


  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? '';

  }, [])

  // useEffect(() => {
  //   console.log(historyList)
  // }, [historyList])

  useEffect(() => {
    getHistory();

    setMonth(moment().format('YYYY-MM'));

    
  }, [id])

  useEffect(() => {
    // setMonthFilteredHistoryList(historyList.filter(v => moment(v.date).format('YYYY-MM') === month));

    setTotalExpense(expenseList.map(v => v.price).reduce((price, cur) => price + cur, 0))

    setTotalIncome(incomeList.map(v => v.price).reduce((price, cur) => price + cur, 0))
    
    setTotalSaving(savingList.map(v => v.price).reduce((price, cur) => price + cur, 0))
  }, [id, historyList, month])

  useEffect(() => {
    console.log(moment(month).clone().startOf("month").startOf("week"))
    console.log(moment(month).clone().endOf("month").endOf("week"))
    /* setStartDay(moment(month).clone().startOf("month").startOf("week"))
    setEndDay(moment(month).clone().endOf("month").endOf("week")) */

    const startDay = moment(month).clone().startOf("month").startOf("week")
    const endDay = moment(month).clone().endOf("month").endOf("week")
    

    const day = startDay.clone().subtract(0, "day");
    console.log('day', day)
    
    let dateList: moment.Moment[][] = [];

    while (day.isBefore(endDay, "day")) {
      dateList.push(Array(7).fill(0).map(() => day.add(1, "day").clone()));
    }

    setDateList(dateList);
  }, [month])

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

        setHistoryList(response.data.data.results);
        // setMonthFilteredHistoryList(response.data.data.results);
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }


  return (
    <Container className="contents">
      <div className="area summary flex">
        <div className="input_field standard flex1">
          <input type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
          />
        </div>

        <div className="card expense">
          <p>지출</p>
          <h6>{addComma(totalExpense)}</h6>
        </div>
        <div className="card saving">
          <p>저축</p>
          <h6>{addComma(totalSaving)}</h6>
        </div>
        <div className="card income">
          <p>수입</p>
          <h6>{addComma(totalIncome)}</h6>
        </div>
      </div>

      <div className="area calendar card">
        <ul className="list_head">
          {headList.map((head, hIndex) => (
            <li key={`head${hIndex}`} className="fs12">{head}</li>
          ))}
        </ul>

        <div className="list_body flex column">
          {dateList.map((week, wIndex) => (
            <ul key={`week${wIndex}`} className="flex flex1">
              {week.map((date, dIndex) => (
                <li key={`date${dIndex}`}>
                  {date.format('YYYY-MM') === month && (
                    <>
                    <p className="date">{date.format('D')}</p>
                    {historyList.filter(v => moment(v.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')).map((history, hIndex) => (
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
      </div>
    </Container>
  )
}

const Container = styled.div`
  padding: 24px;
  
  .area{
    &.summary{
      padding-bottom: 15px;
      .input_field.standard{
        border-bottom: 1px solid ${Colors.gray_be};
        input{
          height: 100%;
          font-size: 16px;
        }
      }

      .card{
        flex: 1;
        margin-left: 24px;
        padding: 12px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        p{
          flex: 1;
          padding-right: 12px;
          font-size: 12px;
        }

        &.expense{
          border-left: 6px solid ${Colors.red};
          h6{
            color: ${Colors.red};
          }
        }
        &.saving{
          border-left: 6px solid ${Colors.yellow};
          h6{
            color: ${Colors.yellow};
          }
        }
        &.income{
          border-left: 6px solid ${Colors.green};
          h6{
            color: ${Colors.green};
          }
        }
      }
    }

    &.calendar{
      height: calc(100% - 60px);
      border-radius: 24px;
      overflow: hidden;

      .list{
        &_head{
          display: flex;
          align-items: center;
          li{
            width: calc(100% * 1/8);
            padding: 6px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            &:nth-child(6){
              color: ${Colors.blue};
            }
            &:nth-child(7){
              color: ${Colors.red};
            }
          }
        }

        &_body{
          height: calc(100% - 30px);
          overflow: auto;
          ul{
            border-top: 1px solid ${Colors.gray_e5};
            li{
              width: calc(100% * 1/8);
              min-height: 100px;
              padding: 6px 8px;
              position: relative;
              + li::before{
                content: '';
                width: 1px;
                height: 100%;
                background-color: ${Colors.gray_e5};
                position: absolute;
                top: 0;
                left: -0.5px;
              }
              &:nth-child(6){
                .date{
                  color: ${Colors.blue};
                }
              }
              &:nth-child(7){
                .date{
                  color: ${Colors.red};
                }
              }
              .row{
                padding-right: 8px;
                position: relative;
                &::before{
                  content: '';
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  position: absolute;
                  top: 50%;
                  right: 0;
                  transform: translate(0, -50%);
                }
                &.expense{
                  /* .price{
                    color: ${Colors.red};
                  } */
                  &::before{
                    background-color: ${Colors.red};
                  }
                }
                &.income{
                  /* .price{
                    color: ${Colors.green};
                  } */
                  &::before{
                    background-color: ${Colors.green};
                  }
                }
                &.saving{
                  /* .price{
                    color: ${Colors.yellow};
                  } */
                  &::before{
                    background-color: ${Colors.yellow};
                  }
                }
              }
              p{
                font-size: 12px;
                line-height: 1.5;
                &.date{
                  padding-bottom: 6px;
                  text-align: center;
                }
                &.description{
                  max-width: calc(100% - 48px);
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                &.price{
                  padding-left: 6px;
                  text-align: right;
                }
              }
            }
          }
        }
      }
    }
  }
`