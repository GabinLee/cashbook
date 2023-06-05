import styled from "styled-components"
import { Colors } from "../../style/Styles"
import { memo, useEffect, useRef, useState } from "react"
import EditHistoryModal from "./EditHistoryModal"
import moment from "moment"
import axios from "axios"
import { useParams } from "react-router-dom"
import CashbookHistory, { HistoryFilterList } from "../../models/CashbookHistory.model"
import FirstCategory, { SecondCategory } from "../../models/Category.model"
import PaymentMethod from "../../models/PaymentMethod.model"


export default function CashbookListTest() {
  
  const {id} = useParams()
  const tokenRef = useRef('')
  // const popoverRef = useRef<any>(null)

  const [cateogryList, setCategoryList] = useState<FirstCategory[]>([])
  const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([])
  const [historyList, setHistoryList] = useState<CashbookHistory[]>([])

  const [month, setMonth] = useState(moment().format('YYYY-MM'))


  const [filteredHistoryList, setFilteredHistoryList] = useState<CashbookHistory[]>([])
  
  /* const [selectedFirstFilterArray, setSelectedFirstFilterArray] = useState<number[]>([])
  const [selectedSecondFilterArray, setSelectedSecondFilterArray] = useState<number[]>([])
  const [selectedThirdFilterArray, setSelectedThirdFilterArray] = useState<number[]>([]) */

  const [filterCategoryList, setFilterCategoryList] = useState<FirstCategory[]>([])



  const [selectedHistory, setSelectedHistory] = useState<CashbookHistory>()
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false)

  const [totalExpense, setTotalExpense] = useState(0)
  const [totalSaving, setTotalSaving] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)

  const [filterList, setFilterList] = useState(HistoryFilterList)

  // const [isInit, setIsInit] = useState<boolean>()
  
  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''

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

  // useEffect(() => {
  //   const outsideTouch = (e: MouseEvent) => {
  //     if(popoverRef.current && !popoverRef.current.contains(e.target)) {
  //       setFilterList(filterList.map(value => {
  //         value.isShowPopover = false

  //         return value
  //       }))

  //       getCategory()
  //     }
  //   }

  //   // window.addEventListener("mousedown", outsideTouch)
  //   window.addEventListener("mouseup", outsideTouch)
  //   return () => {
  //     // window.removeEventListener("mousedown", outsideTouch)
  //     window.removeEventListener("mouseup", outsideTouch)
  //   }
  // }, [popoverRef])
  
  /* useEffect(() => {
    // 거래유형 default
    setSelectedFirstFilterArray(cateogryList.map(v => v.id));

    // 1차 default
    let allSecondCategoryArray: number[] = []
    cateogryList.forEach(v => {
      allSecondCategoryArray = allSecondCategoryArray.concat(v.secondCategoryList.map(v => v.id))
    })
    setSelectedSecondFilterArray(allSecondCategoryArray)

  }, [cateogryList]) */

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

  // useEffect(() => {
  //   console.log('filterSecondCategoryArray', filterSecondCategoryArray)
  // }, [filterSecondCategoryArray])


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
        setFilterCategoryList(response.data.data)
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
        setFilteredHistoryList(response.data.data.results)
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
          <ul className="flex1 flex flex-wrap filter_group">
            {filterList.map((filter, index) => (
              <li key={`filter${index}`} className="filter_group_item">
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
                      >
                        <div className="flex ai-c">
                          {cateogryList.map((first, fIndex) => {
                            return (
                                <div className="checkbox_field" key={`first${fIndex}`}>
                                <input type="checkbox" id={`first${first.id}`} name="type"
                                  checked={filterCategoryList.find(v => v.id === first.id) !== undefined}
                                  onChange={e => {
                                    if(e.target.checked){
                                      setFilterCategoryList(filterCategoryList.concat(first));
                                    } else{
                                      setFilterCategoryList(filterCategoryList.filter(v => v.id !== first.id))
                                    }
                                  }}
                                />
                                <label htmlFor={`first${first.id}`}>
                                  <span className={`mark first${first.id}`} />
                                  <p>{first.name}</p>
                                </label>
                              </div>
                            )
                          })}
                        </div>

                        <div className="group_btn">
                          <button className="contained gray"
                            onClick={() => {
                              /* setSelectedFirstFilterArray(cateogryList.map(v => v.id)); */
                            }}
                          >초기화</button>
                          <button className="contained main"
                            onClick={() => {
                              setFilteredHistoryList(historyList.filter(history => {
                                /* return filterCategoryList.find(v => v.id === history.firstCategoryId) !== undefined */
                                return filterCategoryList.map(v => v.id).includes(history.firstCategoryId)
                              }))
                              filter.isShowPopover = false
                            }}
                          >필터 적용</button>
                        </div>
                      </div>
                    )}

                    {filter.name === '1차' && (
                      <div className="popover card category_second">
                        {cateogryList.filter(category => {
                          
                          if(category.secondCategoryList.length === 0) return false;
                          
                          if(!filterCategoryList.map(v => v.id).includes(category.id)) return false;

                          return true;
                        }).map((first, fIndex) => (
                          <div className="card_cont" key={`first${fIndex}`}>
                            <p className={`fs12 ${first.name === '지출' ? 'color_red' : first.name === '수입' ?  'color_green' : 'color_yellow'}`}>{first.name}</p>
                            <ul className="check_list flex ai-c flex-wrap">
                              {first.secondCategoryList.map((second, sIndex) => (
                                <li className="checkbox_field" key={`second${sIndex}`}>
                                  <input type="checkbox" id={`${second.firstCategoryId}second${second.id}`} name="type"
                                    checked={filterCategoryList.find(v => v.id === first.id)?.secondCategoryList.map(v => v.id).includes(second.id)}
                                    onChange={e => {
                                      /* if(e.target.checked) {
                                        setSelectedSecondFilterArray(selectedSecondFilterArray.concat(second.id))
                                      } else{
                                        setSelectedSecondFilterArray(selectedSecondFilterArray.filter(id => id != second.id))
                                      } */
                                    }}
                                  />
                                  <label htmlFor={`${second.firstCategoryId}second${second.id}`}>
                                    <span className="mark" />
                                    <p>{second.name}</p>
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        <div className="group_btn">
                          <button className="contained gray"
                            onClick={() => {
                              /* let allSecondCategoryArray: number[] = []
                              cateogryList.forEach(v => {
                                allSecondCategoryArray = allSecondCategoryArray.concat(v.secondCategoryList.map(v => v.id))
                              })
                              setSelectedSecondFilterArray(allSecondCategoryArray) */
                            }}
                          >초기화</button>
                          <button className="contained main"
                            onClick={() => {
                              /* setFilteredHistoryList(historyList.filter(v => {
                                return selectedSecondFilterArray.includes(v.secondCategoryId)
                              }))
                              filter.isShowPopover = false */
                            }}
                          >필터 적용</button>
                        </div>
                      </div>
                    )}

                    {filter.name === '2차' && (
                      <div className="popover card category_third">
                        {/* {cateogryList.filter(v => {
                          return (selectedFirstFilterArray.includes(v.id))
                        }).map((first, fIndex) => (
                          <div className="card_cont" key={`first${fIndex}`}>
                            <p className={`fs12 ${first.name === '지출' ? 'color_red' : first.name === '수입' ?  'color_green' : 'color_yellow'}`}>{first.name}</p>

                          </div>
                        ))} */}
                        

                        <div className="group_btn">
                          <button className="contained gray"
                            onClick={() => {}}
                          >초기화</button>
                          <button className="contained main"
                            onClick={() => {
                              filter.isShowPopover = false
                            }}
                          >필터 적용</button>
                        </div>
                      </div>
                    )}

                    {filter.name === '결제수단' && (
                      <div className="popover card category_first"
                        // ref={popoverRef}
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
                          <button className="contained gray"
                            onClick={() => {}}
                          >초기화</button>
                          <button className="contained main"
                            onClick={() => {
                              filter.isShowPopover = false
                            }}
                          >필터 적용</button>
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
              {filteredHistoryList.length === 0 && (
                <tr className="no-data">
                  <td colSpan={8}>작성된 내역이 없습니다.</td>
                </tr>
              )}
              {filteredHistoryList.filter(v => moment(v.date).format('YYYY-MM') === month).map((history, hIndex) => (
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
            setSelectedHistory(undefined)
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
      .filter_group{
        padding-right: 24px;
        &_item  {
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

            &_second, &_third{
              .card_cont{
                > .fs12{
                  margin-bottom: 6px;
                }
                + .card_cont{
                  margin-top: 24px;
                }
              }
            }

            &_second{
              .check_list{
                width: 260px;
              }
              .checkbox_field{
                width: 120px;
                &:nth-child(even){
                  margin-left: 20px;
                  ~ li.checkbox_field{
                    margin-top: 6px;
                  }
                }
              }
            }

            &_third{
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
          &:not(.no-data){
            border-bottom: 1px solid ${Colors.gray_e5};
            td{
              padding: 12px;
            }
          }
          &.no-data td{
            padding: 48px 24px 24px;
            text-align: center;
          }

          td{
            .btn.delete{
              margin-left: 12px;
            }
          }
        }
      }
    }
  }
`