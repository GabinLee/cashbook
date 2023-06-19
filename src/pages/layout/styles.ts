import styled from "styled-components";
import { Colors } from "../../style/Styles";


export const Container = styled.div`
  height: 100vh;
  display: flex;

  .header_nav{
    display: flex;
    flex-direction: column;
    background-color: white;

    header{
      width: 240px;
      height: 60px;
      background-color: ${Colors.main};
      display: flex;
      button{
        width: 100%;
        background-color: inherit;
      }
      img{
        width: 48px;
        margin: auto;
      }
    }

    nav{
      width: 240px;
      flex: 1;
      overflow: auto;
      .btn_nav{
        width: calc(100% - 24px);
        height: 50px;
        margin: 12px 12px 0;
        padding-left: 12px;
        border: none;
        border-radius: 6px;
        background-color: transparent;
        display: flex;
        align-items: center;
        transition: background-color .2s;
        cursor: pointer;
        &:hover, &.active{
          background-color: ${Colors.light_main};
          color: #2b80f0;
        }

        img{
          width: 20px;
          margin-right: 12px;
          transition: all .2s;
        }
        span{
          color: inherit;
          text-align: left;
          transition: color .2s;
        }

        .popover{
          width: 30px;
          height: 30px;
          .more{
            transition: background-color .2s;
          }
          &_menu{
            display: none;
          }

          &:hover{
            cursor: pointer;
            .more{
              background-color: white;
            }
            .popover_menu{
              display: block;
            }
          }
        }
      }
    }


    .area{
      &.add_cashbook{
        padding: 12px 24px;
        button{
          width: 100%;
          height: 40px;
        }
      }
      &.profile{
        background-color: ${Colors.gray_e5};
        height: 60px;
        padding: 18px 24px;
        button{
          background-color: transparent;
        }
      }
    }
  }

  main{
    width: calc(100% - 240px);
    min-width: 1200px;
  }
`