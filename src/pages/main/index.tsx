import { Container } from "./styles";
import PopoverMenu from "../../components/popover/PopoverMenu";
import EditCashbookModal from "../../components/EditCashbookModal";
import AlertModal from "../../components/AlertModal";
import MainViewModel from "./Main.viewmodel";
import InviteMemberModal from "../../components/main/InviteMember.modal";


export default function MainPage() {
  
  const viewModel = MainViewModel();

  return (
    <>
      <Container className="main">
        <div className="add_cashbook">
          <button type="button" className="contained main"
            onClick={() => {
              viewModel.setShowEditCashbook(true)
              viewModel.setCashbookList(viewModel.cashbookList.map(value => {
                value.isShowMoreMenu = false;
                return value;
              }))
            }}
          >캐쉬북 추가하기</button>
        </div>
        
        <section>
          <h5>일반</h5>
          <ul className="flex flex-wrap">
            {viewModel.cashbookList.map((cashbook, cIndex) => !cashbook.isGroup && (
              <li key={`cashbook${cIndex}`}>
                <div className="card">
                  <div className="flex ai-c">
                    <h6 className="flex1">{cashbook.name}</h6>

                    <PopoverMenu
                      isGroup={cashbook.isGroup}
                      isShowMoreMenu={cashbook.isShowMoreMenu}
                      onClickShowMenu={() => {
                        viewModel.setCashbookList(viewModel.cashbookList.map(value => {
                          if(value.id === cashbook.id) value.isShowMoreMenu = true
                          else value.isShowMoreMenu = false;
                          return value;
                        }));
                      }}
                      onClickHideMenu={() => {
                        viewModel.setCashbookList(viewModel.cashbookList.map(value => {
                          value.isShowMoreMenu = false;
                          return value;
                        }))
                      }}
                      onClickEdit={() => {
                        viewModel.setShowEditCashbook(true);
                        viewModel.setSelectedCashbook(cashbook);
                        viewModel.setCashbookList(viewModel.cashbookList.map(value => {
                          value.isShowMoreMenu = false;
                          return value;
                        }));
                      }}
                      onClickDelete={() => {
                        viewModel.setCashbookList(viewModel.cashbookList.map(value => {
                          value.isShowMoreMenu = false;
                          return value;
                        }));
                        viewModel.setModalAlertData({
                          message: '삭제하시겠습니까?',
                          leftButtonText: '취소',
                          rightButtonText: '삭제',
                          onClickLeftButton: () => viewModel.setModalAlertData(undefined),
                          onClickRightButton: () => viewModel.deleteCashbook(cashbook.id)
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

        {viewModel.cashbookList.filter(v => v.isGroup).length > 0 && (
          <section>
            <h5>모임통장</h5>
            <ul className="flex flex-wrap">
              {viewModel.cashbookList.map((cashbook, cIndex) => cashbook.isGroup && (
                <li key={`cashbook${cIndex}`}>
                  <div className="card">
                    <div className="flex ai-c">
                      <h6 className="flex1">{cashbook.name}</h6>

                      <PopoverMenu
                        isGroup={cashbook.isGroup}
                        isShowMoreMenu={cashbook.isShowMoreMenu}
                        onClickShowMenu={() => {
                          viewModel.setCashbookList(viewModel.cashbookList.map(value => {
                            if(value.id === cashbook.id) value.isShowMoreMenu = true
                            else value.isShowMoreMenu = false
                            return value
                          }));
                        }}
                        onClickHideMenu={() => {
                          viewModel.setCashbookList(viewModel.cashbookList.map(value => {
                            value.isShowMoreMenu = false;
                            return value;
                          }))
                        }}
                        onClickInvite={() => {
                          viewModel.setShowInviteMember(true);
                          viewModel.setCashbookList(viewModel.cashbookList.map(value => {
                            value.isShowMoreMenu = false;
                            return value;
                          }));
                        }}
                        onClickEdit={() => {
                          viewModel.setShowEditCashbook(true);
                          viewModel.setSelectedCashbook(cashbook);
                          viewModel.setCashbookList(viewModel.cashbookList.map(value => {
                            value.isShowMoreMenu = false;
                            return value;
                          }));
                        }}
                        onClickDelete={() => {
                          viewModel.setCashbookList(viewModel.cashbookList.map(value => {
                            value.isShowMoreMenu = false;
                            return value;
                          }));
                          viewModel.setModalAlertData({
                            message: '삭제하시겠습니까?',
                            leftButtonText: '취소',
                            rightButtonText: '삭제',
                            onClickLeftButton: () => viewModel.setModalAlertData(undefined),
                            onClickRightButton: () => {
                              viewModel.deleteCashbook(cashbook.id)
                              viewModel.setModalAlertData(undefined)
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

      {viewModel.showEditCashbook && (
        <EditCashbookModal
          cashbook={viewModel.selectedCashbook}
          onClickCancel={() => {
            viewModel.setShowEditCashbook(false)
            viewModel.setSelectedCashbook(undefined)
          }}
          addCashbook={viewModel.addCashbook}
          editCashbook={viewModel.editCashbook}
          setShowEditCashbook={viewModel.setShowEditCashbook}
        />
      )}

      {viewModel.showInviteMember && (
        <InviteMemberModal
          leftButtonText="취소"
          onClickLeftButton={() => viewModel.setShowInviteMember(false)}
          rightButtonText="초대"
          onClickRightButton={() => {}}
        />
      )}

      {viewModel.modalAlertData && <AlertModal {...viewModel.modalAlertData} />}
    </>
  )
}