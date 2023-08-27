import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store";
import axios from "axios";
import Cashbook from "../../models/Cashbook.model";
import { ModalData } from "../../models/Modal.model";


export default function MainViewModel() {
  const token = useAppSelector  (state => state.app.token);
  const navigate = useNavigate();

  const [cashbookList, setCashbookList] = useState<Cashbook[]>([]);
  const [showEditCashbook, setShowEditCashbook] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [selectedCashbook, setSelectedCashbook] = useState<Cashbook>();
  const [modalAlertData, setModalAlertData] = useState<ModalData>();

  useEffect(() => {
    getCashbookList();
  }, [])

  useEffect(() => {
    if(modalAlertData === undefined) {
      navigate('/');
    }
  }, [modalAlertData]);

  const getCashbookList = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/user/me/cash-book`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('캐쉬북 리스트 조회 성공', response.data.data)
        setCashbookList(response.data.data);
      } else{
        alert('error');
      }
    }).catch(error => console.log(error))
  }

  const addCashbook = (cashbookName: string, isGroup: boolean) => {
    axios.post(`${process.env.REACT_APP_HOST_URL}v1/cash-book`, {
      name: cashbookName,
      isGroup: isGroup
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('addCashbook 성공');
        setShowEditCashbook(false);
        getCashbookList();
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const editCashbook = (id: number, cashbookName: string, isGroup: boolean) => {
    axios.patch(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}`, {
      id: id,
      name: cashbookName,
      isGroup: isGroup
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('editCashbook');
        setShowEditCashbook(false);
        setSelectedCashbook(undefined);
        getCashbookList();
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const deleteCashbook = (id: number) => {
    axios.delete(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if(response.data.success) {
        setModalAlertData({
          message: '삭제되었습니다.',
          rightButtonText: '확인',
          onClickRightButton: () => setModalAlertData(undefined)
        });
        getCashbookList();
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }


  return{
    cashbookList, showEditCashbook, showInviteMember, selectedCashbook, modalAlertData, 
    setCashbookList, setShowEditCashbook, setShowInviteMember, setSelectedCashbook, setModalAlertData,
    addCashbook, editCashbook, deleteCashbook
  }
}