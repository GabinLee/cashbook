import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { CashbookApi } from "../../api/Cashbook.api"
import FirstCategory, { SecondCategory, ThirdCategory } from "../../models/Category.model"
import PaymentMethod from "../../models/PaymentMethod.model"
import { ModalData } from "../../models/Modal.model"


export default function SettingsViewModel() {
  const {id} = useParams()

  const [cateogryList, setCategoryList] = useState<FirstCategory[]>([]);
  const [selectedFirst, setSelectedFirst] = useState<FirstCategory>();
  const [showEditSecondCategoryModal, setShowEditSecondCategoryModal] = useState(false);
  const [selectedSecond, setSelectedSecond] = useState<SecondCategory>();
  const [showEditThirdCategoryModal, setShowEditThirdCategoryModal] = useState(false);
  const [selectedThird, setSelectedThird] = useState<ThirdCategory>();

  const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([]);
  const [showEditPaymentMethodModal, setShowEditPaymentMethodModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>();

  const [modalAlertData, setModalAlertData] = useState<ModalData>();


  useEffect(() => {
    getCategory();
    getPaymentMethod();
  }, [id])
  

  const getCategory = async () => {
    if(id === undefined) return;

    try {
      const result = await CashbookApi.getCategoryList(parseInt(id))

      console.log('카테고리 조회 성공', result)

      setCategoryList(result)

    } catch (error) {
      console.log(error)
    }
  }

  // const deleteSecondCategory = (id: number) => {
  //   axios.delete(`${process.env.REACT_APP_HOST_URL}v1/trade-category/second/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${tokenRef.current}`
  //     }
  //   })
  //   .then(response => {
  //     if(response.data.success){
  //       console.log('1차 카테고리 삭제 성공, deleteSecondCategory');

  //       getCategory();
  //     } else{
  //       alert('error')
  //     }
  //   }).catch(error => console.log(error))
  // }

  // const deleteThirdCategory = (id: number) => {
  //   axios.delete(`${process.env.REACT_APP_HOST_URL}v1/trade-category/third/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${tokenRef.current}`
  //     }
  //   })
  //   .then(response => {
  //     if(response.data.success){
  //       console.log('2차 카테고리 삭제 성공, deleteThirdCategory')

  //       getCategory()
  //     } else{
  //       alert('error')
  //     }
  //   }).catch(error =>  console.log(error))
  // }

  const getPaymentMethod = async () => {
    if(id === undefined) return;

    try {
      const result = await CashbookApi.getPaymentMethod(parseInt(id))
      
      console.log('결제수단 조회 성공', result)

      setPaymentMethodList(result);
    } catch (error) {
      console.log(error)
    }
  }

  // const deletePaymentMethod = (id: number) => {
  //   axios.delete(`${process.env.REACT_APP_HOST_URL}v1/payment-method/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${tokenRef.current}`
  //     }
  //   })
  //   .then(response => {
  //     if(response.data.success){
  //       console.log('결제수단 삭제 성공')

  //       getPaymentMethod()
  //     } else{
  //       alert('error')
  //     }
  //   }).catch(error => console.log(error))
  // }


  return {
    cateogryList, setCategoryList, paymentMethodList,
    selectedFirst, setSelectedFirst, selectedSecond, setSelectedSecond, selectedThird, setSelectedThird, selectedPaymentMethod, setSelectedPaymentMethod,
    showEditSecondCategoryModal, setShowEditSecondCategoryModal, showEditThirdCategoryModal, setShowEditThirdCategoryModal, showEditPaymentMethodModal, setShowEditPaymentMethodModal,
    modalAlertData, setModalAlertData,
    getCategory, getPaymentMethod
  }
}