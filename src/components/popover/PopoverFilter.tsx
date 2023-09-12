import { useEffect, useRef } from "react";
import styled from "styled-components"
import BasePopover from "./BasePopover"
import { Colors } from "../../style/Styles";
import { useOutsideTouch } from "../../utils/Hooks";


type PopoverMenuProps = {
  children: React.ReactNode;
  filterName: string
  isShowFilterPopover: boolean;
  onClickShowPopover: () => void;
  onClickHidePopover: () => void;
  classname: string;

  onClickReset: () => void;
  onClickApplyFilter: () => void;
}


export default function PopoverFilter(props: PopoverMenuProps) {
  const popoverRef = useRef<HTMLLIElement>(null);
  const isOutsideTouch = useOutsideTouch(popoverRef);

  useEffect(() => {
    if(isOutsideTouch) props.onClickHidePopover();
  }, [isOutsideTouch])

  return (
    <PopoverFilterLi
      className="filter_item"
      ref={popoverRef}
    >
      <button
        className="filter_item_button"
        onClick={props.onClickShowPopover}
      >{props.filterName}</button>

      {props.isShowFilterPopover && (
        <BasePopover
          classname={props.classname}
        >
          <ul className="contents">{props.children}</ul>

          <div className="btns flex">
            <button className="contained gray"
              onClick={props.onClickReset}
            >초기화</button>
            <button className="contained main"
              onClick={props.onClickApplyFilter}
            >적용</button>
          </div>
        </BasePopover>
      )}
    </PopoverFilterLi>
    
  )
}


const PopoverFilterLi = styled.li`
  margin-right: 12px;
  position: relative;

  .filter_item_button{
    height: 36px;
    border-radius: 18px;
    padding: 0 34px 0 15px;
    background: white url(/images/arrow_down.svg) no-repeat right 12px center / 10px 10px;
    box-shadow: rgba(34, 34, 34, 0.1) 2px 2px 6px 2px;
    &:hover{
      background-color: ${Colors.light_main};
    }
  }

  .popover{
    max-height: 600px;
    overflow: auto;
    top: 40px;
    left: 0;

    .contents{
      padding: 24px 24px 12px;
      .title{
        margin: 0 0 12px;
        display: grid;
        grid-template-columns: 80px 132px 1fr;
        p{
          color: ${Colors.gray_5};
          font-size: 12px;
          + p{
            padding-left: 12px;
          }
        }
      }
    }
    
    .btns{
      padding: 12px 24px 24px;
      background-color: white;
      justify-content: flex-end;
      position: sticky;
      bottom: 0;
      .contained{
        height: 40px;
        &.gray{
          flex: 1;
          min-width: 80px;
          max-width: 120px;
        }
        &.main{
          flex: 2;
          min-width: 120px;
          max-width: 240px;
          margin: 0 0 0 12px;
        }
      }
    }

    .first{
      display: grid;
      grid-template-columns: 80px 1fr;
      position: relative;
      &::before{
        content: '';
        width: 1px;
        height: 100%;
        background-color: ${Colors.gray_e5};
        position: absolute;
        top: 0;
        left: 80px;
      }
      
      &.income{
        border-top: 2px solid ${Colors.green};
      }
      &.expense{
        border-top: 2px solid ${Colors.red};
      }
      &.saving{
        border-top: 2px solid ${Colors.yellow};
      }
      + .first{
        margin-top: 24px;
      }

      .second{
        position: relative;
        &::before{
          content: '';
          width: 1px;
          height: 100%;
          background-color: ${Colors.gray_e5};
          position: absolute;
          top: 0;
          left: 132px;
        }

        > li{
          padding: 3px 0 3px 12px;
          display: grid;
          grid-template-columns: 120px 1fr;
          + li{
            border-top: 1px solid ${Colors.gray_e5};
          }
        }

        .third{
          width: 480px;
          padding-left: 12px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
        }
      }
    }

    /* &.first{
      width: 360px;
      .contents{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    &.second{
      width: 360px;
      .first_group{
        + .first_group{
          margin-top: 24px;
        }

        .first_name{
          margin-bottom: 6px;
        }

        .checkbox_field{
          width: calc(50% - 6px);
          &:nth-child(even){
            margin-left: 12px;
          }
          &:nth-child(2) ~ .checkbox_field{
            margin-top: 6px;
          }
        }

        &.expense{
          .first_name{
            color: ${Colors.red};
          }
          input[type=checkbox]{
            &:checked + label .mark{
              border-color: ${Colors.red};
              background-color: ${Colors.red};
            }
            + label:hover::before{
              background-color: rgba(228,0,0, .2);
            }
          }
        }
        &.income{
          .first_name{
            color: ${Colors.green};
          }
          input[type=checkbox]{
            &:checked + label .mark{
              border-color: ${Colors.green};
              background-color: ${Colors.green};
            }
            + label:hover::before{
              background-color: rgba(56,138,73, .2);
            }
          }
        }
        &.saving{
          .first_name{
            color: ${Colors.yellow};
          }
          input[type=checkbox]{
            &:checked + label .mark{
              border-color: ${Colors.yellow};
              background-color: ${Colors.yellow};
            }
            + label:hover::before{
              background-color: rgba(246,146,0, .25);
            }
          }
        }
      }
    } */

    &.payment_method{
      .checkbox_field + .checkbox_field{
        margin-top: 4px;
      }
    }
  }
`