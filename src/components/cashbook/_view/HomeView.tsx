import styled from "styled-components";
import moment from "moment";
import { Colors, Flex } from "../../../style/Styles";
import { addComma } from "../../../utils/Utils";
import HomeViewModel from "./Home.viewmodel";


export default function HomeView() {

  const viewModel = HomeViewModel()

  return (
    <Container className="contents">
      <div className="flex">
        <div className="month flex1">
          <h1>{moment().format('M')}</h1>
          <span>월</span>
        </div>

        {(viewModel.cashbook !== undefined && viewModel.cashbook.isGroup) && (
          <div className="balance">
            <span>잔액: </span>
            <span>{addComma(viewModel.balance)}</span>
            <span>원</span>
          </div>
        )}
      </div>

      <ul className="group_card">
        <li className="card expense">
          <div className="card_top">
            <p>이달의 지출 현황</p>
            <h5>{addComma(viewModel.monthlyExpense)}</h5>
          </div>
          <ul className="card_bottom">
            {viewModel.expenseList.length === 0 && (
              <li>지출 내역이 없습니다.</li>
            )}
            {viewModel.expenseList.map((expense, index) => index < 10 && (
              <li key={`expense${index}`} className="flex ai-c">
                <p>{moment(expense.date).format('DD')}일</p>
                <p className="flex1">{expense.description}</p>
                <p>{addComma(expense.price)}원</p>
              </li>
            ))}
            {viewModel.expenseList.length > 9 && (
              <li className="flex-c more">⋮</li>
            )}
          </ul>
        </li>

        <li className="card saving">
          <div className="card_top">
            <p>이달의 저축 현황</p>
            <h5>{addComma(viewModel.monthlySaving)}</h5>
          </div>
          <ul className="card_bottom">
            {viewModel.savingList.length === 0 && (
              <li>저축 내역이 없습니다.</li>
            )}
            {viewModel.savingList.map((saving, index) => (
              <li key={`saving${index}`} className="flex ai-c">
                <p>{moment(saving.date).format('DD')}일</p>
                <p className="flex1">{saving.description}</p>
                <p>{addComma(saving.price)}원</p>
              </li>
            ))}
          </ul>
        </li>

        <li className="card income">
          <div className="card_top">
            <p>이달의 수입 현황</p>
            <h5>{addComma(viewModel.monthlyIncome)}</h5>
          </div>
          <ul className="card_bottom">
            {viewModel.incomeList.length === 0 && (
              <li>수입 내역이 없습니다.</li>
            )}
            {viewModel.incomeList.map((income, index) => (
              <li key={`income${index}`} className="flex ai-c">
                <p>{moment(income.date).format('DD')}일</p>
                <p className="flex1">{income.description}</p>
                <p>{addComma(income.price)}원</p>
              </li>
            ))}
          </ul>
        </li>
      </ul>

      {/* <div className="card event">
        <div className="card_top">
          <p>이달의 특별 지출</p>
          <h5>0</h5>
        </div>
        <div className="card_bottom">
          <p>특별 지출 내역이 없습니다.</p>
        </div>
      </div> */}

      {/* <div className="aa flex">
        <div className="box">
          <div className="flex ai-c">
            <img src="images/nav_ic/cashbook_main.svg" alt="" />
            
            <div className="text-box">
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry industry.</p>
            </div>

            <button>내역 추가</button>
          </div>
        </div>
        <div className="box"></div>
      </div> */}
    </Container>
  )
}

const Container = styled.div`
  padding: 24px;
  
  .month{
    ${Flex('', 'center', '')}
    span{
      margin: 0 0 -12px 6px;
      display: block;
    }
  }

  .card{
    flex: 1;
    border-radius: 12px;
    &.income{
      border-top: 12px solid ${Colors.green};
      h5{
        color: ${Colors.green};
      }
    }
    &.saving{
      border-top: 12px solid ${Colors.yellow};
      h5{
        color: ${Colors.yellow};
      }
    }
    &.expense{
      border-top: 12px solid ${Colors.red};
      h5{
        color: ${Colors.red};
      }
    }
    &.event{
      border-left: 12px solid ${Colors.purple};
      h5{
        color: ${Colors.purple};
      }
    }

    
    &_top{
      padding: 12px 18px;
      ${Flex('', 'center', 'space-between')}
    }

    &_bottom{
      min-height: 240px;
      padding: 12px 18px;
      border-top: 1px solid ${Colors.gray_e5};
      li{
        + li{
          margin-top: 6px;
        }
        &.more{
          font-size: 20px;
        }
        .flex1{
          padding: 0 12px;
        }
      }
    }
  }
  
  ul.group_card{
    margin: 24px 0;
    ${Flex('', '', '')}
    li.card{
      + li{
        margin-left: 24px;
      }
    }
  }

  /* .aa{
    background-color: lavender;
    .box{
      width: 50%;
      padding: 0 12px;
      &:nth-child(1){
        background-color: palegoldenrod;
      }

      img{
        width: 20px;
        height: 20px;
      }

      .text-box{
        width: calc(100% - 160px);
        background-color: pink;
        p{
          padding: 6px 12px;
          background-color: palegreen;

          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      
      button{
        width: 140px;
        background-color: powderblue;
      }
    }
  } */
`