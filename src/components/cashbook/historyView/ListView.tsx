import moment from "moment"
import EditHistoryModal from "../modal/EditHistory.modal"
import { addComma } from "../../../utils/Utils"
import PopoverFilter from "../../popover/PopoverFilter"
import AlertModal from "../../AlertModal"
import ReactPaginate from "react-paginate"
import ListViewModel from "./List.viewmodel"
import { ListViewContainer } from "./styles"


export type ListViewProps = {
  year: string
  month: string
}

export default function ListView(props: ListViewProps) {
  
  const viewModel = ListViewModel(props);


  return (
    <>
      <ListViewContainer className="main_cont">
        <div className="area filter_add flex">
          <ul className="flex1 flex flex-wrap filter_list">
            <PopoverFilter
              filterName="카테고리"
              isShowFilterPopover={viewModel.showFilterPopover === 1}
              onClickShowPopover={() => {
                if(viewModel.showFilterPopover !== 1) {
                  viewModel.setShowFilterPopover(1)
                } else{
                  viewModel.setShowFilterPopover(0)
                }
              }}
              onClickHidePopover={() => {
                viewModel.setShowFilterPopover(0)
                viewModel.setCheckedFirstIdArray(viewModel.selectedFirstIdArray)
                viewModel.setCheckedPaymentIdArray(viewModel.selectedPaymentIdArray)
              }}
              classname="category"
              onClickReset={() => {
                viewModel.setCheckedFirstIdArray(viewModel.cateogryList.map(v => v.id))
                viewModel.setCheckedSecondIdArray(viewModel.checkedSecondIdArray.concat(...viewModel.cateogryList.map(first => first.secondCategoryList.map(second => second.id))))
                viewModel.setCheckedPaymentIdArray(viewModel.paymentMethodList.map(v => v.id))
              }}
              onClickApplyFilter={() => {
                viewModel.setSelectedFirstIdArray(viewModel.checkedFirstIdArray)
                viewModel.setSelectedSecondIdArray(viewModel.checkedSecondIdArray)
                viewModel.setSelectedPaymentIdArray(viewModel.checkedPaymentIdArray)
                viewModel.setShowFilterPopover(0)
              }}
            >
              {/* <div className="checkbox_field">
                <input type="checkbox" id={`first_all`} name="type"
                  checked={viewModel.selectedFirstIdArray.length === viewModel.cateogryList.map(v =>v.id).length ? true : false}
                  onChange={e => 
                  //   {
                  //   if(e.target.checked){
                  //     viewModel.setCheckedFirstIdArray(viewModel.cateogryList.map(v => v.id))
                  //     // viewModel.setSelectedFirstIdArray(viewModel.selectedFirstIdArray.concat(first.id))
                  //   } else{
                  //     viewModel.setCheckedFirstIdArray([])
                  //   }
                  // }
                }
                />
                <label htmlFor={`first_all`}>
                  <span className={`mark`} />
                  <p>전체</p>
                </label>
              </div> */}
              <div className="title">
                <p>거래유형</p>
                <p>1차</p>
                <p>2차</p>
              </div>
              {viewModel.cateogryList.map((first, fIndex) => (
                <li key={`first${fIndex}`} className={`first${first.name === '지출' ? ' expense' : first.name === '수입' ?  ' income' : ' saving'}`}>
                  <div className="checkbox_field">
                    <input type="checkbox" id={`first${first.id}`} name="type"
                      checked={viewModel.checkedFirstIdArray.includes(first.id)}
                      onChange={e => {
                        const firstSecondIds = first.secondCategoryList.filter(second => second.firstCategoryId === first.id);
                         // 체크시
                        if(e.target.checked){
                          viewModel.setCheckedFirstIdArray([...viewModel.checkedFirstIdArray, first.id])
                          if(firstSecondIds){
                            viewModel.setCheckedSecondIdArray(Array.from(new Set(viewModel.checkedSecondIdArray.concat(firstSecondIds.map(v => v.id)))))
                          }
                        } else{  // 체크 해제시
                          viewModel.setCheckedFirstIdArray(viewModel.checkedFirstIdArray.filter(id => id !== first.id))
                          if(firstSecondIds){
                            viewModel.setCheckedSecondIdArray(viewModel.checkedSecondIdArray.filter(id => !first.secondCategoryList.map(v => v.id).includes(id)))
                          }
                        }
                      }}
                    />
                    <label htmlFor={`first${first.id}`}>
                      <span className={`mark first${first.id}`} />
                      <p>{first.name}</p>
                    </label>
                  </div>

                  <ul className="second">
                    {first.secondCategoryList.map((second, sIndex) => (
                      <li key={`second${sIndex}`}>
                        <div className="checkbox_field" key={`second${sIndex}`}>
                          <input type="checkbox" id={`${second.firstCategoryId}second${second.id}`} name="secondFilter"
                          checked={viewModel.checkedSecondIdArray.includes(second.id)}
                          onChange={e => {
                            // 체크시
                            if(e.target.checked) {
                              viewModel.setCheckedSecondIdArray([...viewModel.checkedSecondIdArray, second.id])
                              if(!viewModel.checkedFirstIdArray.includes(first.id)) {
                                viewModel.setCheckedFirstIdArray([...viewModel.checkedFirstIdArray, first.id])
                              }
                            } else{ // 체크 해제시
                              viewModel.setCheckedSecondIdArray(viewModel.checkedSecondIdArray.filter(id => id !== second.id))
                            }
                          }}
                        />
                          <label htmlFor={`${second.firstCategoryId}second${second.id}`}>
                            <span className="mark" />
                            <p>{second.name}</p>
                          </label>
                        </div>

                        {second.thirdCategoryList.length !== 0 && (
                          <ul className="third">
                            {second.thirdCategoryList.map((third, tIndex) => (
                              <li className="checkbox_field" key={`third${tIndex}`}>
                                <input type="checkbox" id={`${second.firstCategoryId}second${second.id}third${third.id}`} name="thirdFilter"
                                checked={viewModel.checkedSecondIdArray.includes(second.id)}
                                onChange={e => {
                                  if(e.target.checked) {
                                    // viewModel.setCheckedSecondIdArray([...viewModel.checkedSecondIdArray, second.id])
                                  } else{
                                    // viewModel.setCheckedSecondIdArray(viewModel.checkedSecondIdArray.filter(id => id !== second.id))
                                  }
                                }}
                              />
                                <label htmlFor={`${second.firstCategoryId}second${second.id}third${third.id}`}>
                                  <span className="mark" />
                                  <p>{third.name}</p>
                                </label>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
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
              onClickHidePopover={() => {
                viewModel.setShowFilterPopover(0)
                viewModel.setCheckedPaymentIdArray(viewModel.selectedPaymentIdArray)
              }}
              classname="payment_method"
              onClickReset={() => viewModel.setCheckedPaymentIdArray(viewModel.paymentMethodList.map(v => v.id))}
              onClickApplyFilter={() => {
                viewModel.setShowFilterPopover(0)
                viewModel.setSelectedPaymentIdArray(viewModel.checkedPaymentIdArray)
              }}
            >
              {/* <div className="checkbox_field">
                <input type="checkbox" id="payment_all" name="type"
                  // checked={selectedPaymentMethodIdArray === paymentMethodList.map(v => v.id)}
                  onChange={e => {
                    if(e.target.checked){
                      // setSelectedPaymentMethodIdArray(selectedPaymentMethodIdArray.concat(payment.id))
                    } else{
                      // setSelectedPaymentMethodIdArray(selectedPaymentMethodIdArray.filter(id => id !== payment.id))
                    }
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
                    checked={viewModel.checkedPaymentIdArray.includes(payment.id)}
                    onChange={e => {
                      if(e.target.checked){
                        viewModel.setCheckedPaymentIdArray([...viewModel.checkedPaymentIdArray, payment.id])
                      } else{
                        viewModel.setCheckedPaymentIdArray(viewModel.checkedPaymentIdArray.filter(id => id !== payment.id))
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
              {viewModel.historyList.length === 0 && (
                <tr className="no-data">
                  <td colSpan={9}>작성된 내역이 없습니다.</td>
                </tr>
              )}
              {viewModel.filteredHistoryList.map((history, hIndex) => (
                <tr key={`history${hIndex}`}>
                  <td>{moment(history.date).format('YYYY.MM.DD')}</td>
                  <td>{history.description}</td>
                  <td className="price">{addComma(history.price)}</td>
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

        {Math.ceil(viewModel.historyCount/viewModel.pageSize) > 1 && (
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
        )}
      </ListViewContainer>

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