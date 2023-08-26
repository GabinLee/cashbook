import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CashbookHistory from "../../models/CashbookHistory.model";

export default function ListViewModel() {

  const {id} = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const tokenRef = useRef(localStorage.getItem('token') ?? '');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [historyCount, setHistoryCount] = useState(0);

  const [historyList, setHistoryList] = useState<CashbookHistory[]>([]);

  useEffect(() => {
    const _page = searchParams.get('page')
    if(_page === null) return;

    const page = parseInt(_page);

    setPage(page);
  }, [searchParams])

  useEffect(() => {
    getHistory();
  }, [id, page])

  const changePage = (page: number) => {
    searchParams.set('page', `${page}`)
    setSearchParams(searchParams)
  }

  const getHistory = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/cash-book/${id}/detail`, {
      params: {
        page: page,
        pageSize: pageSize
      },
      headers: {
        Authorization: `Bearer ${tokenRef.current}`
      }
    })
    .then(response => {
      if(response.data.success) {
        console.log('내역 조회 성공', response.data.data)

        setHistoryList(response.data.data.results);
        //setFilteredHistoryList(response.data.data.results);
        setHistoryCount(response.data.data.count);
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  return {
    historyList,
    page, pageSize, historyCount,
    getHistory, changePage,
  }
}