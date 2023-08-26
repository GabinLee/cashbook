import styled from "styled-components";
import { ModalData } from "../models/AlertModal.model";
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
  /* 
  min-width: 0 !important;
  .alert_cont{
    padding: 40px 30px;
    p{
      font-size: var(--font16);
    }
  }
  .alert_btn_group{
    border-top: var(--border_gray_e5);
    display: flex;
    button{
      flex: 1;
      height: 50px;
      background-color: transparent;
      border: none;
      transition: background-color .2s;
      &:hover{
        font-weight: 500;
      }

      &.color_gray6:hover{
        background-color: #f6f6f6;
      }
      &.color_red:hover{
        background-color: #ffeded;
      }
      &.color_main:hover{
        background-color: #ecf0f7;
      }

      + button{
        border-left: var(--border_gray_e5);
      }
    }
  } */
`