import styled from "styled-components";
import { Colors } from "../../style/Styles";

export const HistoryContainer = styled.main`
  padding: 24px 24px 0;

  .main_tab{
    padding: 0 0 20px;
    ul{
      height: 40px;
      border: 1px solid ${Colors.gray_e};
      border-radius: 6px;
      background-color: white;
      display: inline-flex;

      li{
        height: 100%;
        &:first-child button{
          border-radius: 6px 0 0 6px;
        }
        &:last-child button{
          border-radius: 0 6px 6px 0;
        }

        button{
          height: 100%;
          padding: 0 36px;
          background-color: transparent;
          &.active{
            color: white;
            background-color: ${Colors.main};
          }
        }
      }
    }
  }

  /* .tabs{
    display: flex;
    position: relative;
    &::before{
      content: '';
      width: calc(100% - 48px);
      height: 2px;
      border-radius: 2px;
      background-color: var(--gray_be);
      position: absolute;
      bottom: 0;
      left: 24px;
      z-index: 0;
    }


    button{
      z-index: 1;
      + button{
        margin-left: 6px;
      }
    }

    + .contents{
      overflow: auto;
    }
  } */


  /* .contents{
    max-width: 1440px;
    height: calc(100% - 60px);
  } */
`

export const SettingsContainer = styled.main`
  padding: 24px;
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
        background-color: ${Colors  .gray_e5};
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