import styled from "styled-components";
import { Colors, Flex } from "../../../style/Styles";


export const SettingsHistoryViewContainer = styled.div`
  overflow: auto;

  .card{
    border-radius: 12px;
    + .card{
      margin-top: 24px;
    }

    .btn.add{
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: url(/images/add.svg) no-repeat center center / 14px 14px;
      &:hover{
        background-color: ${Colors.gray_e5};
      }
    }


    &_title{
      padding: 12px 18px;
      p.fs12{
        margin-left: 12px;
      }
    }

    &_cont{
      border-top: 1px solid ${Colors.gray_c};
    }

    &.category{
      .card_cont{
        .grid{
          display: grid;
          .type, .second{
            border-right: 1px solid ${Colors.gray_e5};
          }

          
          &.head{
            grid-template-columns: 140px 140px auto;
            p{
              padding: 12px 18px;
              font-size: 12px;
              color: ${Colors.gray_5};
            }
          }

          &.body{
            grid-template-columns: 140px auto;
            border-top: 1px solid ${Colors.gray_e5};

            &:nth-child(even){
              background-color: #f6f6f6;
              &:last-child{
                border-radius: 0 0 12px 12px;
              }
            }

            .type{
              padding: 12px 18px;
            }

            li{
              &.grid{
                grid-template-columns: 140px auto;
                + li{
                  border-top: 1px solid ${Colors.gray_e5};
                }
                
                .second{
                  padding: 5px 4px 5px 18px;
                }

                ul.third{
                  li{
                    &:nth-child(1){
                      padding: 0 3px 0 10px;
                    }
                    &.flex.ai-c{
                      height: 100%;
                      padding: 6px 7px 6px 14px;
                      position: relative;
                      &:before{
                        content: '';
                        width: calc(100% - 6px);
                        height: calc(100% - 12px);
                        border-radius: 15px;
                        background-color: ${Colors.light_main};
                        position: absolute;
                        top: 6px;
                        left: 3px;
                      }
                      p{
                        margin-right: 4px;
                        font-size: 13px;
                        position: relative;
                      }
                      .btn.more{
                        &:hover{
                          background-color: rgba(255, 255, 255, .75);
                        }
                      }
                    }
                  }
                }
              }

              &.add_second{
                padding: 5px 10px;
              }
            }
          }
        }
      }
    }

    &.payment_method{
      .card_cont{
        padding: 12px;
        li{
          padding: 6px;
          div{
            padding: 5px 12px 5px 20px;
            border-radius: 20px;
            box-shadow: rgba(34, 34, 34, 0.1) 2px 2px 6px 2px;
            p{
              padding-right: 12px;
              white-space: nowrap;
            }
            .btn30{
              &:not(:hover){
                background-color: transparent;
              }
            }
          }
        }
      }
    }
  }
`

export const MemberViewContainer = styled.div`
  .btn.add_member{
    height: 36px;
    margin: 0 0 24px;
    padding: 0 12px;
  }

  .division_title{
    color: ${Colors.gray_5};
    + ul{
      margin: 12px 0 0;
    }
  }

  ul{
    max-width: 400px;
    border-radius: 12px;
    + .division_title{
      margin: 36px 0 0;
    }
    li{
      padding: 12px;
      ${Flex('', 'center')}

      h6{
        flex: 1;
        padding: 0 12px 0 0;
        span{
          margin: 0 0 0 12px;
          padding: 4px 8px;
          border-radius: 12px;
          background-color: ${Colors.light_main};
          color: ${Colors.main};
        }
      }

      button{
        padding: 6px 15px;
        border-radius: 30px;
      }
    }
  }
`   