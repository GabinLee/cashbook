import styled from "styled-components";
import BaseModal from "../BaseModal.modal";

type InviteMemeberModalData = {
  leftButtonText: string
  onClickLeftButton: () => void
  rightButtonText: string
  onClickRightButton: () => void
}


export default function InviteMemberModal(props: InviteMemeberModalData) {

  return (
    <BaseModal>
      <InviteMemberModalDiv className="card">
        <div className="card_middle"></div>

        <div className="card_bottom">
          <button
            type="button"
            className="contained gray"
            onClick={props.onClickLeftButton}
          >{props.leftButtonText}</button>
          <button
            type="button"
            className="contained main"
            onClick={props.onClickRightButton}
          >{props.rightButtonText}</button>
        </div>
      </InviteMemberModalDiv>
    </BaseModal>
  );
}


const InviteMemberModalDiv  = styled.div`
  width: 360px;
`