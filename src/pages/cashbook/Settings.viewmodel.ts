import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


export default function SettingsViewModel() {

  const [activeTab, setActiveTab] = useState(1)

  const navigate = useNavigate()

  

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
    navigate,
    activeTab, setActiveTab
  }
}