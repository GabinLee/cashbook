import styled from "styled-components";
import { Colors } from "../../style/Styles";


export const Container = styled.main`
.modal{
  padding: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  inset: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 101;

  .card{
    min-width: 260px;
    height: auto;
    max-height: 100%;
    border-radius: 24px;
    overflow: auto;
  }
}

  .add_cashbook{
    padding: 24px 24px 12px;
    button{
      width: 120px;
      height: 40px;
    }
  }

  section{
    + section{
      margin-top: 36px;
    }

    h5{
      padding: 24px 24px 0;
      color: ${Colors.main};
    }

    ul{
      padding: 12px 12px 0;
      li{
        width: 25%;
        padding: 12px;
        .card{
          padding: 20px 12px 20px 24px;
          border-radius: 12px;
        }
      }
    }
  }


  /*
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
  } */
`