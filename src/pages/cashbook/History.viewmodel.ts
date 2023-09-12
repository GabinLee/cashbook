import moment from "moment"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"


export default function HistoryViewModel() {
  const {id} = useParams()
  const [year, setYear] = useState(moment().format('YYYY'))
  const [month, setMonth] = useState(moment().format('MM'))

  const [activeTab, setActiveTab] = useState(1)

  const [searchParams, setSearchParams] = useSearchParams()


  useEffect(() => {
    setActiveTab(1)
  }, [id])

  useEffect(() => {
    const tab = searchParams.get('tab');

    if(tab !== null){
      setActiveTab(parseInt(tab))
    }
  }, [searchParams])

  // useEffect(() => {
  // }, [])

  // useEffect(() => {
  //   console.log('----------year', year)
  //   console.log('----------month', month)
  // }, [year, month])

  return {
    year, month, setYear, setMonth,
    activeTab, setSearchParams
  }
}