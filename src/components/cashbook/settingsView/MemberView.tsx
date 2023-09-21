import { MemberViewContainer } from "./styles";


export default function MemberView() {
  
  // const viewModel = SettingsHistoryViewModel()


  return (
    <MemberViewContainer className="set_cont">
      <button
        type="button"
        className="contained main btn add_member"
        // onClick={() => viewModel.setShowEditHistoryModal(true)}
      >멤버 추가</button>

      <p className="division_title">멤버(2)</p>
      <ul className="card">
        <li>
          <h6>김지훈<span>모임장</span></h6>
          <button>삭제</button>
        </li>
        <li>
          <h6>김민지</h6>
          <button>삭제</button>
        </li>
      </ul>

      <p className="division_title">대기중</p>
      <ul className="card">
        <li>
          <h6>김하영</h6>
          <button>초대 취소</button>
        </li>
      </ul>
    </MemberViewContainer>
  )
}