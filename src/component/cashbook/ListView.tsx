import styled from "styled-components"
import { Colors } from "../../style/Styles"
import { memo, useEffect, useRef, useState } from "react"
import EditHistoryModal from "./EditHistoryModal"
import moment from "moment"
import axios from "axios"
import { useParams } from "react-router-dom"
import CashbookHistory, { HistoryFilterList } from "../../models/CashbookHistory.model"
import FirstCategory from "../../models/Category.model"
import PaymentMethod from "../../models/PaymentMethod.model"


export default function CashbookList() {
  
  const {id} = useParams()
  const tokenRef = useRef('')
  const popoverRef = useRef<any>(null)

  const [cateogryList, setCategoryList] = useState<FirstCategory[]>([])
  const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([])
  const [historyList, setHistoryList] = useState<CashbookHistory[]>([])

  const [month, setMonth] = useState(moment().format('YYYY-MM'))

  const [selectedHistory, setSelectedHistory] = useState<CashbookHistory>()
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false)

  const [totalExpense, setTotalExpense] = useState(0)
  const [totalSaving, setTotalSaving] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)

  const [filterList, setFilterList] = useState(HistoryFilterList)

  // const [isInit, setIsInit] = useState<boolean>()
  
  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''
    console.log('filterList', filterList)

    // console.log('isInit', isInit)

    // if(isInit === undefined) {
    //   console.log('false 임', isInit)
    // }
  }, [])

  useEffect(() => {
    getCategory();
    getPaymentMethod();
    getHistory();
  }, [id])

  useEffect(() => {
    const outsideTouch = (e: MouseEvent) => {
      if(popoverRef.current && !popoverRef.current.contains(e.target)) {
        setFilterList(filterList.map(value => {
          value.isShowPopover = false

          return value
        }))

        getCategory()
      }
    }

    // window.addEventListener("mousedown", outsideTouch)
    window.addEventListener("mouseup", outsideTouch)
    return () => {
      // window.removeEventListener("mousedown", outsideTouch)
      window.removeEventListener("mouseup", outsideTouch)
    }
  }, [popoverRef])
  
  useEffect(() => {

    const expenseList = historyList.filter(v => v.firstCategoryId === 1)

    let monthlyExpense = 0
    expenseList.forEach(item => {
      monthlyExpense += item.price
    })
    setTotalExpense(monthlyExpense)

    const incomeList = historyList.filter(v => v.firstCategoryId === 2)
    
    let monthlyIncome = 0
    incomeList.forEach(item => {
      monthlyIncome += item.price
    })
    setTotalIncome(monthlyIncome)

    const savingList = historyList.filter(v => v.firstCategoryId === 3)
    
    let monthlySaving = 0
    savingList.forEach(item => {
      monthlySaving += item.price
    })
    setTotalSaving(monthlySaving)

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

  const getPaymentMethod = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}/payment-method`, {
      params: {
        cashBookId: id
      },
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('결제수단 조회 성공', response.data.data)

        setPaymentMethodList(response.data.data)
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
        
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const deleteHistory = (id: number) => {
    axios.delete(`${process.env.REACT_APP_HOST_URL}v1/cash-book-detail/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('내역 삭제 성공', response.data.data)
    
        getHistory()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

   // try {
    //   const results = await axios.get(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}/detail`, {
    //     headers: {
    //       Authorization: `Bearer ${tokenRef.current}`
    //     }
    //   })

    //   results
    // } catch (error) {
      
    // }
    
    const addComma = (price: number) => {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }


  return (
    <>
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

        <div className="area filter_add flex">
          <ul className="flex1 flex flex-wrap">
            {filterList.map((filter, index) => (
              <li key={`filter${index}`}>
                <button
                  onClick={() => {
                    setFilterList(filterList.map(v => {
                      if(v.name === filter.name) {
                        v.isShowPopover = !v.isShowPopover
                      } else{
                        v.isShowPopover = false
                      }
                      return v
                    }))
                  }}
                >{filter.name}</button>
                {filter.isShowPopover && (
                  <>
                    {filter.name === '거래유형' && (
                      <div className="popover card category_first"
                        ref={popoverRef}
                      >
                        <div className="flex ai-c">
                          {cateogryList.map((first, fIndex) => (
                            <div className="checkbox_field" key={`first${fIndex}`}>
                              <input type="checkbox" id={`first${first.id}`} name="type"
                                // checked={selectedFirstCateogry?.id === first.id}
                                // onChange={e => {
                                //   if(e.target.checked){
                                //     setSelectedFirstCategory(first);
                                //   }
                                // }}
                              />
                              <label htmlFor={`first${first.id}`}>
                                <span className={`mark first${first.id}`} />
                                <p>{first.name}</p>
                              </label>
                            </div>
                          ))}
                        </div>

                        <div className="group_btn">
                          <button className="contained gray">필터 해제</button>
                          <button className="contained main">필터 적용</button>
                        </div>
                      </div>
                    )}

                    {filter.name === '1차' && (
                      <div className="popover card category_first"
                        ref={popoverRef}
                      >
                        <div className="flex ai-c">
                          {/* {cateogryList.map((first, fIndex) => (
                            <div className="checkbox_field" key={`first${fIndex}`}>
                              <input type="checkbox" id={`first${first.id}`} name="type"
                                // checked={selectedFirstCateogry?.id === first.id}
                                // onChange={e => {
                                //   if(e.target.checked){
                                //     setSelectedFirstCategory(first);
                                //   }
                                // }}
                              />
                              <label htmlFor={`first${first.id}`}>
                                <span className={`mark first${first.id}`} />
                                <p>{first.name}</p>
                              </label>
                            </div>
                          ))} */}
                        </div>

                        <div className="group_btn">
                          <button className="contained gray">필터 해제</button>
                          <button className="contained main">필터 적용</button>
                        </div>
                      </div>
                    )}

                    {filter.name === '2차' && (
                      <div className="popover card category_first"  
                        ref={popoverRef}
                      >
                        <div className="flex ai-c">
                          {/* {cateogryList.map((first, fIndex) => (
                            <div className="checkbox_field" key={`first${fIndex}`}>
                              <input type="checkbox" id={`first${first.id}`} name="type"
                                // checked={selectedFirstCateogry?.id === first.id}
                                // onChange={e => {
                                //   if(e.target.checked){
                                //     setSelectedFirstCategory(first);
                                //   }
                                // }}
                              />
                              <label htmlFor={`first${first.id}`}>
                                <span className={`mark first${first.id}`} />
                                <p>{first.name}</p>
                              </label>
                            </div>
                          ))} */}
                        </div>

                        <div className="group_btn">
                          <button className="contained gray">필터 해제</button>
                          <button className="contained main">필터 적용</button>
                        </div>
                      </div>
                    )}

                    {filter.name === '결제수단' && (
                      <div className="popover card category_first"
                        ref={popoverRef}
                      >
                        <div className="flex ai-c">
                          {/* {cateogryList.map((first, fIndex) => (
                            <div className="checkbox_field" key={`first${fIndex}`}>
                              <input type="checkbox" id={`first${first.id}`} name="type"
                                // checked={selectedFirstCateogry?.id === first.id}
                                // onChange={e => {
                                //   if(e.target.checked){
                                //     setSelectedFirstCategory(first);
                                //   }
                                // }}
                              />
                              <label htmlFor={`first${first.id}`}>
                                <span className={`mark first${first.id}`} />
                                <p>{first.name}</p>
                              </label>
                            </div>
                          ))} */}
                        </div>

                        <div className="group_btn">
                          <button className="contained gray">필터 해제</button>
                          <button className="contained main">필터 적용</button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="contained main add_history"
            onClick={() => setShowEditHistoryModal(true)}
          >내역 추가</button>
        </div>
        
        <div className="area table">
          <table>
            <thead>
              <tr>
                <th className="date">일자</th>
                <th>내용</th>
                <th className="price">금액</th>
                <th>거래유형</th>
                <th>1차</th>
                <th>2차</th>
                {/* <th>태그</th> */}
                <th>결제수단</th>
                <th className="action"></th>
              </tr>
            </thead>

            <tbody>
              {historyList.filter(v => moment(v.date).format('YYYY-MM') === month).map((history, hIndex) => (
                <tr key={`history${hIndex}`}>
                  <td>{moment(history.date).format('YYYY.MM.DD')}</td>
                  <td>{history.description}</td>
                  <td>{addComma(history.price)}</td>
                  <td>{history.firstCategory?.name}</td>
                  <td>{history.secondCategory?.name}</td>
                  <td>{history.thirdCategory?.name}</td>
                  {/* <td></td> */}
                  <td>{history.paymentMethod?.name}</td>
                  <td>
                    <div className="flex">
                      <button type="button"
                        className="btn edit"
                        onClick={() => {
                          setShowEditHistoryModal(true)
                          setSelectedHistory(history)
                        }}
                      />
                      <button type="button"
                        className="btn delete"
                        onClick={() => {
                          deleteHistory(history.id)
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      {showEditHistoryModal && (
        <EditHistoryModal
          cashbookHistory={selectedHistory}
          categoryList={cateogryList}
          paymentMethodList={paymentMethodList}
          onClickCancel={() => {
            setShowEditHistoryModal(false)
            setSelectedHistory(undefined)
          }}
          onComplete={() => {
            setShowEditHistoryModal(false)
            getHistory()
          }}
        />
      )}
    </>
  )
}

const Container = styled.div`
  max-width: 1200px;
  .area{
    &.summary{
      .input_field.standard{
        border-bottom: 1px solid ${Colors.gray_be};
        input{
          height: 100%;

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

    &.filter_add{
      padding: 24px 0;
      ul{
        padding-right: 24px;
        li{
          position: relative;
          > button{
            height: 36px;
            border-radius: 18px;
            padding: 0 34px 0 12px;
            background: white url(images/arrow_down.svg) no-repeat right 12px center / 10px 10px;
            box-shadow: rgba(34, 34, 34, 0.1) 2px 2px 6px 2px;
            &:hover{
              background-color: ${Colors.light_main};
            }
          }

          .popover.card.category{
            &_first{
              .checkbox_field + .checkbox_field{
                margin-left: 24px;
              }
            }
          }

          + li{
            margin-left: 12px;
          }
        }
      }

      .add_history{
        padding: 0 12px;
        height: 36px;
      }
    }

    &.table{
      height: calc(100% - (45px + 84px));
      th{
        padding: 12px;
        text-align: left;
        &.date, &.price{
          width: 120px;
        }
        &.action{
          width: 96px;
        }
      }
      tbody{
        tr{
          border-bottom: 1px solid ${Colors.gray_e5};
          /* + tr{
            border-top: 1px solid ${Colors.gray_e5};
          } */
          
          td{
            padding: 12px;
            /* &:nth-child(even){background-color: aliceblue} */
            .btn.delete{
              margin-left: 12px;
            }
          }
        }
      }
    }
  }
`