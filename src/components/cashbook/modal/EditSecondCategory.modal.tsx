import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import FirstCategory, { SecondCategory } from "../../../models/Category.model";
import axios from "axios";
import BaseModal from "../../BaseModal.modal";

type EditSecondCategory = {
  firstCategory? : FirstCategory
  secondCategory?: SecondCategory
  onClickCancel: () => void
  onComplete: () => void
}

export default function EditSecondCategoryModal(props: EditSecondCategory) {
  const tokenRef = useRef('')

  const [name, setName] = useState(props.secondCategory ? props.secondCategory.name : '')

  const isValidConfirm = !name


  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''
  }, [])
  

  const addSecondCategory = () => {
    if(!props.firstCategory) return

    axios.post(`${process.env.REACT_APP_HOST_URL}v1/trade-category/second`, {
      cashBookId: props.firstCategory.cashBookId,
      firstCategoryId: props.firstCategory.id,
      name: name
    }, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success) {
        console.log('1차 카테고리 추가 성공, addSecondCategory')
        
        props.onComplete()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const editSecondCategory = () => {
    if(!props.secondCategory) return

    axios.patch(`${process.env.REACT_APP_HOST_URL}v1/trade-category/second/${props.secondCategory.id}`, {
      name: name
    }, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    }).then(response => {
      if(response.data.success) {
        console.log('1차 카테고리 수정 성공, editSecondCategory')

        props.onComplete()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }


  return (
    <BaseModal>
      <EditSecondDiv className="card">
        <h6 className="card_top">[{props.firstCategory?.name}] 1차 카테고리 {props.secondCategory ? '수정' : '추가'}</h6>

        <div className="card_middle">
          <input type="text" className="outlined"
            value={name}
            onChange={e => setName(e.target.value)}
          />
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
            onClick={e => {props.secondCategory ? editSecondCategory() : addSecondCategory()}}
          >{props.secondCategory ? '수정' : '추가'}</button>
        </div>
      </EditSecondDiv>
    </BaseModal>
  )
}

const EditSecondDiv = styled.div`
  .card_middle{
    input{
      width: 100%;
      min-width: 240px;
      max-width: 360px;
      height: 40px;
    }
  }
`