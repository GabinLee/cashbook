import moment from "moment"
import styled from "styled-components"
import { Colors } from "../../style/Styles"
import EditHistoryModal from "./EditHistoryModal"
import { addComma } from "../../utils/Utils"
import PopoverFilter from "../popover/PopoverFilter"
import AlertModal from "../AlertModal"
import ReactPaginate from "react-paginate"
import ListViewModel from "./List.viewmodel"


export default function ListView() {
  
  const viewModel = ListViewModel();

  return (
    <>
      <Container className="contents">
        <div className="area summary flex">
          <div className="input_field standard flex1">
            <input type="month"
              value={viewModel.month}
              onChange={e => viewModel.setMonth(e.target.value)}
            />
          </div>

          <div className="card expense">
            <p>지출</p>
            <h6>{addComma(viewModel.totalExpense)}</h6>
          </div>
          <div className="card saving">
            <p>저축</p>
            <h6>{addComma(viewModel.totalSaving)}</h6>
          </div>
          <div className="card income">
            <p>수입</p>
            <h6>{addComma(viewModel.totalIncome)}</h6>
          </div>
        </div>

        <div className="area filter_add flex">
          <ul className="flex1 flex flex-wrap filter_list">
            <PopoverFilter
              filterName="거래유형"
              isShowFilterPopover={viewModel.showFilterPopover === 1}
              onClickShowPopover={() => {
                if(viewModel.showFilterPopover !== 1) {
                  viewModel.setShowFilterPopover(1)
                } else{
                  viewModel.setShowFilterPopover(0)
                }
              }}
              onClickHidePopover={() => viewModel.setShowFilterPopover(0)}
              classname="first flex ai-c jc-sb"
            >
              <div className="checkbox_field">
                <input type="checkbox" id={`first_all`} name="type"
                  // checked={viewModel.selectedFirstIdArray.includes(first.id)}
                  onChange={e => {
                    if(e.target.checked){
                      // viewModel.setSelectedFirstIdArray(viewModel.selectedFirstIdArray.concat(first.id))
                    } else{
                      // viewModel.setSelectedFirstIdArray(viewModel.selectedFirstIdArray.filter(id => id !== first.id))
                    }
                  }}
                />
                <label htmlFor={`first_all`}>
                  <span className={`mark`} />
                  <p>전체</p>
                </label>
              </div>
              {viewModel.cateogryList.map((first, fIndex) => (
                <div key={`first${fIndex}`} className="checkbox_field">
                  <input type="checkbox" id={`first${first.id}`} name="type"
                    checked={viewModel.selectedFirstIdArray.includes(first.id)}
                    onChange={e => {
                      if(e.target.checked){
                        viewModel.setSelectedFirstIdArray(viewModel.selectedFirstIdArray.concat(first.id))
                      } else{
                        viewModel.setSelectedFirstIdArray(viewModel.selectedFirstIdArray.filter(id => id !== first.id))
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
              isShowFilterPopover={viewModel.showFilterPopover === 2}
              onClickShowPopover={() => {
                if(viewModel.showFilterPopover !== 2) {
                  viewModel.setShowFilterPopover(2)
                } else{
                  viewModel.setShowFilterPopover(0)
                }
              }}
              onClickHidePopover={() => viewModel.setShowFilterPopover(0)}
              classname="second"
            >
              {viewModel.cateogryList.filter(first => viewModel.selectedFirstIdArray.includes(first.id)).map((first, fIndex) => (
                <div className={`first_group${first.name === '지출' ? ' expense' : first.name === '수입' ?  ' income' : ' saving'}`} key={`first${fIndex}`}>
                  <p className="first_name fs12">{first.name}</p>
                  <ul className="check_list flex ai-c flex-wrap">
                    {first.secondCategoryList.map((second, sIndex) => (
                      <li className="checkbox_field" key={`second${sIndex}`}>
                        <input type="checkbox" id={`${second.firstCategoryId}second${second.id}`} name="secondFilter"
                        checked={viewModel.selectedSecondIdArray.includes(second.id)}
                        onChange={e => {
                          if(e.target.checked) {
                            viewModel.setSelectedSecondIdArray(viewModel.selectedSecondIdArray.concat(second.id))
                          } else{
                            viewModel.setSelectedSecondIdArray(viewModel.selectedSecondIdArray.filter(id => id !== second.id))
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
              isShowFilterPopover={viewModel.showFilterPopover === 3}
              onClickShowPopover={() => {
                if(viewModel.showFilterPopover !== 3) {
                  viewModel.setShowFilterPopover(3)
                } else{
                  viewModel.setShowFilterPopover(0)
                }
              }}
              onClickHidePopover={() => viewModel.setShowFilterPopover(0)}
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
              {viewModel.paymentMethodList.map((payment, pIndex) => (
                <div className="checkbox_field" key={`payment${pIndex}`}>
                  <input type="checkbox" id={`payment${payment.id}`} name="type"
                    checked={viewModel.selectedPaymentMethodIdArray.includes(payment.id)}
                    onChange={e => {
                      if(e.target.checked){
                        viewModel.setSelectedPaymentMethodIdArray(viewModel.selectedPaymentMethodIdArray.concat(payment.id))
                      } else{
                        viewModel.setSelectedPaymentMethodIdArray(viewModel.selectedPaymentMethodIdArray.filter(id => id !== payment.id))
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
            onClick={() => viewModel.setShowEditHistoryModal(true)}
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
              {viewModel.filteredHistoryList.length === 0 && (
                <tr className="no-data">
                  <td colSpan={8}>작성된 내역이 없습니다.</td>
                </tr>
              )}
              {viewModel.filteredHistoryList.filter(v => moment(v.date).format('YYYY-MM') === viewModel.month).map((history, hIndex) => (
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
                          viewModel.setShowEditHistoryModal(true)
                          viewModel.setSelectedHistory(history)
                        }}
                      />
                      <button type="button"
                        className="btn_delete btn30"
                        onClick={() => viewModel.setModalAlertData({
                          message: '삭제하시겠습니까?',
                          leftButtonText: '취소',
                          rightButtonText: '삭제',
                          onClickLeftButton: () => viewModel.setModalAlertData(undefined),
                          onClickRightButton: () => {
                            viewModel.deleteHistory(history.id)
                            viewModel.setModalAlertData(undefined)
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
          previousLabel="<"
          nextLabel=">"
          onPageChange={({selected}) => {
            viewModel.changePage(selected + 1)
          }}
          pageRangeDisplayed={viewModel.pageSize}
          pageCount={Math.ceil(viewModel.historyCount/viewModel.pageSize)}
          forcePage={viewModel.page - 1}
          renderOnZeroPageCount={null}
        />
      </Container>

      {viewModel.showEditHistoryModal && (
        <EditHistoryModal
          cashbookHistory={viewModel.selectedHistory}
          categoryList={viewModel.cateogryList}
          paymentMethodList={viewModel.paymentMethodList}
          onClickCancel={() => {
            viewModel.setShowEditHistoryModal(false)
            viewModel.setSelectedHistory(undefined)
          }}
          onComplete={() => {
            viewModel.setShowEditHistoryModal(false)
            viewModel.setSelectedHistory(undefined)
            viewModel.getHistory()
          }}
        />
      )}

      {viewModel.modalAlertData && <AlertModal {...viewModel.modalAlertData} />}
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
      padding: 0 4px;
      a{
        width: 30px;
        height: 30px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }


      &.selected{
        a{
          background-color: ${Colors.main};
          color: white;
        }
      }
      &:not(.selected):hover{
        a{
          background-color: ${Colors.light_main};
          color: ${Colors.main};
        }
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
  } */
`