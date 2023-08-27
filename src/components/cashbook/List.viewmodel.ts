import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CashbookHistory from "../../models/CashbookHistory.model";
import FirstCategory from "../../models/Category.model";
import PaymentMethod from "../../models/PaymentMethod.model";
import moment from "moment";
import { ModalData } from "../../models/Modal.model";
import { CashbookApi } from "../../api/Cashbook.api";
import AppError from "../../models/AppError.model";


export default function ListViewModel() {

  const {id} = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const tokenRef = useRef(localStorage.getItem('token') ?? '');

  const [historyList, setHistoryList] = useState<CashbookHistory[]>([]);
  const [filteredHistoryList, setFilteredHistoryList] = useState<CashbookHistory[]>([]);
  const [cateogryList, setCategoryList] = useState<FirstCategory[]>([]);
  const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([]);

  const [month, setMonth] = useState(moment().format('YYYY-MM'));

  const [totalExpense, setTotalExpense] = useState(0);
  const [totalSaving, setTotalSaving] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const expenseList = historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '지출');
  const incomeList = historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '수입');
  const savingList = historyList.filter(v => moment(v.date).format('YYYY-MM') === month).filter(v => v.firstCategory?.name === '저축');

  const [showFilterPopover, setShowFilterPopover] = useState(0);
  const [selectedFirstIdArray, setSelectedFirstIdArray] = useState<number[]>([]);
  const [selectedSecondIdArray, setSelectedSecondIdArray] = useState <number[]>([]);
  const [selectedPaymentMethodIdArray, setSelectedPaymentMethodIdArray] = useState<number[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [historyCount, setHistoryCount] = useState(0);

  const [selectedHistory, setSelectedHistory] = useState<CashbookHistory>();
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false);

  const [modalAlertData, setModalAlertData] = useState<ModalData>();


  useEffect(() => {
    getCategory();
    getPaymentMethod();

    setMonth(moment().format('YYYY-MM'));
  }, [id])

  useEffect(() => {
    const _page = searchParams.get('page')
    if(_page === null) return;

    const page = parseInt(_page);

    setPage(page);
  }, [searchParams])

  useEffect(() => {
    getHistory();
  }, [id, page])

  useEffect(() => {
    setFilteredHistoryList(historyList.filter(v => moment(v.date).format('YYYY-MM') === month));

    setTotalExpense(expenseList.map(v => v.price).reduce((price, cur) => price + cur, 0))

    setTotalIncome(incomeList.map(v => v.price).reduce((price, cur) => price + cur, 0))
    
    setTotalSaving(savingList.map(v => v.price).reduce((price, cur) => price + cur, 0))
  }, [id, historyList, month])

  // filter default
  useEffect(() => {
    // 거래유형 default
    setSelectedFirstIdArray(cateogryList.map(v => v.id));

    // 1차 default
    if(selectedSecondIdArray.length === 0){
      setSelectedSecondIdArray(selectedSecondIdArray.concat(...cateogryList.filter(first => cateogryList.map(v => v.id).includes(first.id)).map(first => first.secondCategoryList.map(second => second.id))));
    };

    // 결제수단 default
    setSelectedPaymentMethodIdArray(paymentMethodList.map(v => v.id));
  }, [cateogryList, historyList, paymentMethodList])

  // first 체크에 따른 filter_second list
  useEffect(() => {
    setSelectedSecondIdArray(cateogryList.filter(first => selectedFirstIdArray.includes(first.id)).map(first => first.secondCategoryList.map(second => second.id)).reduce((acc, cur) => acc.concat(cur), []));
  }, [selectedFirstIdArray])

  // 거래유형, 1차, 결제수단 체크여부에 따른 내역 필터
  useEffect(() => {
    // setFilteredHistoryList(historyList.filter(v => {
    //   return selectedFirstIdArray.includes(v.firstCategoryId)
    // }).filter(v => {
    //   return selectedSecondIdArray.includes(v.secondCategoryId)
    // }).filter(v => {
    //   if(v.paymentMethod !== null){
    //     return selectedPaymentMethodIdArray.includes(v.paymentMethod.id)
    //   }
    // }));
  }, [selectedFirstIdArray, selectedSecondIdArray, selectedPaymentMethodIdArray])


  const changePage = (page: number) => {
    searchParams.set('page', `${page}`)
    setSearchParams(searchParams)
  }

  const getHistory = async () => {

    if(id === undefined) return;

    try {
      const result = await CashbookApi.getHistoryList(parseInt(id), page, pageSize);

      console.log('내역 조회 성공', result)

      setHistoryList(result.results);
      setFilteredHistoryList(result.results);
      setHistoryCount(result.count);

    } catch (error) {
      if(error instanceof AppError) {
        if(error.code === 1) {
          alert('fasdjfjlsd')
        }
      }
      console.log(error)
    }
  }

  const getCategory = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}/trade-category`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('카테고리 조회 성공', response.data.data)

        setCategoryList(response.data.data);
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const getPaymentMethod = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}/payment-method`, {
      params: {
        cashBookId: id
      },
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('결제수단 조회 성공', response.data.data)

        setPaymentMethodList(response.data.data);
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const deleteHistory = (id: number) => {
    axios.delete(`${process.env.REACT_APP_HOST_URL}v1/cash-book-detail/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success){
        console.log('내역 삭제 성공', response.data.data)
    
        getHistory();
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }


  return {
    historyList, filteredHistoryList, cateogryList, paymentMethodList,
    month, setMonth, totalExpense, totalSaving, totalIncome,
    showFilterPopover, setShowFilterPopover,
    selectedFirstIdArray, setSelectedFirstIdArray, selectedSecondIdArray, setSelectedSecondIdArray, selectedPaymentMethodIdArray, setSelectedPaymentMethodIdArray,
    page, pageSize, historyCount,
    selectedHistory, setSelectedHistory, showEditHistoryModal, setShowEditHistoryModal, modalAlertData, setModalAlertData,
    getHistory, changePage, deleteHistory
  }
}