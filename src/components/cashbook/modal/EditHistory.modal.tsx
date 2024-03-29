import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import CashbookHistory from "../../../models/CashbookHistory.model"
import moment from "moment"
import axios from "axios"
import { useParams } from "react-router-dom"
import FirstCategory, { SecondCategory, ThirdCategory } from "../../../models/Category.model"
import PaymentMethod from "../../../models/PaymentMethod.model"
import { Colors } from "../../../style/Styles"
import { addComma } from "../../../utils/Utils"
import BaseModal from "../../BaseModal.modal"

type EditHistory = {
  cashbookHistory?: CashbookHistory
  categoryList: FirstCategory[]
  paymentMethodList: PaymentMethod[]
  onClickCancel: () => void
  onComplete: () => void
}

export default function EditHistoryModal(props: EditHistory) {
  const {id} = useParams()
  const tokenRef = useRef('')

  const [cateogryList] = useState<FirstCategory[]>(props.categoryList)
  const [paymentMethodList] = useState<PaymentMethod[]>(props.paymentMethodList)

  const [selectedFirstCateogry, setSelectedFirstCategory] = useState<FirstCategory>()
  const [date, setDate] = useState(props.cashbookHistory ? moment(props.cashbookHistory.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
  const [description, setDescription] = useState(props.cashbookHistory ? props.cashbookHistory.description : '')
  const [inputPrice, setInputPrice] = useState(props.cashbookHistory ? props.cashbookHistory.price : 0)
  const [price, setPrice] = useState(props.cashbookHistory ? props.cashbookHistory.price : 0)
  const [selectedSecondCategory, setSelectedSecondCateogory] = useState<SecondCategory|null>(props.cashbookHistory ? props.cashbookHistory.secondCategory : null)
  const [selectedThirdCategory, setSelectedThirdCategory] = useState<ThirdCategory|null>(props.cashbookHistory ? props.cashbookHistory.thirdCategory : null)
  const [thirdCategoryDisabled, setThirdCategoryDisabled] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod|null>(props.cashbookHistory ? props.cashbookHistory.paymentMethod : null)
  const [receiptImage, setReceiptImage] = useState(props.cashbookHistory ? props.cashbookHistory.imageList : null)
  const [selectedReceiptImage, setSelectedReceiptImage] = useState<File[]|null>(null);

  const [deleteImageIdArray, setDeleteImageIdArray] = useState<number[]>([]);
  
  const isValidConfirm = !(description && price && selectedFirstCateogry && selectedSecondCategory && selectedPaymentMethod);


  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') ?? ``;

    if(paymentMethodList.length <= 1) {
      setSelectedPaymentMethod(paymentMethodList[0])
    }
  }, [])

  useEffect(() => {
    if(cateogryList.find(v => v.id === selectedFirstCateogry?.id)?.secondCategoryList.find(v => v.id === selectedSecondCategory?.id)?.thirdCategoryList.length === 0){
      setThirdCategoryDisabled(true);
    } else{
      setThirdCategoryDisabled(false);
    }
  }, [selectedSecondCategory])
  

  useEffect(() => {
    if(cateogryList.length === 0) return;

    if(props.cashbookHistory !== undefined) { //수정
      setSelectedFirstCategory(cateogryList.find(v => v.id === props.cashbookHistory?.firstCategory?.id))
    } else { // 추가
      setSelectedFirstCategory(cateogryList.find(v => v.name === "지출"))
    }
  }, [cateogryList, props.cashbookHistory])

  const addHistory = () => {
    if(selectedFirstCateogry === null) return;

    const formData = new FormData();
    formData.append('date', date)
    formData.append('description', description)
    formData.append('price', `${price}`)
    formData.append('firstCategoryId', `${selectedFirstCateogry?.id}`)
    if(selectedSecondCategory !== null) {
      formData.append('secondCategoryId', `${selectedSecondCategory.id}`)
    }
    if(selectedThirdCategory !== null) {
      formData.append('thirdCategoryId', `${selectedThirdCategory.id}`)
    }
    if(selectedPaymentMethod !== null) {
      formData.append('paymentMethodId', `${selectedPaymentMethod.id}`)
    }
    
    if(selectedReceiptImage !== null){
      selectedReceiptImage.map((img) => (
        formData.append('images', img)
      ))
    }

    axios.post(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}/detail`, formData, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('내역 추가 성공')

        props.onComplete()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const editHistory = () => {
    if(!props.cashbookHistory || selectedFirstCateogry === null) return

    const formData = new FormData();
    formData.append('date', date)
    formData.append('description', description)
    formData.append('price', `${price}`)
    formData.append('firstCategoryId', `${selectedFirstCateogry?.id}`)
    if(selectedSecondCategory !== null) {
      formData.append('secondCategoryId', `${selectedSecondCategory.id}`)
    }
    if(selectedThirdCategory !== null) {
      formData.append('thirdCategoryId', `${selectedThirdCategory.id}`)
    }
    if(selectedPaymentMethod !== null) {
      formData.append('paymentMethodId', `${selectedPaymentMethod.id}`)
    }
    if(selectedReceiptImage !== null){
      selectedReceiptImage.map((img) => (
        formData.append('images', img)
      ))
    }

    formData.append('deleteImageIds', JSON.stringify(deleteImageIdArray))

    axios.patch(`${process.env.REACT_APP_HOST_URL}v1/cash-book-detail/${props.cashbookHistory.id}`, formData, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('내역 수정 성공')

        props.onComplete()

      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const onchangePrice = (e:any) => {
    const valueComma = e.target.value.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    const value = e.target.value.replace(/[^0-9]/g, "")

    setInputPrice(valueComma)

    setPrice(parseInt(value))
  }

  // const deleteImage = (id:number) => {
  // }


  return(
    <BaseModal>
      <Container className="card">
        <h6 className="card_top">내역 {props.cashbookHistory ? '수정' : '추가'}</h6>

        <div className="card_middle">
          <div className="group_radio flex ai-c">
            {cateogryList.map((first, fIndex) => (
              <div className="radio_field" key={`first${fIndex}`}>
                <input type="radio" id={`first${first.id}`} name="type"
                  checked={selectedFirstCateogry?.id === first.id}
                  onChange={e => {
                    if(e.target.checked){
                      setSelectedFirstCategory(first);
                    }
                  }}
                />
                <label htmlFor={`first${first.id}`}>
                  <span className={`checkmark ${first.name === '지출' ? 'first1' : `${first.name === '수입' ? 'first2' : 'first3'}`}`} />
                  <p>{first.name}</p>
                </label>
              </div>
            ))}
          </div>

          <div className="input_field flex ai-c">
            <p>일자</p>
            <input type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="input_field flex ai-c">
            <p>내용</p>
            <input type="text"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="input_field flex ai-c">
            <p>금액</p>
            <input type="text"
              value={addComma(inputPrice)}
              onChange={onchangePrice}
            />
          </div>

          <div className="select_field ai-c">
            <p>1차</p>
            <div className="select_box">
              <select
                value={selectedSecondCategory?.id}
                onChange={e => {
                  const second = cateogryList.find(v => v.id === selectedFirstCateogry?.id)?.secondCategoryList.find(v => v.id === parseInt(e.target.value))

                  if(second){
                    setSelectedSecondCateogory(second)
                  }

                  if(second?.thirdCategoryList.length === 1){
                    setSelectedThirdCategory(second.thirdCategoryList[0])
                  }
                }}
              >
                <option value="" hidden></option>
                {cateogryList.find(v => v.id === selectedFirstCateogry?.id)?.secondCategoryList.map((second, index) => (
                  <option key={`second${index}`} value={second.id}>{second.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="select_field ai-c">
            <p>2차</p>
            {cateogryList.find(v => v.id === selectedFirstCateogry?.id)?.secondCategoryList.find(v => v.id === selectedSecondCategory?.id)?.thirdCategoryList.length === 1 && (
              <p>{cateogryList.find(v => v.id === selectedFirstCateogry?.id)?.secondCategoryList.find(v => v.id === selectedSecondCategory?.id)?.thirdCategoryList.map(v => v.name)}</p>
            )}
            {cateogryList.find(v => v.id === selectedFirstCateogry?.id)?.secondCategoryList.find(v => v.id === selectedSecondCategory?.id)?.thirdCategoryList.length !== 1 && (
              <div className="select_box">
                <select
                  value={JSON.stringify(selectedThirdCategory)}
                  onChange={e => {
                    setSelectedThirdCategory(JSON.parse(e.target.value))
                  }}
                  disabled={thirdCategoryDisabled}
                >
                  <option value={''} hidden></option>
                  {cateogryList.find(v => v.id === selectedFirstCateogry?.id)?.secondCategoryList.find(v => v.id === selectedSecondCategory?.id)?.thirdCategoryList.map
                  ((third, index) => (
                    <option key={`third${index}`} value={JSON.stringify(third)}>{third.name}</option>
                  ))}
                </select>
              </div>
            )}
            {/* 
            {cateogryList.find(v => v.id === selectedFirstCateogry?.id)?.secondCategoryList.find(v => v.id === selectedSecondCategory?.id)?.thirdCategoryList.length === 1 && (
              <p>{cateogryList.find(v => v.id === selectedFirstCateogry?.id)?.secondCategoryList.find(v => v.id === selectedSecondCategory?.id)?.thirdCategoryList.map(v => v.name)}</p>
            )} */}
          </div>

          <div className="select_field ai-c">
            <p>결제수단</p>
            {paymentMethodList.length <= 1 && (
              <p>{paymentMethodList.map(v => v.name)}</p>
            )}
            {paymentMethodList.length > 1 && (
              <div className="select_box">
                <select
                  value={JSON.stringify(selectedPaymentMethod)}
                  onChange={e => {
                    setSelectedPaymentMethod(JSON.parse(e.target.value))
                  }}
                >
                  <option value=""></option>
                  {paymentMethodList.map((paymentMethod, index) => (
                    <option key={`method${index}`} value={JSON.stringify(paymentMethod)}>{paymentMethod.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* <div className="input_field flex ai-c">
            <p>태그</p>
            <input type="text"
              // value={}
              // onChange={e => set()}
            />
          </div> */}

          <div className="input_field flex ai-c receipt">
            <p>영수증</p>
            <input type="file" id="receipt_img" accept="image/*" multiple
              onChange={e => {
                const images = e.currentTarget.files;

                console.log('images', images)

                if(images === null || images.length === 0) return []

                const files: File[] = [];
                for(let i = 0; i < images.length; i++) {
                  const img = images.item(i);

                  if(img !== null) {
                    files.push(img)
                  }
                }
                return setSelectedReceiptImage(files)
              }}
            />
            <label htmlFor="receipt_img" className="add_img"/>
          </div>

          <ul className="img_list flex ai-s">
            {selectedReceiptImage !== null && selectedReceiptImage.map((img, index) => (
              <li key={`img${index}`}>
                <img src={URL.createObjectURL(img)} alt="영수증" />
                <button className="btn_clear btn20 dark"
                  onClick={() => setSelectedReceiptImage(selectedReceiptImage.filter(v => v.name !== img.name))}
                />
              </li>
            ))}
            {receiptImage !== null && receiptImage.map((img, index) => (
              <li key={`img${index}`}>
                <img src={`${process.env.REACT_APP_IMAGE_URL}receipt/${img.image}`} alt="영수증2(server)" />
                <button className="btn_clear btn20 dark"
                  onClick={() => {
                    setDeleteImageIdArray(deleteImageIdArray.concat(img.id))
                    setReceiptImage(receiptImage.filter(v => v.id != img.id))
                  }}
                />
              </li>
            ))}
          </ul>
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
            onClick={() => {props.cashbookHistory ? editHistory() : addHistory()}}
          >{props.cashbookHistory ? '수정' : '추가'}</button>
        </div>
      </Container>
    </BaseModal>
  )
}

const Container = styled.div`
  height: 100%;
  max-height: 660px;
  .card_top{
    padding-bottom: 12px;
  }
  .card_middle{
    width: 348px;
    height: calc(100% - (145px + 12px));
    margin-bottom: 12px;
    overflow: auto;
    .group_radio{
      /* height: 40px; */
      justify-content: space-around;
      .radio_field{
        input[type="radio"]{
          &:checked + label .checkmark{
            &.first2{
              border-color: var(--green);
              &::before{
                background-color: var(--green);
              }
              + p{
                color: var(--green);
              }
            }

            &.first3{
              border-color: var(--yellow);
              &::before{
                background-color: var(--yellow);
              }
              + p{
                color: var(--yellow);
              }
            }

            &.first1{
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
      }
    }
    .input_field, .select_field{
      height: 40px;
      margin-top: 24px;
      > p:nth-child(1){
        width: 60px;
      }
      input, .select_box{
        width: 240px;
      }

      &.receipt{
        input{
          display: none;
        }
        label.add_img{
          width: 40px;
          min-width: 40px;
          height: 40px;
          border: 1px solid ${Colors.gray_be};
          border-radius: 50%;
          background: url(/images/add_photo.svg) no-repeat center center;
          &:hover{
            background: ${Colors.gray_e5} url(/images/add_photo.svg) no-repeat center center;
          }
        }
        + .img_list{
          width: 348px;
          height: 117px;
          margin: 0 -24px;
          padding: 12px 12px 0 84px;
          overflow: auto;
          li{
            margin-right: 12px;
            position: relative;
            img{
              width: 60px;
              min-width: 60px;
              height: 90px;
            }
            .btn_clear{
              position: absolute;
              top: -4px;
              right: -4px;
            }
          }
        }
      }
    }
  }
`