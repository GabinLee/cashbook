import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import PaymentMethod from "../../models/PaymentMethod.model"
import axios from "axios"
import { useParams } from "react-router-dom"
// import CashbookHistory from "../../models/CashbookHistory.model"
// import moment from "moment"

type EditPaymentMethod = {
  paymentMethod?: PaymentMethod
  onClickCancel: () => void
  onComplete: () => void
  // addHistory: (description: string) => void
  // editHistory: () => void
  // addCashbook: (cashbookName: string) => void
  // editCashbook: (id: number, cashbookName: string) => void
}

export default function EditPaymentMethodModal(props: EditPaymentMethod) {
  const {id} = useParams()
  const tokenRef = useRef('')
  
  const [type, setType] = useState(props.paymentMethod ? props.paymentMethod.type : 0)
  const [name, setName] = useState(props.paymentMethod ? props.paymentMethod.name : '')
  const [paymentDay, setPaymentDay] = useState(props.paymentMethod ? (props.paymentMethod.type === 0 ? props.paymentMethod.paymentDay : undefined) : undefined)

  // const isValidConfirm = (type === 0 ? !(name && paymentDay) : !name)
  const isValidConfirm = !name;

  
  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ''
  }, [])

  useEffect(() => {
    console.log('paymentDay', paymentDay)
  }, [paymentDay])

  const addPaymentMethod = () => {
    axios.post(`${process.env.REACT_APP_HOST_URL}v1/payment-method
    `, {
      cashBookId: id,
      type: type,
      name: name,
      paymentDay: paymentDay
    }, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success) {
        console.log('결제수단 추가 성공')
        props.onComplete()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const editPaymentMethod = () => {
    if(!props.paymentMethod) return

    axios.patch(`${process.env.REACT_APP_HOST_URL}v1/payment-method/${props.paymentMethod.id}`, {
      type: type,
      name: name,
      paymentDay: paymentDay
    }, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('결제수단 수정 성공')
        props.onComplete()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }


  return(
    <Container className="modal">
      <div className="card">
        <h6 className="card_top">결제수단 {props.paymentMethod ? '수정' : '추가'}</h6>
        
        <div className="card_middle">
          <div className="group_radio flex ai-c">
            <div className="radio_field">
              <input type="radio" id="credit" name="type"
                checked={type === 0}
                onChange={e => {
                  if(e.target.checked){
                    setType(0)
                  }
                }}
              />
              <label htmlFor="credit">
                <span className="checkmark" />
                <p>신용카드</p>
              </label>
            </div>

            <div className="radio_field">
              <input type="radio" id="etc" name="type"
                checked={type === 1}
                onChange={e => {
                  if(e.target.checked){
                    setType(1)
                  }
                }}
              />
              <label htmlFor="etc">
                <span className="checkmark" />
                <p>그 외</p>
              </label>
            </div>
            
          </div>

          <div className="input_field flex ai-c">
            <p>이름</p>
            <input type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {(type === 0 && false) && (
            <div className="select_field flex">
              <p>카드 대금 결제일</p>
              <div>
                <div className="select_box">
                  <select
                    value={paymentDay}
                    onChange={e => setPaymentDay(parseInt(e.target.value))}
                  >
                    <option hidden></option>
                    {[...Array(31)].map((date, index) => (
                      <option value={index + 1} key={`date${index}`}>{index + 1}일</option>
                    ))}
                  </select>
                </div>
                <p>전월 1일부터 전월 말일까지의 이용내역이 당월 {paymentDay}일에 표시됩니다.</p>
                {/* <p>할부 시</p> */}
              </div>
            </div>
          )}
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
            onClick={() => props.paymentMethod ? editPaymentMethod() : addPaymentMethod()}
          >{props.paymentMethod ? '수정' : '추가'}</button>
        </div>
      </div>
    </Container>
  )
}

const Container = styled.div`
  .card_middle{
    min-height: 252px;
    padding-bottom: 12px;
    .group_radio{
      height: 40px;
      justify-content: space-around;
      /* .radio_field{
        input[type="radio"]{
          &:checked + label .checkmark{
            &.income{
              border-color: var(--green);
              &::before{
                background-color: var(--green);
              }
              + p{
                color: var(--green);
              }
            }

            &.saving{
              border-color: var(--yellow);
              &::before{
                background-color: var(--yellow);
              }
              + p{
                color: var(--yellow);
              }
            }

            &.expense{
              border-color: var(--red);
              &::before{
                background-color: var(--red);
              }
              + p{
                color: var(--red);
              }
            }
          }
        }
      } */
    }
    
    .input_field, .select_field{
      margin-top: 24px;
      > p:nth-child(1){
        width: 110px;
      }
      input, .select_box{
        width: 240px;
      }
    }

    .select_field{
      > p{
        line-height: 40px;
      }
      div p{
        width: 240px;
        margin-top: 12px;
        padding-left: 12px;
        position: relative;
        &::before{
          content: '*';
          position: absolute;
          top: 4px;
          left: 0;
        }
      }
    }
  }
`