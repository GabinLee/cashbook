import styled from "styled-components";
import { ModalData } from "../models/Modal.model";
import BaseModal from "./BaseModal.modal";


export default function AlertModal(props: ModalData) {

  return (
    <BaseModal>
      <AlertModalDiv className="card">
        <div className="card_middle">{props.message}</div>
        
        <div className="card_bottom">
          {props.leftButtonText && (
            <button
              type="button"
              className="contained gray"
              onClick={props.onClickLeftButton}
            >{props.leftButtonText}</button>
          )}
          <button
            type="button"
            className="contained main"
            onClick={props.onClickRightButton}
          >{props.rightButtonText}</button>
        </div>
      </AlertModalDiv>
    </BaseModal>
  );
}


const AlertModalDiv  = styled.div`
  width: 360px;
`