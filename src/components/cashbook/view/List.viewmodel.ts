import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CashbookHistory from "../../../models/CashbookHistory.model";
import FirstCategory from "../../../models/Category.model";
import PaymentMethod from "../../../models/PaymentMethod.model";
import { ModalData } from "../../../models/Modal.model";
import { CashbookApi } from "../../../api/Cashbook.api";
import { CashbookDetailApi } from "../../../api/CashbookDetail.api";
import { ListViewProps } from "./ListView";


export default function ListViewModel(props: ListViewProps) {
  const {id} = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const [historyList, setHistoryList] = useState<CashbookHistory[]>([]);
  const [filteredHistoryList, setFilteredHistoryList] = useState<CashbookHistory[]>([]);
  const [cateogryList, setCategoryList] = useState<FirstCategory[]>([]);
  const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([]);

  const [year, setYear] = useState(props.year)
  const [month, setMonth] = useState(props.month)

  const [showFilterPopover, setShowFilterPopover] = useState(0);

  const [checkedFirstIdArray, setCheckedFirstIdArray] = useState<number[]>([])
  const [selectedFirstIdArray, setSelectedFirstIdArray] = useState<number[]>([]);
  const [checkedSecondIdArray, setCheckedSecondIdArray] = useState<number[]>([])
  const [selectedSecondIdArray, setSelectedSecondIdArray] = useState<number[]>([])
  const [checkedThirdIdArray, setCheckedThirdIdArray] = useState<number[]>([])
  const [selectedThirdIdArray, setSelectedThirdIdArray] = useState<number[]>([])

  const [checkedPaymentIdArray, setCheckedPaymentIdArray] = useState<number[]>([]);
  const [selectedPaymentIdArray, setSelectedPaymentIdArray] = useState<number[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(500);  // setPageSize
  const [historyCount, setHistoryCount] = useState(0);

  const [selectedHistory, setSelectedHistory] = useState<CashbookHistory>();
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false);

  const [modalAlertData, setModalAlertData] = useState<ModalData>();


  useEffect(() => {
    getCategory();
    getPaymentMethod();
  }, [id])

  useEffect(() => {
    const _page = searchParams.get('page')
    if(_page === null) return;

    const page = parseInt(_page);

    setPage(page);
  }, [searchParams])

  useEffect(() => {
    setYear(props.year)
    setMonth(props.month)
  }, [props.year, props.month])

  useEffect(() => {
    getHistory();
  }, [year, month, page, selectedFirstIdArray, selectedSecondIdArray, selectedThirdIdArray, selectedPaymentIdArray])

  useEffect(() => {
    setCheckedFirstIdArray(cateogryList.map(v => v.id))
    setCheckedSecondIdArray(checkedSecondIdArray.concat(...cateogryList.map(first => first.secondCategoryList.map(second => second.id))))
    setCheckedPaymentIdArray(paymentMethodList.map(v => v.id))
  }, [year, month])

  useEffect(() => {
    setCheckedFirstIdArray(cateogryList.map(v => v.id))
    setSelectedFirstIdArray(cateogryList.map(v => v.id))

    setCheckedSecondIdArray(checkedSecondIdArray.concat(...cateogryList.map(first => first.secondCategoryList.map(second => second.id))))
    setSelectedSecondIdArray(selectedSecondIdArray.concat(...cateogryList.map(first => first.secondCategoryList.map(second => second.id))))

    const thirdIds = cateogryList.map(first => first.secondCategoryList.map(second => second.thirdCategoryList.map(third => third.id))).reduce((acc, val) => [ ...acc, ...val ], []).reduce((acc, val) => [ ...acc, ...val ], [])
    setCheckedThirdIdArray(thirdIds)
    setSelectedThirdIdArray(thirdIds)

  }, [cateogryList])

  useEffect(() => {
    setCheckedPaymentIdArray(paymentMethodList.map(v => v.id))
    setSelectedPaymentIdArray(paymentMethodList.map(v => v.id))
  }, [paymentMethodList])

  const changePage = (page: number) => {
    searchParams.set('page', `${page}`)
    setSearchParams(searchParams)
  }

  const getHistory = async () => {
    if(id === undefined) return;

    try {
      const result = await CashbookApi.getHistoryList(parseInt(id), year, month, page, pageSize, selectedFirstIdArray, selectedSecondIdArray, selectedPaymentIdArray);

      console.log('내역 조회 성공', result)

      setHistoryList(result.results);
      setFilteredHistoryList(result.results);
      setHistoryCount(result.count);

    } catch (error) {
      // if(error instanceof AppError) {
      //   if(error.code === 1) {
      //     alert('error')
      //   }
      // }
      console.log(error)
    }
  }

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

  const deleteHistory = async (id: number) => {
    try {
      const result = await CashbookDetailApi.deleteHistory(id)
      console.log('내역 삭제 성공', result)

      getHistory();
    } catch (error) {
      console.log(error)
    }
  }


  return {
    historyList, filteredHistoryList, cateogryList, paymentMethodList,
    year, month, setYear, setMonth,
    showFilterPopover, setShowFilterPopover,
    checkedFirstIdArray, setCheckedFirstIdArray, selectedFirstIdArray, setSelectedFirstIdArray,
    checkedSecondIdArray,

    checkedThirdIdArray, setCheckedSecondIdArray, setSelectedSecondIdArray,
    checkedPaymentIdArray, setCheckedPaymentIdArray, selectedPaymentIdArray, setSelectedPaymentIdArray,

    page, pageSize, historyCount,
    selectedHistory, setSelectedHistory, showEditHistoryModal, setShowEditHistoryModal, modalAlertData, setModalAlertData,
    getHistory, changePage, deleteHistory
  }
}