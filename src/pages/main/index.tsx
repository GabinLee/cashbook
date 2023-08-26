import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store";
import { Container } from "./styles";
import axios from "axios";
import Cashbook from "../../models/Cashbook.model";
import PopoverMenu from "../../components/popover/PopoverMenu";
import EditCashbookModal from "../../components/EditCashbookModal";
import AlertModal from "../../components/AlertModal";
import { ModalData } from "../../models/AlertModal.model";


export default function MainPage() {
  const token = useAppSelector(state => state.app.token);
  const navigate = useNavigate();

  const [cashbookList, setCashbookList] = useState<Cashbook[]>([]);
  const [showEditCashbook, setShowEditCashbook] = useState(false);
  const [selectedCashbook, setSelectedCashbook] = useState<Cashbook>();
  const [modalAlertData, setModalAlertData] = useState<ModalData>();

  useEffect(() => {
    getCashbookList();
  }, [])

  useEffect(() => {
    if(modalAlertData === undefined) {
      navigate('/');
    }
  }, [modalAlertData]);

  const getCashbookList = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/user/me/cash-book`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('캐쉬북 리스트 조회 성공', response.data.data)
        setCashbookList(response.data.data);
      } else{
        alert('error');
      }
    }).catch(error => console.log(error))
  }

  const addCashbook = (cashbookName: string, isGroup: boolean) => {
    axios.post(`${process.env.REACT_APP_HOST_URL}v1/cash-book`, {
      name: cashbookName,
      isGroup: isGroup
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('addCashbook 성공');
        setShowEditCashbook(false);
        getCashbookList();
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const editCashbook = (id: number, cashbookName: string, isGroup: boolean) => {
    axios.patch(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}`, {
      id: id,
      name: cashbookName,
      isGroup: isGroup
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('editCashbook');
        setShowEditCashbook(false);
        setSelectedCashbook(undefined);
        getCashbookList();
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const deleteCashbook = (id: number) => {
    axios.delete(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if(response.data.success) {
        setModalAlertData({
          message: '삭제되었습니다.',
          rightButtonText: '확인',
          onClickRightButton: () => setModalAlertData(undefined)
        });
        getCashbookList();
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }


  return (
    <>
      <Container className="main">
        <div className="add_cashbook">
          <button type="button" className="contained main"
            onClick={() => {
              setShowEditCashbook(true)
              setCashbookList(cashbookList.map(value => {
                value.isShowMoreMenu = false;
                return value;
              }))
            }}
          >캐쉬북 추가하기</button>
        </div>
        
        <section>
          <h5>일반</h5>
          <ul className="flex flex-wrap">
            {cashbookList.map((cashbook, cIndex) => !cashbook.isGroup && (
              <li key={`cashbook${cIndex}`}>
                <div className="card">
                  <div className="flex ai-c">
                    <h6 className="flex1">{cashbook.name}</h6>

                    <PopoverMenu
                      isShowMoreMenu={cashbook.isShowMoreMenu}
                      onClickShowMenu={() => {
                        setCashbookList(cashbookList.map(value => {
                          if(value.id === cashbook.id) value.isShowMoreMenu = true
                          else value.isShowMoreMenu = false;
                          return value;
                        }));
                      }}
                      onClickHideMenu={() => {
                        setCashbookList(cashbookList.map(value => {
                          value.isShowMoreMenu = false;
                          return value;
                        }))
                      }}
                      onClickEdit={() => {
                        setShowEditCashbook(true);
                        setSelectedCashbook(cashbook);
                        setCashbookList(cashbookList.map(value => {
                          value.isShowMoreMenu = false;
                          return value;
                        }));
                      }}
                      onClickDelete={() => {
                        setCashbookList(cashbookList.map(value => {
                          value.isShowMoreMenu = false;
                          return value;
                        }));
                        setModalAlertData({
                          message: '삭제하시겠습니까?',
                          leftButtonText: '취소',
                          rightButtonText: '삭제',
                          onClickLeftButton: () => setModalAlertData(undefined),
                          onClickRightButton: () => deleteCashbook(cashbook.id)
                        });
                      }}
                      styles={{
                        btnSize: 30
                      }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {cashbookList.filter(v => v.isGroup).length > 0 && (
          <section>
            <h5>모임통장</h5>
            <ul className="flex flex-wrap">
              {cashbookList.map((cashbook, cIndex) => cashbook.isGroup && (
                <li key={`cashbook${cIndex}`}>
                  <div className="card">
                    <div className="flex ai-c">
                      <h6 className="flex1">{cashbook.name}</h6>

                      <PopoverMenu
                        isShowMoreMenu={cashbook.isShowMoreMenu}
                        onClickShowMenu={() => {
                          setCashbookList(cashbookList.map(value => {
                            if(value.id === cashbook.id) value.isShowMoreMenu = true
                            else value.isShowMoreMenu = false
                            return value
                          }));
                        }}
                        onClickHideMenu={() => {
                          setCashbookList(cashbookList.map(value => {
                            value.isShowMoreMenu = false;
                            return value;
                          }))
                        }}
                        onClickEdit={() => {
                          setShowEditCashbook(true);
                          setSelectedCashbook(cashbook);
                          setCashbookList(cashbookList.map(value => {
                            value.isShowMoreMenu = false;
                            return value;
                          }));
                        }}
                        onClickDelete={() => {
                          setCashbookList(cashbookList.map(value => {
                            value.isShowMoreMenu = false;
                            return value;
                          }));
                          setModalAlertData({
                            message: '삭제하시겠습니까?',
                            leftButtonText: '취소',
                            rightButtonText: '삭제',
                            onClickLeftButton: () => setModalAlertData(undefined),
                            onClickRightButton: () => {
                              deleteCashbook(cashbook.id)
                              setModalAlertData(undefined)
                            }
                          });
                        }}
                        styles={{
                          btnSize: 30
                        }}
                      />
                    </div>

                    <div className="flex">
                      <p>잔액: </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>

      {showEditCashbook && (
        <EditCashbookModal
          cashbook={selectedCashbook}
          onClickCancel={() => {
            setShowEditCashbook(false)
            setSelectedCashbook(undefined)
          }}
          addCashbook={addCashbook}
          editCashbook={editCashbook}
          setShowEditCashbook={setShowEditCashbook}
        />
      )}

      {modalAlertData && <AlertModal {...modalAlertData} />}
    </>
  )
}