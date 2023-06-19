import { useEffect, useState } from "react"
import styled from "styled-components"
import Cashbook from "../models/Cashbook.model"

type EditCashBook = {
  cashbook?: Cashbook
  onClickCancel: () => void
  addCashbook: (cashbookName: string, isGroup: boolean) => void
  editCashbook: (id: number, cashbookName: string, isGroup: boolean) => void
}

export default function EditCashbookModal(props: EditCashBook) {
  const [id, setId] = useState(-1)
  const [cashbookName, setCashbookName] = useState('')
  const [isGroup, setIsGroup] = useState(props.cashbook ? props.cashbook.isGroup : false)

  const isValidConfirm = !cashbookName


  useEffect(() => {
    if(!props.cashbook) return

    setId(props.cashbook.id)
    setCashbookName(props.cashbook.name)
  }, [props.cashbook])

  return(
    <Container className="modal">
      <div className="card">
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
      </div>
    </Container>
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