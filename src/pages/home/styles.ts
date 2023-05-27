import styled from "styled-components";
import { Colors } from "../../style/Styles";
// import { Colors } from "../../style/Styles";


export const Container = styled.main`
  padding: 24px 24px 0;

  .add_cashbook{
    height: 36px;
    margin-bottom: 14px;
    padding: 0 12px;
    position: relative;
  }
  
  ul{
    max-height: calc(100% - 50px);
    margin: 0 -12px;
    padding-bottom: 12px;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    
    li{
      width: calc(100% * 1/3);
      padding: 12px;
      display: flex;
      flex-wrap: wrap;
      &:nth-child(1), &:nth-child(2), &:nth-child(3){
        margin-top: -12px;
      }
    }
  }

  .card{
    width: 100%;
    min-width: 288px;
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;

    &:hover{
      background-color: ${Colors.light_main};
    }

    .name_more{
      margin-bottom: 12px;
    }

    h6{
      padding-right: 6px;
    }

    .popover{
      width: 36px;
      height: 36px;
      margin: -6px -12px 0 0;
      .btn.more{
        background: transparent url(images/more.svg) no-repeat center center / 14px 14px;
        &.active, &:hover{
          background: white url(images/more.svg) no-repeat center center / 14px 14px;
        }
      }
    }

    .member{
      color: ${Colors.gray_5};
    }
  }
`