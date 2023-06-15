import styled from "styled-components"
import { Colors } from "../../style/Styles";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import FirstCategory, { SecondCategory, ThirdCategory } from "../../models/Category.model";
import EditSecondCategoryModal from "./EditSecondCategoryModal";
import EditThirdCategoryModal from "./EditThirdCategoryModal";
import EditPaymentMethodModal from "./EditPaymentMethodModal";
import PaymentMethod from "../../models/PaymentMethod.model";


export default function SettingsView() {
  const {id} = useParams()
  const tokenRef = useRef('')
  // const popoverRef = useRef<any>(null)

  const [cateogryList, setCategoryList] = useState<FirstCategory[]>([])
  const [selectedFirst, setSelectedFirst] = useState<FirstCategory>()
  const [showEditSecondCategoryModal, setShowEditSecondCategoryModal] = useState(false)
  const [selectedSecond, setSelectedSecond] = useState<SecondCategory>()
  const [showEditThirdCategoryModal, setShowEditThirdCategoryModal] = useState(false)
  const [selectedThird, setSelectedThird] = useState<ThirdCategory>()

  const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([])
  const [showEditPaymentMethodModal, setShowEditPaymentMethodModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>()


  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''
    
  }, [])

  useEffect(() => {
    getCategory()
    getPaymentMethod()
  }, [id])

  // useEffect(() => {
  //   const outsideTouch = (e: MouseEvent) => {
  //     if(popoverRef.current && !popoverRef.current.contains(e.target)) {
  //       setCategoryList(cateogryList.map(value => {
  //         value.secondCategoryList.map(firstValue => (
  //           firstValue.isShowMoreMenu = false
  //         ))
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

  const deleteSecondCategory = (id: number) => {
    axios.delete(`${process.env.REACT_APP_HOST_URL}v1/trade-category/second/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('1차 카테고리 삭제 성공, deleteSecondCategory')

        getCategory()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const deleteThirdCategory = (id: number) => {
    axios.delete(`${process.env.REACT_APP_HOST_URL}v1/trade-category/third/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('2차 카테고리 삭제 성공, deleteThirdCategory')

        getCategory()
      } else{
        alert('error')
      }
    }).catch(error =>  console.log(error))
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

  const deletePaymentMethod = (id: number) => {
    axios.delete(`${process.env.REACT_APP_HOST_URL}v1/payment-method/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('결제수단 삭제 성공')

        getPaymentMethod()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }


  return (
    <>
      <Container className="contents">
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

            {cateogryList.map((firstItem, fIndex) => (
              <div className="grid body" key={`type${fIndex}`}>
                <p className="type">{firstItem.name}</p>
                <ul>
                  {firstItem.secondCategoryList.map((secondItem, sIndex) => (
                    <li className="grid" key={`secondItem ${sIndex}`}>
                      <div className="first flex ai-c">
                        <p className="flex1">{secondItem.name}</p>
                        <div className="popover">
                          <button type="button" className="btn_ic more"
                            onClick={() => {
                              setCategoryList(cateogryList.map(first => {
                                if(first.id === firstItem.id) {
                                  first.secondCategoryList.map(second => {
                                    if(second.id === secondItem.id) {
                                      // !second.isShowMoreMenu && (second.isShowMoreMenu = true)
                                      second.isShowMoreMenu = !second.isShowMoreMenu
                                    } else{
                                      second.isShowMoreMenu = false
                                    }

                                    return second
                                  })
                                } else{
                                  first.secondCategoryList.map(second => {
                                    second.isShowMoreMenu = false
                                  })
                                }

                                first.secondCategoryList.map(second => {
                                  second.thirdCategoryList.map(third => {
                                    third.isShowMoreMenu = false
                                  })
                                })
                                
                                return first
                              }))
                            }}
                          />
                          {secondItem.isShowMoreMenu && (
                            <div className="popover_menu"
                              // ref={popoverRef}
                            >
                              <button type="button"
                                onClick={() => {
                                  setShowEditSecondCategoryModal(true)
                                  setSelectedFirst(firstItem)
                                  setSelectedSecond(secondItem)
                                  setCategoryList(cateogryList.map(first => {
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
                              >수정</button>
                              <button type="button"
                                onClick={() => {
                                  deleteSecondCategory(secondItem.id)
                                }}
                              >삭제</button>
                            </div>
                          )}
                        </div>
                      </div>
                      <ul className="second flex ai-c">
                        <li>
                          <button type="button" className="btn_ic add"
                            onClick={() => {
                              setShowEditThirdCategoryModal(true)
                              setSelectedFirst(firstItem)
                              setSelectedSecond(secondItem)
                            }}
                          />
                        </li>
                        {secondItem.thirdCategoryList.map((thirdItem, tIndex) => (
                          <li className="flex ai-c" key={`thirdItem ${tIndex}`}>
                            <p>{thirdItem.name}</p>
                            <div className="popover">
                              <button type="button" className="btn_ic more"
                                onClick={() => {
                                  setCategoryList(cateogryList.map(first => {
                                    (first.id === firstItem.id) && (
                                      first.secondCategoryList.map(second => {
                                        if(second.id === secondItem.id){
                                          second.thirdCategoryList.map(third => {
                                            if(third.id === thirdItem.id){
                                              // !third.isShowMoreMenu && (third.isShowMoreMenu = true)
                                              third.isShowMoreMenu = !third.isShowMoreMenu
                                            } else{
                                              third.isShowMoreMenu = false
                                            }
                                            return third
                                          })
                                        } else{
                                          second.thirdCategoryList.map(third => {
                                            third.isShowMoreMenu = false
                                          })
                                        }

                                        second.isShowMoreMenu = false

                                        return second
                                      })
                                    )
                                    return first
                                  }))
                                }}
                              />
                              {thirdItem.isShowMoreMenu && (
                                <div className="popover_menu"
                                  // ref={popoverRef}
                                >
                                  <button type="button"
                                    onClick={() => {
                                      setShowEditThirdCategoryModal(true)
                                      setSelectedFirst(firstItem)
                                      setSelectedSecond(secondItem)
                                      setSelectedThird(thirdItem)
                                      setCategoryList(cateogryList.map(first => {
                                        first.secondCategoryList.map(second => {
                                          second.thirdCategoryList.map(third => {
                                            third.isShowMoreMenu = false

                                            return third
                                          })

                                          return second
                                        })

                                        return first
                                      }))
                                    }}
                                  >수정</button>
                                  <button type="button"
                                    onClick={() => {deleteThirdCategory(thirdItem.id)}}
                                  >삭제</button>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}

                  <li>
                    <button type="button" className="btn_ic add"
                      onClick={() => {
                        setShowEditSecondCategoryModal(true)
                        setSelectedFirst(firstItem)
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
            <button type="button" className="btn_ic add"
              onClick={() => {
                setShowEditPaymentMethodModal(true)
              }}
            />
            <ul className="flex flex-wrap">
              {paymentMethodList.map((method, mIndex) => (
                <li key={`method${mIndex}`}>
                  <div className="flex ai-c">
                    <p>
                      <span>{method.name}</span>
                      {(method.type === 0) && <span>({method.paymentDay}일)</span>}
                    </p>
                    <button className="btn_ic edit"
                      onClick={() => {
                        setShowEditPaymentMethodModal(true)
                        setSelectedPaymentMethod(method)
                      }}
                    ></button>
                    <button className="btn_ic delete"
                      onClick={() => deletePaymentMethod(method.id)}
                    ></button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Container>

      {showEditSecondCategoryModal && (
        <EditSecondCategoryModal
          firstCategory={selectedFirst}
          secondCategory={selectedSecond}
          onClickCancel={() => {
            setShowEditSecondCategoryModal(false)
            setSelectedFirst(undefined)
            setSelectedSecond(undefined)
          }}
          onComplete={() => {
            setShowEditSecondCategoryModal(false)
            setSelectedFirst(undefined)
            setSelectedSecond(undefined)
            getCategory()
          }}
        />
      )}

      {showEditThirdCategoryModal && (
        <EditThirdCategoryModal
          firstCategory={selectedFirst}
          secondCateagory={selectedSecond}
          thirdCategory={selectedThird}
          onClickCancel={() => {
            setShowEditThirdCategoryModal(false)
            setSelectedFirst(undefined)
            setSelectedSecond(undefined)
            setSelectedThird(undefined)
          }}
          onComplete={() => {
            setShowEditThirdCategoryModal(false)
            setSelectedFirst(undefined)
            setSelectedSecond(undefined)
            setSelectedThird(undefined)
            getCategory()
          }}
        />
      )}

      {showEditPaymentMethodModal && (
        <EditPaymentMethodModal
          paymentMethod={selectedPaymentMethod}
          onClickCancel={() => {
            setShowEditPaymentMethodModal(false)
            setSelectedPaymentMethod(undefined)
          }}
          onComplete={() => {
            setShowEditPaymentMethodModal(false)
            setSelectedPaymentMethod(undefined)
            getPaymentMethod()
          }}
        />
      )}
    </>
  )
}

const Container = styled.div`
  .card{
    border-radius: 12px;
    + .card{
      margin-top: 24px;
    }

    .btn_ic{
      &.more{
        background: url(images/more.svg) no-repeat center center / 12px 12px;
        &:hover{
          background: ${Colors.gray_e} url(images/more.svg) no-repeat center center / 12px 12px;
        }
      }

      &.add{
        width: 30px;
        height: 30px;
        background: url(images/add.svg) no-repeat center center / 14px 14px;
        &:hover{
          background-color: ${Colors.gray_e5};
        }
      }
    }


    &_title{
      padding: 12px 18px;
      p.fs12{
        margin-left: 12px;
      }
    }
    &_cont{
      border-top: 1px solid ${Colors.gray_c};
    }

    &.category{
      .card_cont{
        .popover{
          padding-left: 4px;
        }

        .grid{
          display: grid;
          .type, .first{
            border-right: 1px solid ${Colors.gray_e5};
          }

          
          &.head{
            grid-template-columns: 140px 140px auto;
            p{
              padding: 12px 18px;
              font-size: 12px;
              color: ${Colors.gray_5};
            }
          }

          &.body{
            grid-template-columns: 140px auto;
            border-top: 1px solid ${Colors.gray_e5};

            &:nth-child(even){
              background-color: #f6f6f6;
              &:last-child{
                border-radius: 0 0 12px 12px;
              }
            }

            .type{
              padding: 12px 18px;
            }
            li{
              &.grid{
                grid-template-columns: 140px auto;
                + li{
                  border-top: 1px solid ${Colors.gray_e5};
                }
                
                .first{
                  padding: 5px 9px 5px 18px;
                  .popover{
                    width: 34px;
                    height: 30px;
                  }
                }

                ul.second{
                  li{
                    &:nth-child(1){
                      padding: 0 3px 0 10px;
                    }
                    &.flex.ai-c{
                      height: 100%;
                      padding: 6px 7px 6px 14px;
                      position: relative;
                      &:before{
                        content: '';
                        width: calc(100% - 6px);
                        height: calc(100% - 12px);
                        border-radius: 15px;
                        background-color: ${Colors.light_main};
                        position: absolute;
                        top: 6px;
                        left: 3px;
                      }
                      p{
                        position: relative;
                      }
                      .popover{
                        width: 28px;
                        height: 24px;
                        .btn_ic.more{
                          background: url(images/more.svg) no-repeat center center / 12px 12px;
                          &:hover{
                            background: white url(images/more.svg) no-repeat center center / 12px 12px;
                          }
                        }
                      }
                    }
                  }
                }
              }

              &:not(.grid){
                padding: 5px 10px;
              }
            }
          }
        }
      }
    }

    &.payment_method{
      .card_cont{
        padding: 12px;
        li{
          padding: 6px;
          div{
            padding: 12px;
            border-radius: 6px;
            box-shadow: rgba(34, 34, 34, 0.1) 2px 2px 6px 2px;
            p{
              padding-right: 24px;
              white-space: nowrap;
            }
            .btn_ic.edit{
              margin-right: 6px;
            }
          }
        }
      }
    }
  }
`