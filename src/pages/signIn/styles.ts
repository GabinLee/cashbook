import styled from "styled-components";
import { Colors } from "../../style/Styles";

export const Container = styled.section`
  width: 100%;
  height: 100vh;
  /* background: linear-gradient(to right, ${Colors.blue}, ${Colors.purple}); */
  background: url(/images/background_image.jpg) no-repeat center center / cover;

  .cont{
    margin: auto;
    padding: 60px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 25px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);

    h5{
      margin-bottom: 36px;
      color: white;
      text-align: center;
    }

    .id_pw{
      border: .5px solid white;
      border-radius: 13px;
    }
    .input_field{
      input{
        height: 48px;
        padding: 0 12px;
        color: white;
        background-color: transparent;
        outline-color: white;
        &::placeholder{
          color: rgba(255, 255, 255, 0.6);
        }
      }
      &.id{
        input{
          border: .5px solid white;
          border-radius: 12px 12px 0 0;
        }
      }
      &.pw{
        input{
          border: .5px solid white;
          border-radius: 0 0 12px 12px;
        }
      }
    }


    button.contained.main, .kakao{
      width: 300px;
      height: 45px;
      border-radius: 12px;
      overflow: hidden;
    }
    button.contained.main{
      margin-top: 24px;
    }
    .kakao{
      background-color: #FEE500;
    }

    .group_btn{
      margin-top: 12px;
      button{
        height: 24px;
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
    }

    .or{
      margin: 48px 0 24px;
      color: white;
      font-size: 10px;
      text-align: center;
      position: relative;
      &::before{
        content: '';
        width: 42%;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.5);
        position: absolute;
        top: calc(50% - 0.5px);
        left: 0;
      }
      &::after{
        content: '';
        width: 42%;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.5);
        position: absolute;
        top: calc(50% - 0.5px);
        right: 0;
      }
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
     */
  }
`