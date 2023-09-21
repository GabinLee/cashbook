import styled from "styled-components";
import { Colors, Flex } from "../../../style/Styles";


export const ListViewContainer = styled.div`
  ${Flex('column')}
  
  .area{
    &.filter_add{
      padding: 0 0 24px;
      .filter{
        &_list{
          padding-right: 12px;
        }
      }

      .add_history{
        padding: 0 12px;
        height: 36px;
      }
    }

    &.table{
      flex: 1;
      th{
        padding: 12px;
        text-align: left;
        &.date, &.second, &.third{
          width: 120px;
        }
        &.price{
          width: 120px;
          text-align: center;
        }
        &.first{
          width: 80px;
        }
        &.payment_method{
          width: 180px;
        }
        &.action{
          width: 96px;
        }
      }
      tbody{
        tr{
          transition: background-color .2s;
          &:hover{
            background-color: #ebf3fe;
            .btn30{
              background-color: white;
            }
          }

          &:not(.no-data){
            border-bottom: 1px solid ${Colors.gray_e5};
            td{
              padding: 12px;
            }
          }
          &.no-data td{
            padding: 48px 24px;
            text-align: center;
          }

          td{
            &.price{
              padding: 12px 24px 12px 12px;
              text-align: right;
            }
            .btn_delete{
              margin-left: 12px;
            }

            img{
              height: 30px;
              + p{
                padding-left: 6px;
              }
            }
          }
        }
      }
    }
  }

  .area.table + ul{
    margin: 0 0 -12px;
    padding: 10px 12px 0;
    ${Flex('', 'center', 'center')}

    li{
      padding: 0 4px;
      a{
        width: 30px;
        height: 30px;
        border-radius: 6px;
        ${Flex('', 'center', 'center')}
        cursor: pointer;
      }


      &.selected{
        a{
          background-color: ${Colors.main};
          color: white;
        }
      }
      &:not(.selected):hover{
        a{
          background-color: ${Colors.light_main};
          color: ${Colors.main};
        }
      }
    }
  }
`

export const CalendarViewContainer = styled.div`
  .card{
    height: 100%;
    border-radius: 24px;
  }

  .area{
    &_head{
      ${Flex('', 'center', '')}
      li{
        width: calc(100% * 1/8);
        padding: 6px;
        height: 30px;
        ${Flex('', 'center', 'center')}
        &:nth-child(6){
          color: ${Colors.blue};
        }
        &:nth-child(7){
          color: ${Colors.red};
        }
      }
    }

    &_body{
      height: calc(100% - 30px);
      ${Flex('column')}
      overflow: auto;
      ul{
        border-top: 1px solid ${Colors.gray_e5};
        li{
          width: calc(100% * 1/8);
          min-height: 100px;
          padding: 6px 8px;
          position: relative;
          + li::before{
            content: '';
            width: 1px;
            height: 100%;
            background-color: ${Colors.gray_e5};
            position: absolute;
            top: 0;
            left: -0.5px;
          }
          &:nth-child(6){
            .date{
              color: ${Colors.blue};
            }
          }
          &:nth-child(7){
            .date{
              color: ${Colors.red};
            }
          }
          .row{
            padding-right: 8px;
            position: relative;
            &::before{
              content: '';
              width: 4px;
              height: 4px;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              right: 0;
              transform: translate(0, -50%);
            }
            &.expense{
              /* .price{
                color: ${Colors.red};
              } */
              &::before{
                background-color: ${Colors.red};
              }
            }
            &.income{
              /* .price{
                color: ${Colors.green};
              } */
              &::before{
                background-color: ${Colors.green};
              }
            }
            &.saving{
              /* .price{
                color: ${Colors.yellow};
              } */
              &::before{
                background-color: ${Colors.yellow};
              }
            }
          }
          p{
            font-size: 12px;
            line-height: 1.5;
            &.date{
              padding-bottom: 6px;
              text-align: center;
            }
            &.description{
              max-width: calc(100% - 48px);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            &.price{
              padding-left: 6px;
              text-align: right;
            }
          }
        }
      }
    }
  }
`

export const StatisticsViewContainer = styled.div`
  ${Flex()}

  .card{
    flex: 1;
    padding: 24px 12px;
    border-radius: 24px;
    overflow: auto;
    + .card{
      margin-left: 24px;
    }

    .chart_bx{
      padding-bottom: 100%;
      position: relative;

      .chart_wrap{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }

    .list_bx{
      padding: 24px 12px 0;
      li{
        + li{
          margin-top: 12px;
        }

        p{
          &:nth-child(2){
            padding: 0 12px;
          }
          &.badge{
            width: 40px;
            height: 20px;
            border-radius: 6px;
            color: white;
          }
        }
      }
    }

    .data-none{
      padding: 24px 0;
      text-align: center;
    }
  }
`