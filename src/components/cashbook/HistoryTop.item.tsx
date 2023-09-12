import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { Colors, Flex } from "../../style/Styles";
import { CashbookApi } from "../../api/Cashbook.api";
import CashbookHistory from "../../models/CashbookHistory.model";
import { addComma } from "../../utils/Utils";

type HistoryTopProps = {
  year: string
  month: string
  onChangeYear: (value: string) => void
  onChangeMonth: (value: string) => void
}


export default function HistoryTop(props: HistoryTopProps) {
  const {id} = useParams()
  const navigate = useNavigate()
  
  const [year, setYear] = useState(props.year)
  const [month, setMonth] = useState(props.month)

  const [historyList, setHistoryList] = useState<CashbookHistory[]>([])

  const [totalExpense, setTotalExpense] = useState(0)
  const [totalSaving, setTotalSaving] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)


  useEffect(() => {
    getHistory();
  }, [id, year, month])

  useEffect(() => {
    setYear(props.year)
    setMonth(props.month)
  }, [props.year, props.month])

  useEffect(() => {
    setTotalExpense(historyList.filter(v => v.firstCategory?.name === '지출').map(v => v.price).reduce((price, cur) => price + cur, 0))
    setTotalSaving(historyList.filter(v => v.firstCategory?.name === '저축').map(v => v.price).reduce((price, cur) => price + cur, 0))
    setTotalIncome(historyList.filter(v => v.firstCategory?.name === '수입').map(v => v.price).reduce((price, cur) => price + cur, 0))
  }, [historyList])


  const getHistory = async () => {
    if(id === undefined) return;
  
    try {
      const result = await CashbookApi.getHistoryList(parseInt(id), year, month);
  
      console.log('내역 조회 성공', result)
  
      setHistoryList(result.results)

    } catch (error) {
      console.log(error)
    }
  }


  return(
    <HistoryTopDiv className="main_top flex1">
      <div className="input_field standard">
        <input type="month"
          value={`${props.year}-${props.month}`}
          onChange={e => {
            props.onChangeYear(moment(e.target.value).format('YYYY'))
            props.onChangeMonth(moment(e.target.value).format('MM'))
          }}
        />
      </div>

      <div className="card expense">
        <p>지출</p>
        <h6>{addComma(totalExpense)}</h6>
      </div>
      <div className="card saving">
        <p>저축</p>
        <h6>{addComma(totalSaving)}</h6>
      </div>
      <div className="card income">
        <p>수입</p>
        <h6>{addComma(totalIncome)}</h6>
      </div>

      <button
        type="button"
        className="btn settings contained light_main"
        onClick={() => navigate('settings')}
      >
        <img src="/images/settings.svg" alt="설정" />
        <p>설정</p>
      </button>
    </HistoryTopDiv>
  )
}

const HistoryTopDiv = styled.section`
  padding: 0 0 24px;
  ${Flex('', 'center', '')}

  .input_field.standard{
    width: 240px;
    height: 45px;
    border-bottom: 1px solid ${Colors.gray_be};
    input{
      height: 100%;
      font-size: 16px;
    }
  }

  .card{
    flex: 1;
    height: 45px;
    margin-left: 24px;
    padding: 12px;
    border-radius: 6px;
    ${Flex('', 'center', '')}
    p{
      flex: 1;
      padding-right: 12px;
      font-size: 12px;
    }

    &.expense{
      border-left: 6px solid ${Colors.red};
      h6{
        color: ${Colors.red};
      }
    }
    &.saving{
      border-left: 6px solid ${Colors.yellow};
      h6{
        color: ${Colors.yellow};
      }
    }
    &.income{
      border-left: 6px solid ${Colors.green};
      h6{
        color: ${Colors.green};
      }
    }
  }

  .btn.settings{
    height: 36px;
    margin-left: 24px;
    padding: 0 12px;
    ${Flex('', 'center', '')}
    img{
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
    p{
      color: inherit;
    }
  }
`