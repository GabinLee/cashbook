import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import FirstCategory, { SecondCategory, ThirdCategory } from "../../models/Category.model";
import axios from "axios";

type EditThirdCategory = {
  firstCategory? : FirstCategory
  secondCateagory? : SecondCategory
  thirdCategory? : ThirdCategory
  onClickCancel: () => void
  onComplete: () => void
}

export default function EditThirdCategoryModal(props: EditThirdCategory) {
  const tokenRef = useRef('')

  const [name, setName] = useState(props.thirdCategory ? props.thirdCategory.name : '')

  const isValidConfirm = !name


  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''
  }, [])


  const addThirdCateogry = () => {
    if(!props.firstCategory || !props.secondCateagory) return

    axios.post(`${process.env.REACT_APP_HOST_URL}v1/trade-category/third`, {
      cashBookId: props.secondCateagory.cashBookId,
      secondCategoryId: props.secondCateagory.id,
      name: name
    }, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('2차 카테고리 추가 성공, addThirdCateogry')

        props.onComplete()
      } else{
        alert('error')
      }
    }).catch(error =>  console.log(error))
  }

  const editThirdCategory = () => {
    if(!props.thirdCategory) return

    axios.patch(`${process.env.REACT_APP_HOST_URL}v1/trade-category/third/${props.thirdCategory.id}`, {
      name: name
    }, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('3차 카테고리 수정 성공, addThirdCateogry' )

        props.onComplete()
      } else{
        alert('error')
      }
    }).catch(error =>  console.log(error))
  }


  return (
    <EditThirdDiv className="modal">
      <div className="card">
        <h6 className="card_top">[{props.firstCategory?.name} - {props.secondCateagory?.name}] 2차 카테고리 {props.thirdCategory ? '수정' : '추가'}</h6>

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
            onClick={() => {props.thirdCategory ? editThirdCategory() : addThirdCateogry()}}
          >{props.thirdCategory ? '수정' : '추가'}</button>
        </div>
      </div>
    </EditThirdDiv>
  )
}

const EditThirdDiv = styled.div`
  .card_middle{
    input{
      width: 240px;
      height: 40px;
    }
  }
`