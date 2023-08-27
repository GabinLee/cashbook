import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import Cashbook from "../models/Cashbook.model"
import BaseModal from "./BaseModal.modal"
import { useOutsideTouch } from "../utils/Hooks"

type EditCashBook = {
  cashbook?: Cashbook
  onClickCancel: () => void
  addCashbook: (cashbookName: string, isGroup: boolean) => void
  editCashbook: (id: number, cashbookName: string, isGroup: boolean) => void
  setShowEditCashbook: Dispatch<SetStateAction<boolean>>
}

export default function EditCashbookModal(props: EditCashBook) {
  const modalRef = useRef<HTMLDivElement>(null);
  const isOutsideTouch = useOutsideTouch(modalRef);

  const [id, setId] = useState(-1);
  const [cashbookName, setCashbookName] = useState('');
  const [isGroup, setIsGroup] = useState(false);

  const isValidConfirm = !cashbookName;

  useEffect(() => {
    if(!props.cashbook) return;

    setId(props.cashbook.id);
    setCashbookName(props.cashbook.name);
    setIsGroup(props.cashbook.isGroup);
  }, [props.cashbook]);

  useEffect(() => {
      if(isOutsideTouch) props.setShowEditCashbook(false)
    }, [isOutsideTouch]);


  return(
    <BaseModal>
      <Container className="card" ref={modalRef}>
        <h6 className="card_top">캐쉬북 {props.cashbook ? '수정' : '추가'}하기</h6>

        <div className="card_middle">
          <div className="input_field">
            <p>캐쉬북 이름</p>
            <input type="text"
              value={cashbookName}
              onChange={e => setCashbookName(e.target.value)}
            />
          </div>

          <div className="checkbox_field">
            <input type="checkbox" id="gathering"
              checked={isGroup}
              onChange={e => {
                if(e.target.checked){
                  setIsGroup(true)
                } else{
                  setIsGroup(false)
                }
              }}
            />
            <label htmlFor="gathering">
              <span className="mark" />
              <p>모임통장</p>
            </label>
          </div>
        </div>

        <div className="card_bottom">
          <button
            type="button"
            className="contained gray"
            onClick={props.onClickCancel}
          >취소</button>
          <button
            type="button"
            className="contained main"
            disabled={isValidConfirm}
            onClick={() => {props.cashbook ? props.editCashbook(id, cashbookName, isGroup) : props.addCashbook(cashbookName, isGroup)}}
          >{props.cashbook ? '수정' : '추가'}</button>
        </div>
      </Container>
    </BaseModal>
  )
}

const Container = styled.div`
  input{
    width: 300px;
  }

  .checkbox_field{
    margin-top: 12px;
  }
`