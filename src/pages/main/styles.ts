import styled from "styled-components";
import { Colors } from "../../style/Styles";


export const Container = styled.div`
  min-width: 1440px;
  display: flex;
  
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
    height: calc(100% - 120px);
    background-color: white;
    overflow: auto;
    button{
      width: calc(100% - 24px);
      height: 50px;
      margin: 12px 12px 0;
      padding: 0 12px;
      border: none;
      border-radius: 6px;
      background-color: transparent;
      display: flex;
      align-items: center;
      transition: background-color .2s;
      img{
        width: 20px;
        margin-right: 12px;
        transition: all .2s;
      }
      span{
        color: inherit;
        transition: color .2s;
      }
      &:hover, &.active{
        background-color: ${Colors.light_main};
        color: #2b80f0;
      }
    }
  }

  section.profile{
    background-color: ${Colors.gray_e5};
    height: 60px;
    padding: 18px 24px;
  }

  main{
    width: calc(100% - 240px);
    height: 100vh;
  }
`