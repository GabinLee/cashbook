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
import { addComma } from "../../utils/utils"


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
  
  const [selectedFirstIdArray, setSelectedFirstIdArray] = useState<number[]>([])
  const [selectedSecondIdArray, setSelectedSecondIdArray] = useState <number[]>([])
  // const [selectedThirdFilterArray, setSelectedThirdFilterArray] = useState<number[]>([])
  const [selectedPaymentMethodIdArray, setSelectedPaymentMethodIdArray] = useState<number[]>([])


  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? '';
  }, [])

  useEffect(() => {
    getCategory();
    getPaymentMethod();
    getHistory();

    setMonth(moment().format('YYYY-MM'));
  }, [id])

  useEffect(() => {
    setFilteredHistoryList(historyList.filter(v => moment(v.date).format('YYYY-MM') === month));

    setTotalExpense(expenseList.map(v => v.price).reduce((price, cur) => price + cur, 0))

    setTotalIncome(incomeList.map(v => v.price).reduce((price, cur) => price + cur, 0))
    
    setTotalSaving(savingList.map(v => v.price).reduce((price, cur) => price + cur, 0))
  }, [id, historyList, month])

  // filter default
  useEffect(() => {
    // filter_first default
    setSelectedFirstIdArray(cateogryList.map(v => v.id));

    // filter_second default
    if(selectedSecondIdArray.length === 0){
      setSelectedSecondIdArray(selectedSecondIdArray.concat(...cateogryList.filter(first => cateogryList.map(v => v.id).includes(first.id)).map(first => first.secondCategoryList.map(second => second.id))));
    };

    // 결제수단 default
    setSelectedPaymentMethodIdArray(paymentMethodList.map(v => v.id));
  }, [cateogryList, historyList, paymentMethodList])

  // first 체크에 따른 filter_second list
  useEffect(() => {
    setSelectedSecondIdArray(cateogryList.filter(first => selectedFirstIdArray.includes(first.id)).map(first => first.secondCategoryList.map(second => second.id)).reduce((acc, cur) => acc.concat(cur), []));
  }, [selectedFirstIdArray])

  // 거래유형, 1차, 결제수단 체크여부에 따른 내역 필터
  useEffect(() => {
    setFilteredHistoryList(historyList.filter(v => {
      return selectedFirstIdArray.includes(v.firstCategoryId)
    }).filter(v => {
      return selectedSecondIdArray.includes(v.secondCategoryId)
    }).filter(v => {
      if(v.paymentMethod !== null){
        return selectedPaymentMethodIdArray.includes(v.paymentMethod.id)
      }
    }));
  }, [selectedFirstIdArray, selectedSecondIdArray, selectedPaymentMethodIdArray])


  const getCategory = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}/trade-category`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('카테고리 조회 성공', response.data.data)

        setCategoryList(response.data.data);
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

        setPaymentMethodList(response.data.data);
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

        setHistoryList(response.data.data.results);
        setFilteredHistoryList(response.data.data.results);
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
    
        getHistory();
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
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
            {filterList.filter(v => (v.name !== '2차')).map((filter, index) => (
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
                              checked={selectedFirstIdArray.includes(first.id)}
                              onChange={e => {
                                if(e.target.checked){
                                  setSelectedFirstIdArray(selectedFirstIdArray.concat(first.id))
                                } else{
                                  setSelectedFirstIdArray(selectedFirstIdArray.filter(id => id !== first.id))
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

                    {filter.name === '1차' && (
                      <div className="popover card category_second">
                        {cateogryList.filter(first => selectedFirstIdArray.includes(first.id)).map((first, fIndex) => (
                          <div className={`area_group${first.name === '지출' ? ' expense' : first.name === '수입' ?  ' income' : ' saving'}`} key={`first${fIndex}`}>
                            <p className="fs12">{first.name}</p>
                            {/* <p className={`fs12 ${first.name === '지출' ? 'color_red' : first.name === '수입' ?  'color_green' : 'color_yellow'}`}>{first.name}</p> */}

                            <ul className="check_list flex ai-c flex-wrap">
                              {first.secondCategoryList.map((second, sIndex) => (
                                <li className="checkbox_field" key={`second${sIndex}`}>
                                  <input type="checkbox" id={`${second.firstCategoryId}second${second.id}`} name="secondFilter"
                                  checked={selectedSecondIdArray.includes(second.id)}
                                  onChange={e => {
                                    if(e.target.checked) {
                                      setSelectedSecondIdArray(selectedSecondIdArray.concat(second.id))
                                    } else{
                                      setSelectedSecondIdArray(selectedSecondIdArray.filter(id => id !== second.id))
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
                        ))}
                      </div>
                    )}

                    {false && (
                      <>
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
                      <ul className="popover card payment_method">
                        {/* <li className="checkbox_field">
                          <input type="checkbox" id="payment_all" name="type"
                            checked={selectedPaymentMethodIdArray === paymentMethodList.map(v => v.id)}
                            onChange={e => {
                              // if(e.target.checked){
                              //   setSelectedPaymentMethodIdArray(selectedPaymentMethodIdArray.concat(payment.id))
                              // } else{
                              //   setSelectedPaymentMethodIdArray(selectedPaymentMethodIdArray.filter(id => id !== payment.id))
                              // }
                            }}
                          />
                          <label htmlFor="payment_all">
                            <span className="mark" />
                            <p>전체</p>
                          </label>
                        </li> */}
                        {paymentMethodList.map((payment, pIndex) => (
                          <li className="checkbox_field" key={`payment${pIndex}`}>
                            <input type="checkbox" id={`payment${payment.id}`} name="type"
                              checked={selectedPaymentMethodIdArray.includes(payment.id)}
                              onChange={e => {
                                if(e.target.checked){
                                  setSelectedPaymentMethodIdArray(selectedPaymentMethodIdArray.concat(payment.id))
                                } else{
                                  setSelectedPaymentMethodIdArray(selectedPaymentMethodIdArray.filter(id => id !== payment.id))
                                }
                              }}
                            />
                            <label htmlFor={`payment${payment.id}`}>
                              <span className="mark" />
                              <p>{payment.name}</p>
                            </label>
                          </li>
                        ))}
                      </ul>
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
                  <td className="flex ai-c">
                    {history.imageList.map((img, index) => index === 0 && (
                      <img src={`${process.env.REACT_APP_IMAGE_URL}receipt/${img.image}`} alt="영수증" key={`img${index}`} />
                    ))}
                    {history.imageList.length > 1 && (
                      <p className="fs12">+ {history.imageList.length - 1}</p>
                    )}
                  </td>
                  <td>
                    <div className="flex">
                      <button type="button"
                        className="btn_ic edit"
                        onClick={() => {
                          setShowEditHistoryModal(true)
                          setSelectedHistory(history)
                        }}
                      />
                      <button type="button"
                        className="btn_ic delete"
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
            &.category{
              &_first{
                box-shadow: rgba(34, 34, 34, 0.2) 6px 6px 12px 6px;
              }
              &_second{
                .area_group{
                  + .area_group{
                    margin-top: 24px;
                  }

                  &.expense{
                    > .fs12{
                      color: ${Colors.red};
                    }
                    input[type=checkbox]{
                      &:checked + label .mark{
                        border-color: ${Colors.red};
                        background-color: ${Colors.red};
                      }
                      + label:hover::before{
                        background-color: rgba(228,0,0, .2);
                      }
                    }
                  }
                  &.income{
                    > .fs12{
                      color: ${Colors.green};
                    }
                    input[type=checkbox]{
                      &:checked + label .mark{
                        border-color: ${Colors.green};
                        background-color: ${Colors.green};
                      }
                      + label:hover::before{
                        background-color: rgba(56,138,73, .2);
                      }
                    }
                  }
                  &.saving{
                    > .fs12{
                      color: ${Colors.yellow};
                    }
                    input[type=checkbox]{
                      &:checked + label .mark{
                        border-color: ${Colors.yellow};
                        background-color: ${Colors.yellow};
                      }
                      + label:hover::before{
                        background-color: rgba(246,146,0, .25);
                      }
                    }
                  }

                  > .fs12{
                    margin-bottom: 6px;
                  }
                  
                  .checkbox_field{
                    width: calc(50% - 6px);
                    &:nth-child(even){
                      margin-left: 12px;
                    }
                    &:nth-child(2) ~ .checkbox_field{
                      margin-top: 6px;
                    }
                  }
                }
              }
            }

            &.payment_method{
              li + li{
                margin-top: 4px;
              }
            }
          }

          + li.filter_group_item{
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
            .btn_ic.delete{
              margin-left: 12px;
            }

            img{
              height: 30px;
              + p{
                padding-left: 6px;
              }
            }
          }
        }
      }
    }
  }
`