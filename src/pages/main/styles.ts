import styled from "styled-components";
import { Colors } from "../../style/Styles";


export const Container = styled.main`
  height: 100vh;

  header{
    width: 100%;
    height: 70px;
    background-color: ${Colors.light_main};
    display: flex;
    position: fixed;
    top: 0;
    z-index: 1;
    button{
      width: 120px;
      margin: auto;
      background-color: inherit;
    }
    img{
      width: 48px;
      margin: auto;
    }
  }

  main{
    max-width: 1440px;
    margin: 0 auto;
    padding: 94px 24px 0;
  }

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
    
    li{
      width: 25%;
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
      margin-top: 12px;
      color: ${Colors.gray_5};
    }
  }
`