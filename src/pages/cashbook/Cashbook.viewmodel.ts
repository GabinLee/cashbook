import moment from "moment"
import { useEffect, useState } from "react"


export default function CashbookViewModel() {
  const [year, setYear] = useState(moment().format('YYYY'));
  const [month, setMonth] = useState(moment().format('MM'));

  

  return {
    year, month,
    setYear, setMonth
  }
}