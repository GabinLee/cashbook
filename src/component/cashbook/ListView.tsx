import styled from "styled-components"
import { Colors } from "../../style/Styles"
import { useEffect, useRef, useState } from "react"
import EditHistoryModal from "./EditHistoryModal"
import moment from "moment"
import axios from "axios"
import { useParams } from "react-router-dom"
import CashbookHistory, { HistoryFilterList } from "../../models/CashbookHistory.model"
import FirstCategory from "../../models/Category.model"
import PaymentMethod from "../../models/PaymentMethod.model"


export default function ListView() {
  
  const {id} = useParams()
  const tokenRef = useRef('')

  const [cateogryList, setCategoryList] = useState<FirstCategory[]>([])
  const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([])
  const [historyList, setHistoryList] = useState<CashbookHistory[]>([])

  const [month, setMonth] = useState(moment().format('YYYY-MM'))

  const expenseList = historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '지출')
  const incomeList = historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '수입')
  const savingList = historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '저축')

  const [totalExpense, setTotalExpense] = useState(0)
  const [totalSaving, setTotalSaving] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)

  const [selectedHistory, setSelectedHistory] = useState<CashbookHistory>()
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false)

  const [filterList, setFilterList] = useState(HistoryFilterList)

  const [filteredHistoryList, setFilteredHistoryList] = useState<CashbookHistory[]>([])
  
  const [selectedFirstIdFilterArray, setSelectedFirstIdFilterArray] = useState<number[]>([])
  // const [selectableSecondFilterArray, setSelectableSecondFilterArray] = useState<FirstCategory[]>([])
  // const [selectedSecondIdFilterArray, setSelectedSecondIdFilterArray] = useState <number[]>([])
  // const [selectableThirdFilterArray, setSelectableThirdFilterArray] = useState()
  // const [selectedThirdFilterArray, setSelectedThirdFilterArray] = useState<number[]>([])


  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''
  }, [])

  useEffect(() => {
    getCategory();
    getPaymentMethod();
    getHistory();

    setFilteredHistoryList(historyList.filter(v => moment(v.date).format('YYYY-MM') === month))

    console.log('필터된 목록', filteredHistoryList)
  }, [id])

  useEffect(() => {
    let monthlyExpense = 0
    expenseList.forEach(item => {
      monthlyExpense += item.price
    })
    setTotalExpense(monthlyExpense)

    let monthlyIncome = 0
    incomeList.forEach(item => {
      monthlyIncome += item.price
    })
    setTotalIncome(monthlyIncome)
    
    let monthlySaving = 0
    savingList.forEach(item => {
      monthlySaving += item.price
    })
    setTotalSaving(monthlySaving)

    // 거래유형 default
    setSelectedFirstIdFilterArray(cateogryList.map(v => v.id))

  }, [historyList, month])

  useEffect(() => {
    setFilteredHistoryList(historyList.filter(v => moment(v.date).format('YYYY-MM') === month))

  }, [month])

  useEffect(() => {
    setFilteredHistoryList(historyList.filter(v => {
      return selectedFirstIdFilterArray.includes(v.firstCategoryId)
    }))
  }, [selectedFirstIdFilterArray])






  // useEffect(() => {
  //   // console.log('필터된 목록', filteredHistoryList)
  //   // console.log('셀렉 가능 second', selectableSecondFilterArray)
  //   // console.log('셀렉된 second', selectedSecondIdFilterArray)


  //   // 1차 default
  //   setSelectableSecondFilterArray(cateogryList.filter(first => {
  //     return selectedFirstIdFilterArray.includes(first.id)
  //   }))
    
  //   // console.log('검증', selectedSecondIdFilterArray)

  //   // setSelectedSecondIdFilterArray()

  //   // console.log('테스트', cateogryList.forEach(v => {
  //   //   // setSelectedSecondIdFilterArray(selectableSecondFilterArray.map(first => first.secondCategoryList.filter(second => {
  //   //   //   return selectedFirstIdFilterArray.includes(second.firstCategoryId)
  //   //   // }).map(v => v.id)))
  //   // }))


  //   // console.log('검증', selectableSecondFilterArray.forEach(v => {
  //   //   setSelectedSecondIdFilterArray(selectedSecondIdFilterArray.concat(v.secondCategoryList.filter(second => {
  //   //     return selectedFirstIdFilterArray.includes(second.firstCategoryId)
  //   //   }).map(v => v.id)))
  //   // }))

    
  //   // selectableSecondFilterArray.map(first => first.secondCategoryList.filter(second => {
  //   //   return selectedFirstIdFilterArray.includes(second.firstCategoryId)
  //   // }).map(v => v))

  //   // console.log('검증', selectableSecondFilterArray.forEach(v => {
  //   //   v.secondCategoryList.filter(second => {
  //   //     return selectedFirstIdFilterArray.includes(second.firstCategoryId)
  //   //   }).map(v => v.id)
  //   // }))


  //   // let abc: number[] = []
    
    
    
  //   // .forEach(v => {
  //   //   // abc = abc.concat(v.secondCategoryList.map(v => v.id))
  //   //   setSelectedSecondIdFilterArray(v.secondCategoryList.map(v => v.id))
  //   // })
  //   // setSelectedSecondIdFilterArray(abc)

  //   const defaultSecond = cateogryList.filter(v => selectedFirstIdFilterArray.includes(v.id)).map(v => v.secondCategoryList.map(second => second.id))

  //   // defaultSecond.forEach(second => {
  //   //   setSelectedSecondIdFilterArray(selectedSecondIdFilterArray.concat(second))
  //   // })

  //   // const extraction = selectableSecondFilterArray.filter(v => selectedFirstIdFilterArray.includes(v.id)).map(v => v.secondCategoryList.map(second => second.id))
  // }, [filteredHistoryList])


  // useEffect(() => {
  //   // 1차 default
  //   // console.log('확인 selectableSecondFilterArray', selectableSecondFilterArray.filter(first => {
  //   //   return selectedFirstIdFilterArray.includes(first.id)
  //   // }))


  //   //   const defaultSecond = cateogryList.filter(v => selectedFirstFilterArray.includes(v.id)).map(v => v.secondCategoryList.map(second => second.id))
  // //   defaultSecond.forEach(second => {
  // //     setSelectedSecondFilterArray(selectedSecondFilterArray.concat(second))
  // //   })

  // //   let allSecondCategoryArray: number[] = []
  // //   cateogryList.forEach(v => {
  // //     allSecondCategoryArray = allSecondCategoryArray.concat(v.secondCategoryList.map(v => v.id))
  // //   })
  // //   setSelectedSecondFilterArray(allSecondCategoryArray)
    
  //   // .map(first => first.secondCategoryList.map(second =>  second.name))
    
  //   // console.log('확인', cateogryList.map(first => first.secondCategoryList.map(second =>  second.name)))
  //   // selectableSecondFilterArray
  //   // selectedSecondIdFilterArray

  //   // setFilteredHistoryList(historyList.filter(v => {
  //   //   return selectedFirstFilterArray.includes(v.firstCategoryId)
  //   // }))
    
  //   // 2차 default

  // }, [selectedFirstIdFilterArray])


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
            {filterList.filter(v => v.name === '거래유형').map((filter, index) => (
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
                      <ul className="popover card category_first flex ai-c jc-sb">
                        {cateogryList.map((first, fIndex) => (
                          <li key={`first${fIndex}`} className="checkbox_field">
                            <input type="checkbox" id={`first${first.id}`} name="type"
                              checked={selectedFirstIdFilterArray.includes(first.id)}
                              onChange={e => {
                                if(e.target.checked){
                                  setSelectedFirstIdFilterArray(selectedFirstIdFilterArray.concat(first.id))
                                } else{
                                  setSelectedFirstIdFilterArray(selectedFirstIdFilterArray.filter(id => id !== first.id))
                                }
                              }}
                            />
                            <label htmlFor={`first${first.id}`}>
                              <span className={`mark first${first.id}`} />
                              <p>{first.name}</p>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}

                    {false && (
                      <>
                        {filter.name === '1차' && (
                          <div className="popover card category_second">
                            {/* {selectableSecondFilterArray.map((first, fIndex) => (
                              <div className="group_area" key={`first${fIndex}`}>
                                <p className={`fs12 ${first.name === '지출' ? 'color_red' : first.name === '수입' ?  'color_green' : 'color_yellow'}`}>{first.name}</p>
                                <ul className="check_list flex ai-c flex-wrap">
                                  {first.secondCategoryList.map((second, sIndex) => (
                                    <li className="checkbox_field" key={`second${sIndex}`}>
                                      <input type="checkbox" id={`${second.firstCategoryId}second${second.id}`} name="type"
                                        checked={selectedSecondIdFilterArray.includes(second.id)}
                                        onChange={e => {
                                          if(e.target.checked) {
                                            setSelectedSecondIdFilterArray(selectedSecondIdFilterArray.concat(second.id))
                                          } else{
                                            setSelectedSecondIdFilterArray(selectedSecondIdFilterArray.filter(id => id !== second.id))
                                          }
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
                            ))} */}

                            {/* {cateogryList.filter(first => {
                              return selectedFirstIdFilterArray.includes(first.id)
                            }).map((first, fIndex) => (
                              <div className="group_area" key={`first${fIndex}`}>
                                <p className={`fs12 ${first.name === '지출' ? 'color_red' : first.name === '수입' ?  'color_green' : 'color_yellow'}`}>{first.name}</p>
                                {first.secondCategoryList.map((second, sIndex) => (
                                  <p key={`second${sIndex}`}>{second.name}</p>
                                ))}
                              </div>
                            ))} */}

                            {/* {cateogryList.filter(first => {
                              if(!selectedFirstFilterArray.includes(first.id)) return false;
                              if(first.secondCategoryList.length === 0) return false;
                              return true
                            }).map((first, fIndex) => (
                              <div className="group_area" key={`first${fIndex}`}>
                                <p className={`fs12 ${first.name === '지출' ? 'color_red' : first.name === '수입' ?  'color_green' : 'color_yellow'}`}>{first.name}</p>
                                
                              </div>
                            ))} */}
                          </div>
                        )}

                    {filter.name === '2차' && (
                      <div className="popover card category_third">
                        {/* {cateogryList.filter(first => {
                          if(!selectedFirstFilterArray.includes(first.id)) return false;

                          if(first.secondCategoryList.length === 0) return false;

                          const totalCountArray = first.secondCategoryList.map(v => v.thirdCategoryList.length).reduce((a, c) => a + c, 0)
                          if(totalCountArray === 0) return false;

                          return true
                        }).map((first, fIndex) => (
                          first.secondCategoryList.map((second, sIndex) => (
                            <div className="group_area" key={`first${fIndex}second${sIndex}`}>
                              <p className={`fs12 ${first.name === '지출' ? 'color_red' : first.name === '수입' ?  'color_green' : 'color_yellow'}`}>{first.name} - {second.name}</p>

                            </div>
                            // second.thirdCategoryList.map((third, tIndex) => (
                            //   <p>{third.name}</p>
                            // ))
                          ))
                        ))} */}

                        {/* .map((first, fIndex) => (
                          first.secondCategoryList.filter(second => {
                            if(second.thirdCategoryList.length === 0) return false;
                            return true;
                          }).map((second, sIndex) => (
                            <div className="card_cont" key={`first${index}second${sIndex}`}>
                              
                              <ul className="check_list flex ai-c flex-wrap">
                                {second.thirdCategoryList.filter(v => true).map((third, tIndex) => (
                                  // <p key={`first${index}second${sIndex}third${tIndex}`}>{third.name}</p>
                                  <div className="checkbox_field" key={`first${index}second${sIndex}third${tIndex}`}>
                                    <input type="checkbox" id={`third${third.id}`} name="type"
                                      // checked={selectedFirstCateogry?.id === first.id}
                                      // onChange={e => {
                                      //   if(e.target.checked){
                                      //     setSelectedFirstCategory(first);
                                      //   }
                                      // }}
                                    />
                                    <label htmlFor={`third${third.id}`}>
                                      <span className="mark" />
                                      <p>{third.name}</p>
                                    </label>
                                  </div>
                                ))}
                              </ul>
                            </div>
                          ))
                        )) */}

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

                    {filter.name === '결제수단' && (
                      <div className="popover card">
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
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="contained main add_history"
            onClick={() => {
              setShowEditHistoryModal(true)
              setFilterList(filterList.map(v => {
                v.isShowPopover = false

                return v
              }))
            }}
          >내역 추가</button>
        </div>
        
        <div className="area table">
          <table>
            <thead>
              <tr>
                <th className="date">일자</th>
                <th>내용</th>
                <th className="price">금액</th>
                <th className="first">거래유형</th>
                <th className="second">1차</th>
                <th className="third">2차</th>
                {/* <th>태그</th> */}
                <th className="payment_method">결제수단</th>
                <th className="receipt">영수증</th>
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
                  {/* <td>{}</td> */}
                  <td>{history.paymentMethod?.name}</td>
                  <td>{history.imageList.length}</td>
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
      li.filter_group{
        padding-right: 24px;
        &_item{
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

          .popover.card{
            min-width: 288px;
            max-width: 360px;
              &.category_first{
                box-shadow: rgba(34, 34, 34, 0.2) 6px 6px 12px 6px;
              }

              &.category_second{
                .group_area{
                  > .fs12{
                    margin-bottom: 6px;
                  }
                
                  + .group_area{
                    margin-top: 24px;
                  }
                }
              }

              &.category_second{
                .checkbox_field{
                  width: 50%;
                  &:nth-child(odd){
                    padding-right: 12px;
                  }
                  &:nth-child(2) ~ .checkbox_field{
                    margin-top: 6px;
                  }
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
        &.date, &.price, &.second, &.third{
          width: 120px;
        }
        &.first{
          width: 80px;
        }
        &.payment_method{
          width: 180px;
        }
        &.receipt{
          /* width: ; */
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