import styled from "styled-components";

export const Container = styled.main`
  .tabs{
    padding: 24px 24px 0;
  }

  .contents{
    height: calc(100% - 60px);
  }


  .section{
    /* &_summary{
      .month{
        padding: 0 24px;
        span{
          &:nth-child(1){
            font-size: 50px;
          }
          + span{
            margin-left: 4px;
          }
        }
      }
      .card{
        flex: 1;
        margin-left: 24px;
        padding: 12px 24px;
        border-radius: 12px;

        &.income{
          border-left: 12px solid #09814a;
        }
        &.expense{
          border-left: 12px solid #9C0006;
        }
        &.saving{
          border-left: 12px solid #ffba49;
        }
      }
    } */
  }
`