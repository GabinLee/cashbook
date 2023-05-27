import styled from "styled-components";
import { Colors } from "../../style/Styles";

export const Container = styled.section`
  width: 100%;
  height: 100vh;
  background: linear-gradient(to right, ${Colors.blue}, ${Colors.purple});

  .cont{
    margin: auto;
    padding: 36px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 25px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);

    h5{
      margin-bottom: 24px;
      color: white;
      text-align: center;
    }

    button{
      width: 300px;
      height: 45px;
      border-radius: 6px;
      overflow: hidden;
    }

    /* max-width: 1200px;
    padding: 36px;
    color: white;
    display: flex;
    align-items: center;
    flex-wrap: wrap; */

    /* .input_field{
      margin: 13px 0 37px;
      input{
        color: white;
      }

      p{
        color: white;
        transition: all .25s;
      }
    }

    .contained.main{
      width: 100%;
      height: 40px;
      margin-top: 60px;
    }

    .group_btn{
      margin-top: 36px;
      button{
        padding: 0;
        color: white;
        font-size: 13px;
        background-color: transparent;
        + button{
          margin-left: 24px;
          position: relative;
          &::before{
            content: '';
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background-color: white;
            position: absolute;
            top: 50%;
            left: -12px;
            transform: translate(-50%, -50%);
          }
        }

        &:hover{
          text-decoration: underline;
        }
      }
    } */
  }
`