import { SettingsContainer } from "./styles";
import SettingsViewModel from "./Settings.viewmodel";
import PopoverMenu from "../../components/popover/PopoverMenu";
import AlertModal from "../../components/AlertModal";
import EditSecondCategoryModal from "../../components/cashbook/modal/EditSecondCategory.modal";
import EditThirdCategoryModal from "../../components/cashbook/modal/EditThirdCategory.modal";
import EditPaymentMethodModal from "../../components/cashbook/modal/EditPaymentMethod.modal";


export default function SettingsPage() {
  
  const viewModel = SettingsViewModel();


  return (
    <>
      <SettingsContainer>
        <section className="card category">
          <div className="card_title flex ai-e">
            <p>카테고리</p>
            <p className="fs12">거래유형별 1차, 2차 카테고리를 설정할 수 있습니다.</p>
          </div>

          <div className="card_cont">
            <div className="grid head">
              <p className="type">거래유형</p>
              <p className="first">1차</p>
              <p>2차</p>
            </div>

            {viewModel.cateogryList.map((firstItem, fIndex) => (
              <div className="grid body" key={`type${fIndex}`}>
                <p className="type">{firstItem.name}</p>
                <ul>
                  {firstItem.secondCategoryList.map((secondItem, sIndex) => (
                    <li className="grid" key={`secondItem ${sIndex}`}>
                      <div className="second flex ai-c">
                        <p className="flex1">{secondItem.name}</p>
                        <PopoverMenu
                          isShowMoreMenu={secondItem.isShowMoreMenu}
                          onClickShowMenu={() => {
                            viewModel.setCategoryList(viewModel.cateogryList.map(first => {
                              first.secondCategoryList.map(second => {
                                if(second.id === secondItem.id) {
                                  second.isShowMoreMenu = !second.isShowMoreMenu
                                } else{
                                  second.isShowMoreMenu = false
                                }

                                second.thirdCategoryList.map(third => {
                                  third.isShowMoreMenu = false
                                })
                              })

                              return first
                            }))
                          }}
                          onClickHideMenu={() => {
                            viewModel.setCategoryList(viewModel.cateogryList.map(first => {
                              first.secondCategoryList.map(second => second.isShowMoreMenu = false)

                              return first
                            }))
                          }}
                          onClickEdit={() => {
                            viewModel.setShowEditSecondCategoryModal(true)
                            viewModel.setSelectedFirst(firstItem)
                            viewModel.setSelectedSecond(secondItem)
                            viewModel.setCategoryList(viewModel.cateogryList.map(first => {
                              if(first.id === firstItem.id) {
                                first.secondCategoryList.map(second => {
                                  if(second.id === secondItem.id) {
                                    second.isShowMoreMenu = !second.isShowMoreMenu
                                  } else{
                                    second.isShowMoreMenu = false
                                  }

                                  return second
                                })
                              } else{
                                first.secondCategoryList.map(second => {
                                  second.isShowMoreMenu = false

                                  return second
                                })
                              }
                              return first
                            }))
                          }}
                          onClickDelete={() => {
                            viewModel.setCategoryList(viewModel.cateogryList.map(first => {
                              first.secondCategoryList.map(second => second.isShowMoreMenu = false)
                              return first
                            }))

                            viewModel.setModalAlertData({
                              message: '삭제하시겠습니까?',
                              leftButtonText: '취소',
                              rightButtonText: '삭제',
                              onClickLeftButton: () => viewModel.setModalAlertData(undefined),
                              onClickRightButton: () => {
                                // deleteSecondCategory(secondItem.id)
                                viewModel.setModalAlertData(undefined)
                              }
                            })
                          }}
                          styles={{
                            btnSize: 30
                          }}
                        />
                      </div>
                      <ul className="third flex ai-c">
                        <li>
                          <button type="button" className="btn add"
                            onClick={() => {
                              viewModel.setShowEditThirdCategoryModal(true)
                              viewModel.setSelectedFirst(firstItem)
                              viewModel.setSelectedSecond(secondItem)
                            }}
                          />
                        </li>
                        {secondItem.thirdCategoryList.map((thirdItem, tIndex) => (
                          <li className="flex ai-c" key={`thirdItem ${tIndex}`}>
                            <p>{thirdItem.name}</p>
                            <PopoverMenu
                              isShowMoreMenu={thirdItem.isShowMoreMenu}
                              onClickShowMenu={() => {
                                viewModel.setCategoryList(viewModel.cateogryList.map(first => {
                                  first.secondCategoryList.map(second => {
                                    second.isShowMoreMenu = false;
                                    second.thirdCategoryList.map(third => {
                                      if(third.id === thirdItem.id) {
                                        third.isShowMoreMenu = !third.isShowMoreMenu
                                      } else{
                                        third.isShowMoreMenu = false
                                      }
                                    })
                                  })
                                  
                                  return first
                                }))
                              }}
                              onClickHideMenu={() => {
                                viewModel.setCategoryList(viewModel.cateogryList.map(first => {
                                  first.secondCategoryList.map(second => {
                                    second.thirdCategoryList.map(third => third.isShowMoreMenu = false)
                                  })

                                  return first;
                                }))
                              }}
                              onClickEdit={() => {
                                viewModel.setShowEditThirdCategoryModal(true)
                                viewModel.setSelectedFirst(firstItem)
                                viewModel.setSelectedSecond(secondItem)
                                viewModel.setSelectedThird(thirdItem)
                                viewModel.setCategoryList(viewModel.cateogryList.map(first => {
                                  first.secondCategoryList.map(second => {
                                    second.thirdCategoryList.map(third => {
                                      third.isShowMoreMenu = false

                                      return third;
                                    })

                                    return second;
                                  })

                                  return first;
                                }))
                              }}
                              onClickDelete={() => {
                                viewModel.setCategoryList(viewModel.cateogryList.map(first => {
                                  first.secondCategoryList.map(second => {
                                    second.thirdCategoryList.map(third => third.isShowMoreMenu = false)
                                  })
                                  return first
                                }))

                                viewModel.setModalAlertData({
                                  message: '삭제하시겠습니까?',
                                  leftButtonText: '취소',
                                  rightButtonText: '삭제',
                                  onClickLeftButton: () => viewModel.setModalAlertData(undefined),
                                  onClickRightButton: () => {
                                    // deleteThirdCategory(thirdItem.id)
                                    viewModel.setModalAlertData(undefined)
                                  }
                                })
                              }}
                              styles={{
                                btnSize: 24
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}

                  <li className="add_second">
                    <button type="button" className="btn add"
                      onClick={() => {
                        viewModel.setShowEditSecondCategoryModal(true)
                        viewModel.setSelectedFirst(firstItem)
                      }}
                    />
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="card payment_method">
          <div className="card_title flex ai-e">
            <p>결제수단</p>
            <p className="fs12">거래시 사용하는 결제 수단을 설정할 수 있습니다.</p>
          </div>

          <div className="card_cont">
            <button type="button" className="btn add"
              onClick={() => {
                viewModel.setShowEditPaymentMethodModal(true)
              }}
            />
            <ul className="flex flex-wrap">
              {viewModel.paymentMethodList.map((method, mIndex) => (
                <li key={`method${mIndex}`}>
                  <div className="flex ai-c">
                    <p>
                      <span>{method.name}</span>
                      {(method.type === 0 && false) && <span>({method.paymentDay}일)</span>}
                    </p>
                    <button className="btn_edit btn30"
                      onClick={() => {
                        viewModel.setShowEditPaymentMethodModal(true)
                        viewModel.setSelectedPaymentMethod(method)
                      }}
                    ></button>
                    <button className="btn_delete btn30"
                      onClick={() => {
                        viewModel.setModalAlertData({
                          message: '삭제하시겠습니까?',
                          leftButtonText: '취소',
                          rightButtonText: '삭제',
                          onClickLeftButton: () => viewModel.setModalAlertData(undefined),
                          onClickRightButton: () => {
                            // deletePaymentMethod(method.id)
                            viewModel.setModalAlertData(undefined)
                          }
                        })
                      }}
                    ></button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </SettingsContainer>

      {viewModel.showEditSecondCategoryModal && (
        <EditSecondCategoryModal
          firstCategory={viewModel.selectedFirst}
          secondCategory={viewModel.selectedSecond}
          onClickCancel={() => {
            viewModel.setShowEditSecondCategoryModal(false)
            viewModel.setSelectedFirst(undefined)
            viewModel.setSelectedSecond(undefined)
          }}
          onComplete={() => {
            viewModel.setShowEditSecondCategoryModal(false)
            viewModel.setSelectedFirst(undefined)
            viewModel.setSelectedSecond(undefined)
            viewModel.getCategory()
          }}
        />
      )}

      {viewModel.showEditThirdCategoryModal && (
        <EditThirdCategoryModal
          firstCategory={viewModel.selectedFirst}
          secondCateagory={viewModel.selectedSecond}
          thirdCategory={viewModel.selectedThird}
          onClickCancel={() => {
            viewModel.setShowEditThirdCategoryModal(false)
            viewModel.setSelectedFirst(undefined)
            viewModel.setSelectedSecond(undefined)
            viewModel.setSelectedThird(undefined)
          }}
          onComplete={() => {
            viewModel.setShowEditThirdCategoryModal(false)
            viewModel.setSelectedFirst(undefined)
            viewModel.setSelectedSecond(undefined)
            viewModel.setSelectedThird(undefined)
            viewModel.getCategory()
          }}
        />
      )}

      {viewModel.showEditPaymentMethodModal && (
        <EditPaymentMethodModal
          paymentMethod={viewModel.selectedPaymentMethod}
          onClickCancel={() => {
            viewModel.setShowEditPaymentMethodModal(false)
            viewModel.setSelectedPaymentMethod(undefined)
          }}
          onComplete={() => {
            viewModel.setShowEditPaymentMethodModal(false)
            viewModel.setSelectedPaymentMethod(undefined)
            viewModel.getPaymentMethod()
          }}
        />
      )}

      {viewModel.modalAlertData && <AlertModal {...viewModel.modalAlertData} />}
    </>
  )
}

