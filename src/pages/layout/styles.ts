import styled from "styled-components";
import { Colors, Flex } from "../../style/Styles";


export const Container = styled.div`
  min-width: 1440px;
  height: 100vh;
  ${Flex('', '', '')}
  overflow: auto;
  
  .header_nav{
    ${Flex('column', '', '')}
    border-right: 1px solid ${Colors.gray_e};
    background-color: white;

    header{
      width: 240px;
      height: 60px;
      background-color: ${Colors.main};
      ${Flex('', '', '')}
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
      /* max-width: 240px; */
      flex: 1;
      overflow-y: auto;
      ul{
        width: 100%;
        min-height: 100%;
        padding: 0 0 12px;
        overflow: hidden;
      }
    }


    .area.profile{
      background-color: ${Colors.gray_e5};
      height: 60px;
      padding: 18px 24px;
      button{
        background-color: transparent;
      }
    }
  }

  main{
    width: calc(100% - 241px);
    /* min-width: 1440px; */
  }
`