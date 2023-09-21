import styled from "styled-components";
import { Colors, Flex } from "../../style/Styles";

export const HistoryContainer = styled.main`
  .main_top{
    padding: 24px;
  }

  .main_tab{
    padding: 0 24px 20px;
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

  .main_cont{
    height: calc(100% - (93px + 60px));
    padding: 0 24px 24px;
  }
`

export const SettingsContainer = styled.main`
  .set_top{
    padding: 12px 24px 0 14px;
    ${Flex('', 'center')}

    button.prev{
      width: 36px;
      height: 36px;
      margin: 0 12px 0 0;
      border-radius: 50%;
      background: url(/images/prev.svg) no-repeat center center / 20px 20px ;
    }
  }

  ul.tab{
    padding: 12px 24px 0;
    ${Flex()}
    position: relative;
    &::before{
      content: '';
      width: calc(100% - 48px);
      height: 2px;
      border-radius: 2px;
      background-color: ${Colors.gray_c};
      position: absolute;
      left: 24px;
      bottom: 0;
    }

    li{
      height: 40px;
      padding: 0 24px;
      ${Flex('', 'center', 'center')}
      cursor: pointer;
      position: relative;
      transition: color .25s;

      &:not(.active){
        &:hover{
          color: ${Colors.main};
        }
      }

      &.active{
        color: ${Colors.main};
        &:before{
          content: '';
          width: 100%;
          height: 2px;
          border-radius: 2px;
          background-color: ${Colors.main};
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }
    }
  }

  .set_cont{
    height: calc(100% - (64px + 36px));
    padding: 20px 24px 24px;
  }
`