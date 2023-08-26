import { useEffect, useRef, useState } from "react"
import moment from "moment"
import axios from "axios"
import { useParams, useSearchParams } from "react-router-dom"
import styled from "styled-components"
import { Colors } from "../../style/Styles"
import EditHistoryModal from "./EditHistoryModal"
import CashbookHistory from "../../models/CashbookHistory.model"
import FirstCategory from "../../models/Category.model"
import PaymentMethod from "../../models/PaymentMethod.model"
import { addComma } from "../../utils/Utils"
import PopoverFilter from "../popover/PopoverFilter"
import AlertModal from "../AlertModal"
import ReactPaginate from "react-paginate"
import ListViewModel from "./List.viewmodel"
import { ModalData } from "../../models/AlertModal.model"


export default function ListView() {
  
  const {id} = useParams();
  const tokenRef = useRef('');

  const viewModel = ListViewModel();
  

  const [cateogryList, setCategoryList] = useState<FirstCategory[]>([]);
  const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([]);
  

  const [month, setMonth] = useState(moment().format('YYYY-MM'));

  const expenseList = viewModel.historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '지출');
  const incomeList = viewModel.historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '수입');
  const savingList = viewModel.historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '저축');

  const [totalExpense, setTotalExpense] = useState(0);
  const [totalSaving, setTotalSaving] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const [showFilterPopover, setShowFilterPopover] = useState(0);
  const [selectedFirstIdArray, setSelectedFirstIdArray] = useState<number[]>([]);
  const [selectedSecondIdArray, setSelectedSecondIdArray] = useState <number[]>([]);
  const [selectedPaymentMethodIdArray, setSelectedPaymentMethodIdArray] = useState<number[]>([]);

  const [selectedHistory, setSelectedHistory] = useState<CashbookHistory>();
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false);

  const [filteredHistoryList, setFilteredHistoryList] = useState<CashbookHistory[]>([]);

  const [modalAlertData, setModalAlertData] = useState<ModalData>();


  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? '';
  }, [])

  useEffect(() => {
    getCategory();
    getPaymentMethod();

    setMonth(moment().format('YYYY-MM'));
  }, [id])

  

  useEffect(() => {
    setFilteredHistoryList(viewModel.historyList.filter(v => moment(v.date).format('YYYY-MM') === month));

    setTotalExpense(expenseList.map(v => v.price).reduce((price, cur) => price + cur, 0))

    setTotalIncome(incomeList.map(v => v.price).reduce((price, cur) => price + cur, 0))
    
    setTotalSaving(savingList.map(v => v.price).reduce((price, cur) => price + cur, 0))
  }, [id, viewModel.historyList, month])

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
  }, [cateogryList, viewModel.historyList, paymentMethodList])

  // first 체크에 따른 filter_second list
  useEffect(() => {
    setSelectedSecondIdArray(cateogryList.filter(first => selectedFirstIdArray.includes(first.id)).map(first => first.secondCategoryList.map(second => second.id)).reduce((acc, cur) => acc.concat(cur), []));
  }, [selectedFirstIdArray])

  // 거래유형, 1차, 결제수단 체크여부에 따른 내역 필터
  useEffect(() => {
    // setFilteredHistoryList(historyList.filter(v => {
    //   return selectedFirstIdArray.includes(v.firstCategoryId)
    // }).filter(v => {
    //   return selectedSecondIdArray.includes(v.secondCategoryId)
    // }).filter(v => {
    //   if(v.paymentMethod !== null){
    //     return selectedPaymentMethodIdArray.includes(v.paymentMethod.id)
    //   }
    // }));
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

  

  const deleteHistory = (id: number) => {
    axios.delete(`${process.env.REACT_APP_HOST_URL}v1/cash-book-detail/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('내역 삭제 성공', response.data.data)
    
        viewModel.getHistory();
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
          <ul className="flex1 flex flex-wrap filter_list">
            <PopoverFilter
              filterName="거래유형"
              isShowFilterPopover={showFilterPopover === 1}
              onClickShowPopover={() => {
                if(showFilterPopover !== 1) {
                  setShowFilterPopover(1)
                } else{
                  setShowFilterPopover(0)
                }
              }}
              onClickHidePopover={() => setShowFilterPopover(0)}
              classname="first flex ai-c jc-sb"
            >
              {cateogryList.map((first, fIndex) => (
                <div key={`first${fIndex}`} className="checkbox_field">
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
                </div>
              ))}
            </PopoverFilter>

            <PopoverFilter
              filterName="1차"
              isShowFilterPopover={showFilterPopover === 2}
              onClickShowPopover={() => {
                if(showFilterPopover !== 2) {
                  setShowFilterPopover(2)
                } else{
                  setShowFilterPopover(0)
                }
              }}
              onClickHidePopover={() => setShowFilterPopover(0)}
              classname="second"
            >
              {cateogryList.filter(first => selectedFirstIdArray.includes(first.id)).map((first, fIndex) => (
                <div className={`first_group${first.name === '지출' ? ' expense' : first.name === '수입' ?  ' income' : ' saving'}`} key={`first${fIndex}`}>
                  <p className="first_name fs12">{first.name}</p>
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
            </PopoverFilter>

            <PopoverFilter
              filterName="결제수단"
              isShowFilterPopover={showFilterPopover === 3}
              onClickShowPopover={() => {
                if(showFilterPopover !== 3) {
                  setShowFilterPopover(3)
                } else{
                  setShowFilterPopover(0)
                }
              }}
              onClickHidePopover={() => setShowFilterPopover(0)}
              classname="payment_method"
            >
              {/* <div className="checkbox_field">
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
              </div> */}
              {paymentMethodList.map((payment, pIndex) => (
                <div className="checkbox_field" key={`payment${pIndex}`}>
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
                </div>
              ))}
            </PopoverFilter>
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
                        className="btn_edit btn30"
                        onClick={() => {
                          setShowEditHistoryModal(true)
                          setSelectedHistory(history)
                        }}
                      />
                      <button type="button"
                        className="btn_delete btn30"
                        onClick={() => setModalAlertData({
                          message: '삭제하시겠습니까?',
                          leftButtonText: '취소',
                          rightButtonText: '삭제',
                          onClickLeftButton: () => setModalAlertData(undefined),
                          onClickRightButton: () => {
                            deleteHistory(history.id)
                            setModalAlertData(undefined)
                          }
                        })}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={({selected}) => {
            viewModel.changePage(selected + 1)
            
          }}
          pageRangeDisplayed={viewModel.pageSize}
          pageCount={Math.ceil(viewModel.historyCount / viewModel.pageSize)}
          // pageCount={historyCount / pageSize}
          forcePage={viewModel.page - 1}
          previousLabel="<"
          renderOnZeroPageCount={null}
        />
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
            viewModel.getHistory()
          }}
        />
      )}

      {modalAlertData && <AlertModal {...modalAlertData} />}
    </>
  )
}

const Container = styled.div`
  padding: 24px 24px 12px;

  .area{
    &.summary{
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

    &.filter_add{
      padding: 24px 0;
      .filter{
        &_list{
          padding-right: 12px;
        }
      }

      .add_history{
        padding: 0 12px;
        height: 36px;
      }
    }

    &.table{
      height: calc(100% - (45px + 84px + 40px));
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
        &.action{
          width: 96px;
        }
      }
      tbody{
        tr{
          transition: background-color .2s;
          &:hover{
            background-color: #ebf3fe;
            .btn30{
              background-color: white;
            }
          }

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
            .btn_delete{
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

  .area.table + ul{
    padding: 10px 12px 0;
    display: flex;
    align-items: center;
    justify-content: center;

    li{
      &.selected{
        a{
          background-color: pink;
        }
      }
      a{
        width: 30px;
        height: 30px;
        border-radius: 6px;
        display: block;
        cursor: pointer;
      }
    }
  }


  /* button{
    &.prev{
      margin-right: 8px;
      background: url(images/arrow_down.svg) no-repeat center center / 12px 12px;
      transform: rotate(90deg);
    }

    &.next{
      margin-left: 8px;
      background: url(images/arrow_down.svg) no-repeat center center / 12px 12px;
      transform: rotate(-90deg);
    }

    &:not(.prev):not(.next){
      margin: 0 4px;
      background-color: transparent;

      &.active{
        background-color: ${Colors.main};
        color: white;
      }

      &:not(.active):hover{
        background-color: ${Colors.light_main};
        color: ${Colors.main};
      }
    }
  } */
`